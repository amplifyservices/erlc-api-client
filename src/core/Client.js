const { RateLimiter } = require('./RateLimiter');
const { RequestHandler } = require('./RequestHandler');
const Server = require('../endpoints/Server');
const Players = require('../endpoints/Players');
const Commands = require('../endpoints/Commands');

class ERLCClient {
  constructor(apiKey, options = {}) {
    this.apiKey = apiKey;
    this.options = options;
    
    this.rateLimiter = new RateLimiter(options);
    this.requestHandler = new RequestHandler(this.rateLimiter, options);
    
    this.server = new Server(this.requestHandler);
    this.players = new Players(this.requestHandler);
    this.commands = new Commands(this.requestHandler);
  }
}

module.exports = ERLCClient;
