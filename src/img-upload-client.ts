import 'dotenv/config';
import fs from 'fs';
import watch from 'node-watch';
import db_connection from './db-connection.js';

const db_connect = db_connection.db_connect_no_args;
const update_db_img = db_connection.update_db_img;

const img_folder = process.env.TN_ROOT?.toString() || '/';
const collection_name = 'dvtn';

function get_img(img_file_path: string) {
    const img = fs.readFileSync(`${img_folder}/${img_file_path}`);
    return Buffer.from(img).toString('base64');
}

export default {
    watch_for_img_to_upload: () => {
        watch(img_folder, { recursive: true }, (event, name) => {
            // get all file in folder
            const current_images = fs.readdirSync(img_folder);
            if (current_images.length > 0) {
                console.log(`images to upload: ${current_images}`)
                db_connect().then(db => {
                    if (db) {
                        for (let image of current_images) {
                            console.log(`now processing: ${image}`)
                            const req_data = {
                                _id: image.split('.')[0],
                                img_data: get_img(image)
                            }
                            update_db_img(db, req_data, collection_name).then(() => {
                                console.log(`image ${req_data._id} added to database`)
                                fs.unlinkSync(`${img_folder}/${image}`);
                                console.log(`image ${req_data._id} deleted locally`)
                            }).catch(err => {
                                console.log(err)
                            });
                        }
                    }
                })
            }
        })
    }
}