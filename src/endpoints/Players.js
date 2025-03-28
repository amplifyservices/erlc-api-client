const BaseEndpoint = require('./BaseEndpoint');

class PlayersEndpoint extends BaseEndpoint {
  async getList() {
    return this.client.execute('/server/players');
  }

  async getJoinLogs() {
    return this.client.execute('/server/joinlogs');
  }

  async getKillLogs() {
    return this.client.execute('/server/killlogs');
  }

  async getBans() {
    return this.client.execute('/server/bans');
  }

  async searchPlayer(name) {
    const players = await this.getList();
    return players.find(p => p.name.toLowerCase().includes(name.toLowerCase()));
  }
}

module.exports = PlayersEndpoint;
