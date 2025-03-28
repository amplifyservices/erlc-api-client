const axios = require('axios');
const { AsyncQueue } = require('@sapphire/async-queue');
const { APIError, RateLimitError } = require('../utils/errors');

class RequestHandler {
  constructor(apiKey, options) {
    this.apiKey = apiKey;
    this.baseURL = options.baseURL || 'https://api.policeroleplay.community/v1';
    this.rateLimiter = options.rateLimiter;
    this.queue = new AsyncQueue();
    this.maxRetries = options.maxRetries || 3;
  }

  async execute(endpoint, method = 'GET', data, retryCount = 0) {
    await this.queue.wait();
    
    try {
      const bucketWait = this.rateLimiter.checkLimit(endpoint);
      if (bucketWait > 0) {
        await new Promise(resolve => setTimeout(resolve, bucketWait));
      }

      const config = {
        method,
        url: `${this.baseURL}${endpoint}`,
        headers: {
          'Server-Key': this.apiKey,
          'Content-Type': 'application/json'
        },
        validateStatus: () => true
      };

      if (data) config.data = data;

      this.emit('request', { endpoint, method });
      const response = await axios(config);

      const bucket = response.headers['x-ratelimit-bucket'] || 'global';
      this.rateLimiter.update(bucket, response.headers);

      if (response.status === 429) {
        throw new RateLimitError(response);
      }

      if (response.status >= 400) {
        throw new APIError(response);
      }

      return response.data;
    } catch (error) {
      if (error instanceof RateLimitError && retryCount < this.maxRetries) {
        this.emit('retry', { endpoint, retryCount });
        await new Promise(resolve => setTimeout(resolve, error.retryAfter));
        return this.execute(endpoint, method, data, retryCount + 1);
      }
      throw error;
    } finally {
      this.queue.shift();
    }
  }
}

module.exports = RequestHandler;
