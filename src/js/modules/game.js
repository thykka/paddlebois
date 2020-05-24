import { hostname, serverPort } from '../../../config.mjs';

document.addEventListener('DOMContentLoaded', initGame);

function initGame() {
  const game = new Game();
  console.log(game)
}

class Game {
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

    this.connection = new Connection(
      this, () => this.handleConnected()
    );
  }

  handleConnected() {
    this.initKeys();
  }

  initKeys() {
    addEventListener('keydown', event => this.handleKeys(event));
    addEventListener('keyup', event => this.handleKeys(event));
  }

  handleKeys(event) {
    const { key } = event;
    const action = this.getKeyAction(key);
    if(!action) return;

    let pressed = false;
    let released = false;

    switch(event.type) {
      case 'keydown': {
        pressed = true;
        break;
      }
      case 'keyup': {
        released = true;
        break;
      }
      default: {
        throw Error('unknown event type: ' + event.type);
      }
    }

    this.connection.sendAction('playerInput', {
      pressed, released, action
    });
  }

  /**
   * Returns the action for a given key
   * @param {String} key - The key to find, e.g.: 'Enter'
   * @returns {String|undefined} - The matching action, if any
   */
  getKeyAction(key) {
    return (
      Object.entries(this.actionKeys).find(([_, keys]) => {
        return keys.includes(key)
      }) || []
    )[0];
  }
}

class Connection {
  constructor(game, callback) {
    this.game = game;
    this.callback = callback;
    this.wsUrl = `wss://${ game.hostname }:${ game.port }`;
    this.ws = new WebSocket(this.wsUrl);
    this.ws.onopen = this.handleOpen.bind(this);
    this.ws.onerror = this.handleError.bind(this);
    this.ws.onmessage = this.handleMessage.bind(this);
  }

  sendAction(actionType, data) {
    this.ws.send(JSON.stringify({ action: actionType, data }));
  }

  handleOpen() {
    console.log('connected to ' + this.wsUrl)
    this.ws.send('Let me in!');
    this.callback();
  }

  handleError(e) {
    console.error(e)
  }

  handleMessage(data) {
    console.log(data);
  }
}
