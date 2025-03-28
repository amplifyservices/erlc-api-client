class RateLimiter {
  constructor() {
    this.buckets = new Map();
  }

  updateFromHeaders(headers) {
    const bucket = headers['x-ratelimit-bucket'] || 'global';
    this.buckets.set(bucket, {
      remaining: parseInt(headers['x-ratelimit-remaining'], 10),
      limit: parseInt(headers['x-ratelimit-limit'], 10),
      reset: parseInt(headers['x-ratelimit-reset'], 10) * 1000
    });
  }

  async checkLimits(endpoint) {
    const now = Date.now();
    const bucket = this.buckets.get(endpoint.split('/')[1]) || this.buckets.get('global') || {
      remaining: 1,
      reset: now + 1000
    };

    if (bucket.remaining <= 0 && now < bucket.reset) {
      const waitTime = bucket.reset - now + 100;
      await new Promise(resolve => setTimeout(resolve, waitTime));
    }
  }
}

module.exports = RateLimiter;
