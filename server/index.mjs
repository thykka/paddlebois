import Config from '../config.mjs';

import path from 'path';
import fs from 'fs';
import https from 'https';
import express from 'express';
import mustacheExpress from 'mustache-express';
import WebSocket from 'ws';

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
  console.log(`Listening at https://127.0.0.1:${ Config.serverPort }`);
});

app.get('/', (request, response) => {
  response.render('index', { foo: 'bar' });
});

app.use(express.static('dist'));

const wss = new WebSocket.Server({ server });

wss.on('connection', handleConnection);


function handleConnection(ws) {
  ws.on('message', handleMessage);
}

function handleMessage(message) {
  console.log(`message: ${ message }`);
}