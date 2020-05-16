import { serverPort } from '../../../config.mjs';

function initGame() {
  const gameConnection = new Connection('wss://127.0.0.1:' + serverPort);
}

class Connection {
  constructor(url) {
    this.url = url;
    this.ws = new WebSocket(url);
    this.ws.onopen = this.handleOpen.bind(this);
    this.ws.onerror = this.handleError.bind(this);
  }

  handleOpen() {
    console.log('connected to ' + this.url)

    this.ws.send('Let me in!');
  }

  handleError(e) {
    console.error(e)
  }
}

document.addEventListener('DOMContentLoaded', initGame);
