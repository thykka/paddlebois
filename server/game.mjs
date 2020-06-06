import Player from './player.mjs';
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
    S.paddles.forEach(paddle => this.updatePaddle(S, paddle));
    S.balls.forEach(ball => this.updateBall(S, ball));
  }

  addPlayer(playerData) {
    const player = Player.new();
    this.players.push(player);
  }
}

export default Game;
