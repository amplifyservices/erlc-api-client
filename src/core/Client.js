const axios = require('axios');
const { AsyncQueue } = require('@sapphire/async-queue');

class ERLCClient {
  constructor(config) {
    if (!config?.SERVER_KEY) throw new Error('SERVER_KEY is required');
    
    this.config = {
      baseURL: 'https://api.policeroleplay.community/v1',
      enableLogging: true,
      GLOBAL_KEY: null,
      ...config
    };
    
    this.queue = new AsyncQueue();
    this.connected = false;
  }

  async connect() {
    try {
      const headers = {
        'Server-Key': this.config.SERVER_KEY
      };
      
      if (this.config.GLOBAL_KEY) {
        headers['Authorization'] = this.config.GLOBAL_KEY;
      }

      const response = await axios.get(`${this.config.baseURL}/server`, {
        headers,
        validateStatus: () => true
      });

      if (response.status === 403) {
        throw new Error('Invalid SERVER_KEY or GLOBAL_KEY');
      }

      this.connected = true;
      return response.data;
    } catch (error) {
      this.connected = false;
      throw error;
    }
  }

  async _request(method, endpoint, data) {
    await this.queue.wait();
    try {
      const headers = {
        'Server-Key': this.config.SERVER_KEY,
        'Content-Type': 'application/json'
      };

      if (this.config.GLOBAL_KEY) {
        headers['Authorization'] = this.config.GLOBAL_KEY;
      }

      const response = await axios({
        method,
        url: `${this.config.baseURL}${endpoint}`,
        headers,
        data,
        validateStatus: () => true
      });

      if (response.headers['x-ratelimit-remaining'] === '0') {
        const resetTime = parseInt(response.headers['x-ratelimit-reset']) * 1000;
        const waitTime = resetTime - Date.now() + 1000;
        await new Promise(resolve => setTimeout(resolve, waitTime));
      }

      return response;
    } finally {
      this.queue.shift();
    }
  }
}

module.exports = ERLCClient;
