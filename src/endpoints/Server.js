class ServerEndpoint {
  constructor(client) {
    this.client = client;
  }

  async getInfo() {
    return (await this.client._request('GET', '/server')).data;
  }

  async getPlayers() {
    return (await this.client._request('GET', '/server/players')).data;
  }

  async getQueue() {
    return (await this.request.execute('/server/queue')).data;
  }

  async getJoinLogs() {
    return (await this.request.execute('/server/joinlogs')).data;
  }

  async getKillLogs() {
    return (await this.request.execute('/server/killlogs')).data;
  }

  async getCommandLogs() {
    return (await this.request.execute('/server/commandlogs')).data;
  }

  async getModCalls() {
    return (await this.request.execute('/server/modcalls')).data;
  }

  async getBans() {
    return (await this.request.execute('/server/bans')).data;
  }

  async getVehicles() {
    return (await this.request.execute('/server/vehicles')).data;
  }
}

module.exports = ServerEndpoint;
