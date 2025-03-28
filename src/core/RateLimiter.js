class RateLimiter {
  constructor() {
    this.buckets = new Map();
  }

  updateFromHeaders(endpoint, headers) {
    const bucket = headers['x-ratelimit-bucket'] || 'global';
    this.buckets.set(bucket, {
      remaining: parseInt(headers['x-ratelimit-remaining']),
      limit: parseInt(headers['x-ratelimit-limit']),
      reset: parseInt(headers['x-ratelimit-reset']) * 1000
    });
  }

  async checkLimits(endpoint) {
    const bucket = this.buckets.get(endpoint) || this.buckets.get('global');
    if (bucket && bucket.remaining <= 0) {
      const waitTime = bucket.reset - Date.now() + 1000;
      await new Promise(resolve => setTimeout(resolve, waitTime));
    }
  }
}

module.exports = RateLimiter;
