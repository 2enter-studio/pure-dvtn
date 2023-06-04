import 'dotenv/config'
process.env.TZ = 'Asia/Taipei';

import express from 'express';
import { Request, Response, NextFunction } from 'express';
import path from 'path';
import body_parser from 'body-parser'

const port = process.env.PORT || 3000;
const app = express();
import { getGlobals } from 'common-es'
const { __dirname, __filename } = getGlobals(import.meta.url)

import data_fetcher from './web-data-fetcher.js';
import dvtn_router from './routes/dvtn.js';
import ws_router from './routes/ws.js';
import api_router from './routes/api.js'
import screenshot_router from './routes/screenshot.js'
import mail_router from './routes/sendmail.js'

app.use(express.static(path.join(__dirname, 'public')));

app.use(body_parser.json({ limit: '50mb' }));
app.use(body_parser.urlencoded({ extended: false }));

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use('/dvtn', dvtn_router);
app.use('/ws', ws_router);
app.use('/api', api_router);
app.use('/screenshot', screenshot_router);
app.use('/sendmail', mail_router);


app.get('/', (req: Request, res: Response) => {
    res.redirect('/dvtn');
});

// Fixing CORS Error
app.use((req, res) => {
    res.header('Access-Control-Allow-Origin', '*'); // '*' means allow all websites
    res.header(
        'Access-Control-Allow-Headers',
        'Origin, X-Requested-With, Content-Type, Accept, Authorization'
    );
    if (req.method === 'OPTIONS') {
        res.header(
            'Access-Control-Allow-Methods',
            'GET, POST, PATCH, DELETE, PUT'
        );
        return res.status(200).json({});
    }
});

app.listen(port, () => {
    console.log(`Listening on http://localhost:${port}`);
});

data_fetcher.tn();

export default {
    app: app
};