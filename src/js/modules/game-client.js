import { hostname, serverPort } from '../../../config.mjs';

import IOClient from 'socket.io-client';
import PaddleGame from '../../../server/paddle-game.mjs';

document.addEventListener('DOMContentLoaded', () => {
  const canvas = document.createElement('canvas');
  document.body.appendChild(canvas);
  const renderer = new ClientRenderer({ canvas });
  const client = new Client({ renderer });
})

class Client {
  constructor(options = {}) {
    const defaults = {
      hostname,
      port: serverPort,
      actionKeys: {
        'moveLeft': ['ArrowLeft', 'a'],
        'moveRight': ['ArrowRight', 'd'],
        'usePower': [' ', 'Enter']
      }
    }
    Object.assign(this, defaults, options);

    this.connect();
  }

  connect() {
    this.socket = IOClient(`https://${ hostname }:${ serverPort }`);
    this.socket.on('connect', () => this.handleConnected());
    this.socket.on('reconnect', () => this.handleConnected());
    this.socket.on('gameWithSlots', gameId => this.joinGame(gameId));
    this.socket.on('update', (state) => {
      if(this.game) {
        this.game.syncState(state);
        console.log(this.game.state.ball.position);
      } else {
        console.warn('game not initialized', state)
      }
    });
  }

  handleConnected() {
    console.log('connected');
    // init pre-game stuff
  }

  joinGame(gameId) {
    console.log('joining', gameId);
    this.game = new PaddleGame({ id: gameId });

    this.queueDraw();
  }

  queueDraw(time) {
    this.renderer.draw(this.game, time);
    this.rafId = window.requestAnimationFrame(time => this.queueDraw(time));
  }
}

class ClientRenderer {
  constructor(options) {
    const defaults = {
      width: 320,
      height: 320
    };
    Object.assign(this, defaults, options);
    this.initCanvas()
  }

  initCanvas() {
    this.canvas.width = this.width;
    this.canvas.height = this.height;

    this.ctx = this.canvas.getContext('2d');
    this.ctx.fillStyle = '#FFF';
  }

  draw(game, time) {
    const { ball } = game.state;
    this.ctx.clearRect(0, 0, this.width, this.height);
    this.ctx.fillRect(
      ball.position[0] * this.width,
      ball.position[1] * this.height,
      10, 10
    );
  }
}
