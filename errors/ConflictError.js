const { constants } = require('http2');

const HTTPError = require('./HTTPError');

class ConflictError extends HTTPError {
  constructor(message) {
    super(message);
    this.statusCode = constants.HTTP_STATUS_CONFLICT;
    this.name = 'ConflictError';
    this.message = message;
  }
}

module.exports = ConflictError;
