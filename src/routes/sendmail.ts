import 'dotenv/config';
import express from 'express';
import nodemailer from "nodemailer";
import { Request, Response, NextFunction } from 'express';
import db_connection from '../db-connection.js';

const router = express.Router();
const mailbot: { host: string, port: string | number, user: string, passwd: string } = {
    host: process.env.MAIL_BOT_HOST || 'gmail',
    port: process.env.MAIL_BOT_PORT || 0,
    user: process.env.MAIL_BOT_USER || '',
    passwd: process.env.MAIL_BOT_PASSWD || '',
}

const mail_transporter = nodemailer.createTransport({
    host: mailbot.host,
    pool: true,
    port: mailbot.port,
    secure: false,
    auth: {
        user: mailbot.user,
        pass: mailbot.passwd,
    }
})

console.log('mail transporter created')

router.post('/', (req: Request, res: Response, next: NextFunction) => {
    console.log('request got')
    const id = req.body.id;
    const client_email = req.body.email;

    const mail_content = {
        from: process.env.MAIL_BOT_USER,
        to: client_email,
        subject: "mailbot test",
        text: `testing... testing... ${id}`,
    }

    mail_transporter.sendMail(mail_content, (err, info) => {
        if (err) {
            console.log(err);
            res.send(err)
        } else {
            console.log(info);
            res.send(info);
            next();
        }
    })
});

export default router;