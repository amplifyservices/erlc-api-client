const EventEmitter = require('events');

class RateLimiter extends EventEmitter {
  constructor(options = {}) {
    super();
    this.buckets = new Map();
    this.globalDelay = options.globalRateDelay || 1714;
    this.resetBuffer = options.bucketResetBuffer || 1000;
  }

  checkLimit(bucket) {
    const now = Date.now();
    if (!this.buckets.has(bucket)) {
      this.buckets.set(bucket, {
        remaining: 1,
        limit: 35,
        reset: now + 60000
      });
      return 0;
    }

    const bucketData = this.buckets.get(bucket);
    if (bucketData.remaining <= 0 && now < bucketData.reset) {
      const waitTime = bucketData.reset - now + this.resetBuffer;
      this.emit('rateLimit', { bucket, waitTime });
      return waitTime;
    }

    return 0;
  }

  update(bucket, headers) {
    const newData = {
      remaining: parseInt(headers['x-ratelimit-remaining'],
      limit: parseInt(headers['x-ratelimit-limit']),
      reset: parseInt(headers['x-ratelimit-reset']) * 1000
    };
    this.buckets.set(bucket, newData);
  }

  getStats() {
    return Object.fromEntries(this.buckets);
  }
}

module.exports = RateLimiter;
