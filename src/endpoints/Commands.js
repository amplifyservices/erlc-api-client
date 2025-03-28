const { validateCommand } = require('../utils/helpers');

class CommandsEndpoint {
  constructor(client) {
    this.client = client;
  }

  async send(rawCommand) {
    const command = validateCommand(rawCommand);
    const response = await this.client._request('POST', '/server/command', { command });
    
    if (response.status === 422) {
      throw new Error('Cannot execute command - no players in server');
    }
    
    return response.data;
  }
}

module.exports = CommandsEndpoint;
