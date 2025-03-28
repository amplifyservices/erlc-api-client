const { RateLimiter } = require('./RateLimiter');
const { RequestHandler } = require('./RequestHandler');
const EventEmitter = require('events');

class ERLCClient extends EventEmitter {
  constructor(apiKey, options = {}) {
    super();
    this.apiKey = apiKey;
    this.version = '2.1.0';
    
    this.rateLimiter = new RateLimiter(options);
    this.requestHandler = new RequestHandler(this.apiKey, {
      ...options,
      rateLimiter: this.rateLimiter
    });

    this.requestHandler.on('request', (data) => this.emit('request', data));
    this.requestHandler.on('retry', (data) => this.emit('retry', data));
    this.rateLimiter.on('rateLimit', (data) => this.emit('rateLimit', data));
  }

  async execute(endpoint, method = 'GET', data) {
    return this.requestHandler.execute(endpoint, method, data);
  }

  getRateLimitStats() {
    return this.rateLimiter.getStats();
  }
}

module.exports = ERLCClient;
