const BaseEndpoint = require('./BaseEndpoint');

class ServerEndpoint extends BaseEndpoint {
  async getInfo() {
    return this.client.execute('/server');
  }

  async getQueue() {
    return this.client.execute('/server/queue');
  }

  async getStatus() {
    const info = await this.getInfo();
    return {
      online: info.online,
      players: info.players,
      maxPlayers: info.maxPlayers,
      map: info.map
    };
  }
}

module.exports = ServerEndpoint;
