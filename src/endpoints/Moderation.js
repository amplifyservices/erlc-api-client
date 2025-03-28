const BaseEndpoint = require('./BaseEndpoint');

class ModerationEndpoint extends BaseEndpoint {
  async getModCalls() {
    return this.client.execute('/server/modcalls');
  }

  async getCommandLogs() {
    return this.client.execute('/server/commandlogs');
  }

  async getVehicleLogs() {
    return this.client.execute('/server/vehicles');
  }
}

module.exports = ModerationEndpoint;
