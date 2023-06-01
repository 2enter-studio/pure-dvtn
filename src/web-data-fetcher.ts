import "dotenv/config"
import api_config from './api-config.js'
const port = process.env.PORT || 3000;

const delay_time = 10000

const fetch_data = () => {
    let data_to_send = new Object();
    for (const [key, value] of Object.entries(api_config)) {
        fetch(`http://localhost:${port}/api/${key}`).then(res => {
            res.json().then(data => {
                data_to_send[value.keyword] = data
            })
        });
    }
    return data_to_send;
}

const tn_web_data_fetcher = function () {
    const data_to_send = fetch_data();
    setInterval(() => {
        fetch(`http://localhost:${port}/ws/dvtn/webdata`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data_to_send)
        })
        // console.log(data_to_send);
    }, delay_time);
}


export default {
    'fetch_data': fetch_data,
    'tn': tn_web_data_fetcher,
}