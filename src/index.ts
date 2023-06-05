import 'dotenv/config'
process.env.TZ = 'Asia/Taipei';

import express from 'express';
import { Request, Response, NextFunction } from 'express';
import path from 'path';
import body_parser from 'body-parser'
import { getGlobals } from 'common-es'
import cors from "cors";


// import things runs continuously
import data_fetcher from './web-data-fetcher.js';
import img_client from './img-upload-client.js'

// import routes
import dvtn_router from './routes/dvtn.js';
import ws_router from './routes/ws.js';
import api_router from './routes/api.js'
import screenshot_router from './routes/screenshot.js'
import mail_router from './routes/sendmail.js'

// set port
const port = process.env.PORT || 3000;
const { __dirname, __filename } = getGlobals(import.meta.url)

// initialize express
const app = express();

// set static folder
app.use(express.static(path.join(__dirname, 'public')));

// set body parser
app.use(body_parser.json({ limit: '50mb' }));
app.use(body_parser.urlencoded({ extended: false }));

// set EJS as templating engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use('/dvtn', dvtn_router);
app.use('/ws', ws_router);
app.use('/api', api_router);
app.use('/screenshot', screenshot_router);
app.use('/sendmail', mail_router);


// redirect to /dvtn
app.get('/', (req: Request, res: Response) => {
    res.redirect('/dvtn');
});

app.listen(port, () => {
    console.log(`Listening on http://localhost:${port}`);
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

app.use(cors());

// run: web data fetcher & image upload client
data_fetcher.tn();
img_client.watch_for_img_to_upload();

// export app
export default {
    app: app
};