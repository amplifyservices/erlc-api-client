const { AsyncQueue } = require("@sapphire/async-queue");
const axios = require("axios");
const { performance } = require("perf_hooks");

class RequestHandler {
  constructor(rateLimiter, config) {
    this.rateLimiter = rateLimiter;
    this.queue = new AsyncQueue();
    this.config = {
      baseURL: "https://api.policeroleplay.community/v1",
      timeout: 10000,
      maxRetries: 3,
      ...config,
    };
    this.stats = {
      totalRequests: 0,
      successCount: 0,
      averageLatency: 0,
    };
  }

  async execute(endpoint, method = "GET", data, attempt = 1) {
    const startTime = performance.now();
    await this.queue.wait();

    try {
      const requestKey = `${method}:${endpoint}`;
      await this.rateLimiter.validateRequest(requestKey);

      const response = await this._executeRequest(endpoint, method, data);
      this._updateStats(performance.now() - startTime, true);

      this.rateLimiter.updateFromResponse(response, requestKey);

      return response;
    } catch (error) {
      this._updateStats(performance.now() - startTime, false);

      if (this._shouldRetry(error, attempt)) {
        const backoffTime = this._calculateBackoff(attempt);
        await new Promise((resolve) => setTimeout(resolve, backoffTime));
        return this.execute(endpoint, method, data, attempt + 1);
      }

      throw this._enhanceError(error, endpoint);
    } finally {
      this.queue.shift();
      this._adjustQueueConcurrency();
    }
  }

  async _executeRequest(endpoint, method, data) {
    return axios({
      method,
      url: `${this.config.baseURL}${endpoint}`,
      headers: this._getHeaders(),
      data,
      timeout: this.config.timeout,
      validateStatus: () => true,
    });
  }

  _getHeaders() {
    const headers = {
      "Server-Key": this.config.apiKey,
      "Content-Type": "application/json",
      "X-Client-Version": "1.0.0",
    };

    if (this.config.GLOBAL_KEY) {
      headers.Authorization = this.config.GLOBAL_KEY;
    }

    return headers;
  }

  _shouldRetry(error, attempt) {
    const isRetryable =
      error.code === "ECONNABORTED" ||
      error.response?.status >= 500 ||
      error.response?.status === 429;

    return isRetryable && attempt < this.config.maxRetries;
  }

  _calculateBackoff(attempt) {
    const jitter = Math.random() * 500;
    return Math.min(1000 * Math.pow(2, attempt) + jitter, 10000);
  }

  _enhanceError(error, endpoint) {
    error.endpoint = endpoint;
    error.timestamp = new Date().toISOString();

    if (error.response) {
      error.details = {
        status: error.response.status,
        data: error.response.data,
        headers: error.response.headers,
      };
    }

    return error;
  }

  _updateStats(latency, isSuccess) {
    this.stats.totalRequests++;
    if (isSuccess) this.stats.successCount++;

    this.stats.averageLatency = 0.2 * latency + 0.8 * this.stats.averageLatency;
  }

  _adjustQueueConcurrency() {
    const successRate = this.stats.successCount / this.stats.totalRequests;

    if (successRate < 0.9 && this.queue.remaining > 5) {
      this.queue.pauseTemporarily(1000);
    }
  }
}

module.exports = RequestHandler;
