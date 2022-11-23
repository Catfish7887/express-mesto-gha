const { constants } = require('http2');

const HTTPError = require('./HTTPError');

class NotFoundError extends HTTPError {
  constructor(message) {
    super(message);
    this.statusCode = constants.HTTP_STATUS_NOT_FOUND;
    this.name = 'NotFoundError';
  }
}

module.exports = NotFoundError;
