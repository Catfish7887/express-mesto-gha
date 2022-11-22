class HTTPError extends Error {
  constructor(statusCode, message) {
    super(message);
    this.message = message;
    this.statusCode = statusCode;
    this.name = 'HTTPError';
  }
}

module.exports = HTTPError;
