const { AsyncQueue } = require('@sapphire/async-queue');
const axios = require('axios');

class RequestHandler {
  constructor(rateLimiter, options) {
    this.rateLimiter = rateLimiter;
    this.queue = new AsyncQueue();
    this.options = options;
  }

  async execute(endpoint, method = 'GET', data) {
    await this.queue.wait();
    try {
      const bucket = endpoint.split('/')[1] || 'global';
      const delay = this.rateLimiter.checkLimit(bucket);
      
      if (delay > 0) {
        await new Promise(resolve => setTimeout(resolve, delay));
      }

      const response = await axios({
        method,
        url: `${this.options.baseURL || 'https://api.policeroleplay.community/v1'}${endpoint}`,
        headers: {
          'Server-Key': this.options.apiKey,
          'Content-Type': 'application/json'
        },
        data,
        validateStatus: () => true
      });

      this.rateLimiter.updateLimits(response.headers, bucket);
      return response;
    } finally {
      this.queue.shift();
    }
  }
}

module.exports = RequestHandler;
