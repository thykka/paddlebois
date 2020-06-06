import Util from './game-util.mjs';
import Player from './player.mjs';
import Game from './game.mjs';

class Connections {
  constructor(wss) {
    this.wss = wss;
    this.connections = [];
    this.games = [];
    this.players = [];

    this.actions = {
      newPlayer: actionData => this.addNewPlayer(actionData),
      newGame: actionData => this.addNewGame(actionData),
      joinGame: actionData => this.joinGame(actionData),
      playerInput: actionData => {
        console.log(actionData);
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
    this.removePlayer(connection.id);
    this.removeConnection(connection);
    console.log(`${ this.connections.length } connections active`);
  }

  addConnection(ws) {
    const connection = {
      ws,
      id: Util.createId()
    }
    this.connections.push(connection);

    // event listeners
    ws.on('message', message => this.handleMessage(message, connection));
    ws.on('close', message => this.handleDisconnection(message, connection));
  }

  removeConnection(connection) {
    this.connections = this.connections.filter(c => c.id !== connection.id);
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
    const action = this.actions[message.action];
    if(typeof action !== 'function') {
      return;
    }
    const actionData = {
      connectionId: connection.id,
      timestamp: Date.now(),
      ...message.data
    }
    action(actionData);
  }

  sendAction(connection, actionType, data) {
    connection.ws.send(JSON.stringify({ action: actionType, data }));
  }

  broadcastAction(actionType, data, connectionFilter) {
    let connections = typeof connectionFilter === 'function'
      ? this.connections.filter(connectionFilter)
      : this.connections;
    connections.forEach(connection => {
      this.sendAction(connection, actionType, data);
    })
  }

  getConnection(id) {
    return this.connections.find(c => c.id === id);
  }

  getPlayer(connectionId) {
    return this.players.find(p => p.connectionId === connectionId);
  }

  addNewPlayer(actionData) {
    const player = {
      nickname: actionData.nickname || actionData.connectionId,
      connectionId: actionData.connectionId
    };
    this.players.push(player);

    const connection = this.getConnection(actionData.connectionId);
    this.sendAction(connection, 'confirmNewPlayer', player);
    this.broadcastAction(
      'playerJoined',
      { ...player },
      connection => connection.id !== actionData.connectionId
    );

    console.log(`${ this.players.length } players active`);
  }

  removePlayer(connectionId) {
    const { nickname } = this.getPlayer(connectionId);
    this.players = this.players.filter(p => p.connectionId !== connectionId);

    this.broadcastAction('playerLeft', { nickname, connectionId });
  }

  addNewGame() {

  }
}

export default Connections;
