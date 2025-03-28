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

  async getBans() {
    return (await this.client._request('GET', '/server/bans')).data;
  }

  async getVehicles() {
    return (await this.client._request('GET', '/server/vehicles')).data;
  }

  async getJoinLogs() {
    return (await this.client._request('GET', '/server/joinlogs')).data;
  }

  async getKillLogs() {
    return (await this.client._request('GET', '/server/killlogs')).data;
  }

  async getCommandLogs() {
    return (await this.client._request('GET', '/server/commandlogs')).data;
  }

  async getModCalls() {
    return (await this.client._request('GET', '/server/modcalls')).data;
  }

  async getQueue() {
    return (await this.client._request('GET', '/server/queue')).data;
  }
}

module.exports = ServerEndpoint;
