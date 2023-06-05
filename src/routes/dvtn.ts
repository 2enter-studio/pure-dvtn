import 'dotenv/config'
import mongoose from 'mongoose'
import WebSocket from 'ws';
import express from 'express'
import db_connection from '../db-connection.js'
import DVTN_Model from '../schemas/DVTN.js'

const collection_name = 'dvtn';
const ObjectId = mongoose.Types.ObjectId;
const router = express.Router();

let current_id: number = 0;

let current_webdata = {
    traffic_1: 20,
    traffic_2: 20,
    traffic_3: 20,
    is_rain: false,
    temp: 280,
}

const ws_listener = new WebSocket(`ws://localhost:${process.env.WS_PORT_TN || 3002}`);
ws_listener.on('message', (ws: string) => {
    const data = JSON.parse(ws);
    if (data.ws_type === 'webdata') {
        current_webdata.traffic_1 = data.traffic_1;
        current_webdata.traffic_2 = data.traffic_2;
        current_webdata.traffic_3 = data.traffic_3;
        current_webdata.is_rain = data.is_rain;
        current_webdata.temp = data.temp;
        console.log("Latest Web Data: ", current_webdata);
    }
});

const remote_db = mongoose.connection;

async function insert_data_to_db(data: any) {
    const data_to_insert = await DVTN_Model.create(data);
    current_id = data_to_insert.id;
    console.log(current_id);
    await remote_db.collection(collection_name).insertOne(data_to_insert);
}

router.get('/', db_connection.db_connect, (req, res) => {
    res.render('index', { title: 'DVTN', local_url_base: `http://${process.env.LOCAL_IP_ADDR}:${process.env.PORT}` });
});

router.get('/:id', db_connection.db_connect, (req, res) => {
    const target_id = new ObjectId(req.params.id);
    console.log(req.params.id)
    remote_db.collection(collection_name).findOne({ _id: target_id }).then(data => {
        res.render('result', { content: data });
    })
})

router.post('/ue5-post', db_connection.db_connect, (req, res) => {
    const data = req.body;
    console.log('received ue5-post request!');

    const is_valid = () => {
        console.log(data);
        return data.type == 'ue5-response';
    }

    if (is_valid()) {
        let target_id: mongoose.Types.ObjectId;
        if (data._id != '') target_id = new ObjectId(data._id);
        else target_id = new ObjectId(current_id);
        console.log(`
            received post request from UE5:
            ${JSON.stringify(data, null, 2)}
        `);

        remote_db.collection(collection_name).findOne(
            { _id: target_id }, { projection: { submit_date: 1, ue5_data: 1 } }
        ).then(data => {
            console.log(JSON.stringify(data));
        })

        remote_db.collection(collection_name).updateOne(
            { _id: target_id }, { $set: { ue5_data: data } }
        ).then(() => {
            console.log(`updated ue5 data (id: ${data._id}) to db!`);
            remote_db.collection(collection_name).findOne(
                { _id: target_id }, { projection: { submit_date: 1, ue5_data: 1 } }
            ).then(data => {
                console.log(JSON.stringify(data));
            });
            res.send('ok')
        })
    } else {
        console.log('Invalid ue5-post request!')
        console.log(`data received: ${JSON.stringify(data)}`)
    }
})

router.post('/', db_connection.db_connect, (req, res) => {
    let data = req.body;
    console.log(JSON.stringify(req.body))
    let data_to_db = data
    data_to_db.webdata = current_webdata;

    insert_data_to_db(data_to_db)
        .then(() => {
            data._id = current_id;
            fetch(`http://localhost:${process.env.PORT || 3000}/ws/dvtn/button`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(req.body)
            });
        }).then(() => {
            res.redirect(`/dvtn/${current_id}`);
        })
});

export default router;