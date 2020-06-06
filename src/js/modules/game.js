import { hostname, serverPort } from '../../../config.mjs';

const nickInput = document.getElementById('nickname');
const createPlayerForm = document.getElementById('createPlayer');

createPlayerForm.addEventListener('submit', ev => {
  ev.preventDefault();
  const nickname = nickInput.value;
  const game = new Game({ nickname });
})

/*
document.addEventListener('DOMContentLoaded', initGame);
function initGame() {
  const game = new Game();
  console.log(game)
}
*/

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

    this.connection = new Connection({
      game: this,
      connectedCallback: (connection) => {
        this.handleConnected(connection)
      }
    });
  }

  handleConnected(connection) {
    console.log('connected to ' + connection.wsUrl);
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

  handleAction(action, data) {
    switch(action) {
      case 'confirmNewPlayer': {
        console.log('New player confirmed', data);
        break;
      }
      case 'playerLeft': {
        console.log('Player left', data);
        break;
      }
      case 'playerJoined': {
        console.log('Player joined', data);
        break;
      }
      default: {
        console.warn('Unkown action', action, data);
      }
    }
  }
}

class Connection {
  constructor(options) {
    this.game = options.game;
    this.connectedCallback = options.connectedCallback;
    this.wsUrl = `wss://${ options.game.hostname }:${ options.game.port }`;
    this.ws = new WebSocket(this.wsUrl);
    this.ws.onopen = this.handleOpen.bind(this);
    this.ws.onerror = this.handleError.bind(this);
    this.ws.onmessage = this.handleMessage.bind(this);
    window.addEventListener('beforeunload', this.disconnect.bind(this));
  }

  sendAction(actionType, data) {
    this.ws.send(JSON.stringify({ action: actionType, data }));
  }

  handleOpen() {
    this.sendAction('newPlayer', { nickname: this.game.nickname });
    this.connectedCallback(this);
  }

  handleError(e) {
    console.error(e)
  }

  handleMessage(message) {
    const parsedData = JSON.parse(message.data);
    const { action, data } = parsedData;
    if(action) {
      this.game.handleAction(action, data);
    } else {
      console.warn('No action in message: ' + message);
    }
  }

  disconnect() {
    this.ws.close();
  }
}
