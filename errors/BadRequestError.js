const { constants } = require('http2');

const HTTPError = require('./HTTPError');

class BadRequestError extends HTTPError {
  constructor(message) {
    super(message);
    this.statusCode = constants.HTTP_STATUS_BAD_REQUEST;
    this.name = 'BadRequestError';
  }
}

module.exports = BadRequestError;
