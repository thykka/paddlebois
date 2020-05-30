class ConnectionManager {
  constructor(wss) {
    this.wss = wss;
    this.connections = [];
    this.games = [];
    this.players = [];

    this.knownActions = {
      newPlayer: (connection, actionData) => this.addPlayer(connection, actionData),
      newGame: (connection, actionData) => this.addGame(connection, actionData),
      playerInput: (connection, actionData) => {
        console.log({...actionData, actionTime: Date.now() });
      }
    }
    this.init();
  }

  init() {
    this.wss.on('connection', this.handleConnection.bind(this));
  }

  handleConnection(ws) {
    this.addConnection(ws);

    console.log(`${ this.connections.length } connections active`);
  }

  handleDisconnection(message, connection) {
    this.removePlayer(connection);
    this.removeConnection(connection);
    console.log(`${ this.connections.length } connections active`);
  }

  addConnection(ws) {
    const connection = {
      ws,
      id: this.createId(ws)
    }

    this.connections.push(connection);

    // event listeners
    ws.on('message', message => this.handleMessage(message, connection));
    ws.on('close', message => this.handleDisconnection(message, connection));
  }

  removeConnection(connection) {
    this.connections = this.connections.filter(c => c.id !== connection.id);
  }

  createId(ws) {
    return Math.random().toString(36).slice(-8);
  }

  handleMessage(message, connection) {
    try {
      message = JSON.parse(message);
    } catch(e) {
      console.warn('Malformed message: ' + message);
      return;
    }
    if(!message.action) {
      console.warn('Action type missing from message' + JSON.stringify(message));
      return;
    }
    const action = this.knownActions[message.action];
    if(typeof action !== 'function') {
      return;
    }
    action(connection, message.data);
  }


  addPlayer(connection, playerData) {
    const player = {
      nickname: playerData.nickname || connection.id || 'incognito',
      connectionId: connection.id
    };
    this.players.push(player);
    this.sendAction(connection, 'confirmNewPlayer', player);
    console.log(`${ this.players.length } players active`);
  }

  removePlayer(connection) {
    const player = this.players.find(p => p.connectionId === connection.id);
    this.players = this.players.filter(p => p.connectionId !== connection.id);
    this.wss.clients.forEach(client => {
      this.sendAction({ ws: client }, 'playerLeft', {
        playerId: player.id
      });
    });
  }

  sendAction(connection, actionType, data) {
    connection.ws.send(JSON.stringify({ action: actionType, data }));
  }
}

class Game {
  constructor() {
    this.players = [];
  }
}

export {
  ConnectionManager,
  Game
};
