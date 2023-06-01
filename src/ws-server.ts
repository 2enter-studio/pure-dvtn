import 'dotenv/config'
import { WebSocketServer } from "ws";
import express from 'express'
import http from 'http'

const ws_port_tn = process.env.WS_PORT_TN || 3002;
const tn_server = http.createServer(express());

tn_server.listen(ws_port_tn, () => {
    console.log(`WS Server for DVTN listening on port ${ws_port_tn}`);
});

const ws_server_tn = new WebSocketServer({ server: tn_server });

ws_server_tn.on('connection', (ws) => {
    console.log(`New WS connection to DVTN`);
});

export default ws_server_tn

