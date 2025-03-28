const ERLCClient = require('../src/Client');

class ServerManager {
  constructor(apiKey) {
    this.client = new ERLCClient({
      API_KEY: apiKey,
      enableLogging: false
    });
  }

  async initialize() {
    this.serverInfo = await this.client.connect();
    setInterval(() => this.monitor(), 30000);
  }

  async monitor() {
    try {
      const players = await this.client.server.getPlayers();
      if (players.length === 0) return;
      
      const police = players.filter(p => p.Team === 'Police');
      if (police.length < 2) {
        await this.client.commands.send(':h Need more officers!');
      }
      
      const hour = new Date().getHours();
      if (hour > 18 || hour < 6) {
        await this.client.commands.send(':time ' + (hour % 24));
      }
      
    } catch (error) {
      console.error('Monitor error:', error.message);
    }
  }
}

const manager = new ServerManager(process.env.ERLC_KEY);
manager.initialize();
