class RateLimiter {
  constructor(options = {}) {
    this.buckets = new Map();
    this.globalDelay = options.globalRateDelay || 1714;
    this.lastRequest = 0;
    this.bucketResetBuffer = options.bucketResetBuffer || 1000;
  }

  checkLimit(bucket) {
    const now = Date.now();
    const bucketData = this.buckets.get(bucket) || {
      remaining: 1,
      limit: 35,
      reset: now + 60000
    };

    if (bucketData.remaining <= 0 && now < bucketData.reset + this.bucketResetBuffer) {
      return bucketData.reset - now + this.bucketResetBuffer;
    }
    return 0;
  }

  updateLimits(headers, bucket) {
    const newData = {
      remaining: parseInt(headers['x-ratelimit-remaining'], 10),
      limit: parseInt(headers['x-ratelimit-limit'], 10),
      reset: parseInt(headers['x-ratelimit-reset'], 10) * 1000
    };
    this.buckets.set(bucket, newData);
    this.lastRequest = Date.now();
  }
}

module.exports = RateLimiter;
