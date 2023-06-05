import 'dotenv/config'
import { Request, Response, NextFunction } from 'express'
import mongoose from 'mongoose'
import { ObjectId } from 'mongodb'

const ENV = process.env;
const db_config = {
    cluster_name: ENV.CLUSTER_NAME,
    user: ENV.DB_USERNAME,
    password: ENV.DB_PASSWD,
    name: ENV.DB_NAME,
}

//const db_url = `mongodb+srv://${db_config.user}:${db_config.password}@${db_config.cluster_name}.mongodb.net/${db_config.name}?retryWrites=true&w=majority`
const db_url = `mongodb://127.0.0.1:27017/dataverse-tainan`

let remote_db = mongoose.connection;

const db_connect_no_args = async () => {
    try {
        await mongoose.connect(db_url, {
            // useNewUrlParser: true,
            // useUnifiedTopology: true,
        });
        console.log(`Connected to ${db_config.name} database`);
        return mongoose.connection;
    } catch (error) {
        console.log(`Error Connecting to ${db_config.name} database`);
        console.log(error);
    }
}

const db_connect = async (req: Request, res: Response, next: NextFunction) => {
    try {
        await mongoose.connect(db_url, {
            // useNewUrlParser: true,
            // useUnifiedTopology: true,
        });
        console.log(`Connected to ${db_config.name} database from ${req.originalUrl}`);
        next()
        return
    } catch (error) {
        console.log(`Error Connecting to ${db_config.name} database`);
        console.log(error);
    }
}

async function get_db_data(collection_name: string) {
    const dvtn_data = remote_db.collection(collection_name).find();
    return await dvtn_data.toArray();
}

async function update_db_img(db: mongoose.Connection, req_data: { _id: string, img_data: string }, collection_name: string) {
    const target_collection = db.collection(collection_name);
    const target_id = new ObjectId(req_data._id);

    await target_collection.updateOne(
        { _id: target_id }, { $set: { screenshot: req_data.img_data } }
    );
    console.log(`Image ${req_data._id} added to database`);
}



export default {
    db_connect: db_connect,
    db_connect_no_args: db_connect_no_args,
    get_db_data: get_db_data,
    update_db_img: update_db_img,
};