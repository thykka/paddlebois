
import Paddle from './paddle.mjs';
import Ball from './ball.mjs';

class Game {
  constructor() {
    this.state = {};
    this.input = {};
    this.updatePaddle = Paddle.update;
    this.updateBall = Ball.update;
  }

  init(S = this.state) {
    S.time = 0;
    S.players = [];
    S.paddles = [];
    S.balls = [];
  }

  update(S = this.state, input = this.input) {
    S.paddles.forEach(paddle => this.updatePaddle(S, paddle, input));
    S.balls.forEach(ball => this.updateBall(S, ball));
  }

  addPlayer(connectionId) {
    if(this.players.length >= 2) throw Error('Cannot add more players to this game');
    this.players.push(connectionId);
  }
}

export default Game;
