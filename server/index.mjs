import Config from '../config.mjs';

import path from 'path';
import fs from 'fs';
import https from 'https';
import express from 'express';
import mustacheExpress from 'mustache-express';
import WebSocket from 'ws';

import { ConnectionManager } from './game.mjs';

const serverPath = path.resolve();
const app = express();
app.engine('html', mustacheExpress());
app.set('view engine', 'html');
app.set('views', `${ serverPath }/src/views`);

const server = https.createServer({
  key: fs.readFileSync(Config.keyFile),
  cert: fs.readFileSync(Config.certFile),
  passphrase: Config.certPass
}, app);

server.listen(Config.serverPort, () => {
  console.log(`Listening at https://${ Config.hostname }:${ Config.serverPort }`);
});

app.get('/', (request, response) => {
  response.render('index', { foo: 'bar' });
});

app.use(express.static('dist'));

const wss = new WebSocket.Server({ server });

const cm = new ConnectionManager(wss);

