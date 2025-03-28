const axios = require('axios');
const { AsyncQueue } = require('@sapphire/async-queue');
const RateLimiter = require('./RateLimiter');
const ServerEndpoint = require('./endpoints/Server');
const CommandsEndpoint = require('./endpoints/Commands');

class ERLCClient {
  constructor(config) {
    this.config = {
      baseURL: 'https://api.policeroleplay.community/v1',
      enableLogging: true,
      ...config
    };
    
    this.rateLimiter = new RateLimiter();
    this.queue = new AsyncQueue();
    this.connected = false;
    
    this.server = new ServerEndpoint(this);
    this.commands = new CommandsEndpoint(this);
    
    this.initialize();
  }

  async initialize() {
    try {
      const response = await this._request('GET', '/server');
      this.connected = true;
      
      if (this.config.enableLogging) {
        console.log(`✅ Connected to ${response.data.Name}`);
        console.log(`👥 Players: ${response.data.CurrentPlayers}/${response.data.MaxPlayers}`);
      }
    } catch (error) {
      this.connected = false;
      throw new Error(`❌ Connection failed: ${error.message}`);
    }
  }

  async _request(method, endpoint, data) {
    if (!this.connected) throw new Error('Client not initialized');
    
    await this.queue.wait();
    try {
      await this.rateLimiter.checkLimits(endpoint);
      
      const response = await axios({
        method,
        url: `${this.config.baseURL}${endpoint}`,
        headers: {
          'Server-Key': this.config.API_KEY,
          'Content-Type': 'application/json'
        },
        data,
        validateStatus: () => true
      });

      this.rateLimiter.updateFromHeaders(endpoint, response.headers);
      
      if (response.status === 403) {
        this.connected = false;
        throw new Error('Invalid API key');
      }

      return response;
    } finally {
      this.queue.shift();
    }
  }
}

module.exports = ERLCClient;
