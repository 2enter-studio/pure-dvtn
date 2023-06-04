import 'dotenv/config'
import express from 'express'

const router = express.Router();
import api_routes from '../api-config.js';

for (const [key, value] of Object.entries(api_routes)) {
    router.get(key, (req, res) => {
        fetch(value.url)
            .then(response => response.json())
            .then(data => {
                res.send(value.parser(data))
            }).catch(err => {
                console.log(err);
            });
    });
};


router.get('/', (req, res) => {
    res.send('API is working properly');
});

export default router;