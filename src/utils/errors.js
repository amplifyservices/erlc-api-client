class APIError extends Error {
  constructor(message, code) {
    super(message);
    this.code = code;
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
