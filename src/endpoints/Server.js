class Server {
  constructor(requestHandler) {
    this.request = requestHandler;
  }

  async getInfo() {
    return (await this.request.execute('/server')).data;
  }

  async getQueue() {
    return (await this.request.execute('/server/queue')).data;
  }

  async getVehicles() {
    return (await this.request.execute('/server/vehicles')).data;
  }
}

module.exports = Server;
