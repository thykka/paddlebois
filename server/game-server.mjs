
import SocketIO from 'socket.io';
import PaddleGame from './paddle-game.mjs';

const log = (...messages) => {
  console.log(new Date(), ...messages);
}

class GameServer {
  constructor(options) {
    this.server = options.server;
    this.games = [];
    this.loopId = false;
    this.loopInterval = 1000 / 30;

    this.init();
  }

  init() {
    this.io = SocketIO(this.server);
    this.io.on('connection', client => this.addClient(client));
    this.loop();
  }

  loop() {
    this.lastTime = this.time || Date.now();
    this.time = Date.now();
    this.update(this.time - this.lastTime);

    this.loopId = setTimeout(() => {
      this.loop();
    }, this.loopInterval);
  }

  update(elapsed) {
    // log('update')
    const games = Object.values(this.games);
    games.forEach((game) => {
      game.update(elapsed);
      game.clients.forEach(id => {
        const client = this.getClient(id);
        client && client.emit('update', game.state);
      })
    });
  }

  addClient(client) {
    log('client joined', client.id);
    client.on('disconnect', () => this.removeClient(client.id));

    let game = false;
    const gamesWithSlots = Object.values(this.games).filter(
      game => game.clients.length < 2
    );
    if(gamesWithSlots.length) {
      game = gamesWithSlots[0];
    }
    // If there are no games with free slots...
    else {
      game = this.createGame();
      this.games[game.id] = game;
    }
    game.addClient(client.id);
    log('join game', game.id);
    client.emit('gameWithSlots', game.id);
  }

  createGame(options) {
    return new PaddleGame(options);
  }

  getClients(roomId = 'lobby') {
    return Object.keys(this.io.in(roomId).sockets);
  }

  getClient(id) {
    return this.io.in().sockets[id];
  }

  removeClient(id) {
    log('client left', id);
    Object.values(this.games).forEach((game) => {
      if(game.clients.includes(id)) {
        game.removeClient(id);
        if(!game.clients.length) {
          log('remove game', game.id);
          delete this.games[game.id];
        }
      }
    });
  }
}

export default GameServer;
