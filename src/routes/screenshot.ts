import express from 'express';
import mongoose from 'mongoose'
const router = express.Router();
import db_connection from '../db-connection.js'
const db_connect = db_connection.db_connect;
const get_db_data = db_connection.get_db_data;


let current_id = 0;

const remote_db = mongoose.connection;

async function update_image_by_id(id: mongoose.Types.ObjectId, image: string, collection_name: string) {
    await remote_db.collection(collection_name)
        .updateOne({ _id: id }, { $set: { screenshot: image } });
}

router.post('/:collection', (req, res) => {
    const collection_name = req.params.collection;
    const data = req.body;
    console.log(`get screenshot data: ${JSON.stringify(data)}`);
    res.send(data);
})

export default router;