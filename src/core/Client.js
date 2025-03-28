const axios = require('axios');
const { AsyncQueue } = require('@sapphire/async-queue');
const RateLimiter = require('./RateLimiter');
const ServerEndpoint = require('./endpoints/Server');
const CommandsEndpoint = require('./endpoints/Commands');

class ERLCClient {
  constructor(config) {
    if (!config?.API_KEY) throw new Error('API_KEY is required');
    
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
  }

  async connect() {
    try {
      const response = await this._request('GET', '/server');
      this.connected = true;
      
      if (this.config.enableLogging) {
        console.log(`Connected to "${response.data.Name}"`);
        console.log(`${response.data.CurrentPlayers}/${response.data.MaxPlayers} players online`);
      }
      return response.data;
    } catch (error) {
      this.connected = false;
      throw new Error(`Connection failed: ${error.response?.data?.message || error.message}`);
    }
  }

  async _request(method, endpoint, data) {
    if (!this.connected && endpoint !== '/server') {
      throw new Error('Client not connected - call connect() first');
    }
    
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

      this.rateLimiter.updateFromHeaders(response.headers);
      
      if (response.status === 403) {
        this.connected = false;
        throw new Error('Invalid API key (403 Forbidden)');
      }

      return response;
    } finally {
      this.queue.shift();
    }
  }
}

module.exports = ERLCClient;
