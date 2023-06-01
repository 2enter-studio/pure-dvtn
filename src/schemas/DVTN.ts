import mongoose from "mongoose";
const DVTN_Schema = new mongoose.Schema({
    name: { type: String, required: true },
    birthday: { type: Date, required: true },
    slider_1: { type: Number, required: true },
    slider_2: { type: Number, required: true },
    webdata: {
        traffic_1: { type: Number, required: true },
        traffic_2: { type: Number, required: true },
        traffic_3: { type: Number, required: true },
        is_rain: { type: Boolean, required: true },
        temp: { type: Number, required: true },
    },
    screenshot: Buffer,
    submit_date: {
        type: Date,
        immutable: true,
        default: () => Date.now()
    },
    ue5_data: {
        camera_info: {
            pos: {
                x: Number,
                y: Number,
                z: Number
            },
            rot: {
                x: Number,
                y: Number,
                z: Number
            }
        },
        dist: Number
    }

});

export default mongoose.model('DVTN', DVTN_Schema);