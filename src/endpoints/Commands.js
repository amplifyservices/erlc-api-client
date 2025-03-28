const BaseEndpoint = require('./BaseEndpoint');
const { ValidationError } = require('../utils/errors');

class CommandsEndpoint extends BaseEndpoint {
  async execute(command) {
    if (!command.startsWith(':')) {
      throw new ValidationError('Commands must start with a colon (:)');
    }
    return this.client.execute('/server/command', 'POST', { command });
  }

  async broadcast(message) {
    return this.execute(`:h ${message}`);
  }

  async announce(message) {
    return this.execute(`:announce ${message}`);
  }
}

module.exports = CommandsEndpoint;
