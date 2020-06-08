import GameUtil from './game-util.mjs';

class PaddleGame {
  constructor(options) {
    const defaults = {
      clients: [],
      state: {
        ball: {
          position: [0.5, 0.5],
          velocity: [-0.05, 0.1]
        }
      },
      id: GameUtil.createId('game')
    };

    Object.assign(this, defaults, options);
  }

  update(elapsed) {
    this.updateBall(this.state, elapsed)
  }

  updateBall(S, elapsed) {
    S.ball.position[0] += S.ball.velocity[0] * (elapsed / 1000);
    S.ball.position[1] += S.ball.velocity[1] * (elapsed / 1000);
    if(S.ball.position[0] < 0 || S.ball.position[0] > 1) {
      S.ball.velocity[0] *= -1;
      S.ball.position[0] = Math.max(0, Math.min(S.ball.position[0], 1));
    }
    if(S.ball.position[1] < 0 || S.ball.position[1] > 1) {
      S.ball.velocity[1] *= -1;
      S.ball.position[1] = Math.max(0, Math.min(S.ball.position[1], 1));
    }
  }

  addClient(clientId) {
    this.clients.push(clientId);
  }

  removeClient(clientId) {
    this.clients = this.clients.filter(id => id !== clientId);
  }

  syncState(newState) {
    Object.assign(this.state, newState);
  }
}

export default PaddleGame;
