import 'dotenv/config'
import express from 'express'
import WebSocket from 'ws';
import ws_server from '../ws-server.js';

const router = express.Router();

const valid_ws_types = {
    tn: ['button', 'slider', 'webdata', 'name', 'birthday'],
}

router.post('/dvtn/:type', (req, res) => {
    const ws_type = req.params.type;
    const data = req.body;

    if (!valid_ws_types.tn.includes(ws_type)) {
        res.status(400).send('Invalid Request!');
        return;
    }

    data.ws_type = ws_type;
    data.is_button = (req.params.type === 'button');
    // console.log(data);

    ws_server.clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify(data));
            console.log(`Sent ${JSON.stringify(data)} to client`);
        } else {
            console.log('Client not ready')
        }
    });
    res.status(200).send(
        `
        POST request sent successfully!
        This is your request body:
        ${JSON.stringify(data, null, 2)}
    `
    );
});

export default router;