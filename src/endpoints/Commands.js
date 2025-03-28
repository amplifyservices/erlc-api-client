class Commands {
  constructor(requestHandler) {
    this.request = requestHandler;
  }

  async send(command) {
    if (!command.startsWith(':')) {
      throw new Error('Command must start with colon (e.g. ":h Hello")');
    }
    return (await this.request.execute('/server/command', 'POST', { command })).data;
  }
}

module.exports = Commands;
