class APIError extends Error {
  constructor(message, status) {
    super(message);
    this.status = status;
    this.name = 'APIError';
  }
}

class RateLimitError extends Error {
  constructor(retryAfter) {
    super(`Rate limited. Try again in ${retryAfter}ms`);
    this.retryAfter = retryAfter;
    this.name = 'RateLimitError';
  }
}

module.exports = { APIError, RateLimitError };
