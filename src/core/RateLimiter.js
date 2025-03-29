class RateLimiter {
  constructor(config) {
    this.buckets = new Map();
    this.config = config;
    this.penaltyBox = new Map();
  }

  updateFromResponse(response) {
    const headers = response.headers;
    const bucket =
      headers["x-ratelimit-bucket"] || this._detectBucket(response);

    this.buckets.set(bucket, {
      remaining: parseInt(headers["x-ratelimit-remaining"], 10),
      limit: parseInt(headers["x-ratelimit-limit"], 10),
      reset: parseInt(headers["x-ratelimit-reset"], 10) * 1000,
      lastUpdated: Date.now(),
    });

    if (response.status === 429 && response.config.url.includes("/command")) {
      const penaltyDuration = (response.data?.retry_after || 5) * 1000;
      this.penaltyBox.set(bucket, Date.now() + penaltyDuration);
    }
  }

  async checkLimits(requestConfig) {
    const now = Date.now();
    const bucket = this._detectBucket(requestConfig);

    if (this.penaltyBox.has(bucket)) {
      const penaltyEnd = this.penaltyBox.get(bucket);
      if (now < penaltyEnd) {
        await this._wait(penaltyEnd - now + 100);
        return this.checkLimits(requestConfig);
      }
      this.penaltyBox.delete(bucket);
    }

    if (this.buckets.has(bucket)) {
      const { remaining, reset } = this.buckets.get(bucket);
      if (remaining <= 0 && now < reset) {
        await this._wait(reset - now + 50);
      }
    }

    const minDelay = this._calculateAdaptiveDelay();
    await this._wait(minDelay);
  }

  _detectBucket({ method, url }) {
    if (method === "POST" && url.includes("/command")) {
      return `command-${this.config.SERVER_KEY}`;
    }
    return url.split("/")[2] || "global";
  }

  _calculateAdaptiveDelay() {
    const avgRequestTime = this._getAverageRequestTime();
    return Math.min(Math.max(avgRequestTime * 1.2, 500), 2000);
  }

  _getAverageRequestTime() {
    return 750;
  }

  async _wait(ms) {
    if (this.config.enableLogging) {
      console.log(`⏳ Waiting ${ms}ms to respect rate limits`);
    }
    await new Promise((resolve) => setTimeout(resolve, ms));
  }
}
