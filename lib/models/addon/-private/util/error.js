import EmberError from '@ember/error';
import { merge } from '@ember/polyfills';
import { A } from '@ember/array';

function message(opts) {
  opts = opts || {};
  if(opts.error && opts.reason) {
    return `${opts.error}: ${opts.reason}`;
  } else if(opts.error) {
    return `${opts.error}`;
  } else if(opts.reason) {
    return `error: ${opts.reason}`;
  } else {
    return `unknown error`;
  }
}

export function FireError(opts) {
  EmberError.call(this, message(opts));
  merge(this, opts);
}

export default FireError;

FireError.prototype = Object.create(EmberError.prototype);

FireError.prototype.toJSON = function() {
  let { status, error, reason, id } = this;

  let hash = {
    error,
    reason
  };

  if(status) {
    hash.status = status;
  }

  if(id) {
    hash.id = id;
  }

  return hash;
};

export function FireErrors(array) {
  EmberError.call(this, 'Multiple errors');
  this.errors = array;
}

FireErrors.prototype = Object.create(EmberError.prototype);

FireErrors.prototype.toJSON = function() {
  let { message, errors } = this;

  errors = A(errors).map(error => error.toJSON ? error.toJSON() : error);

  return {
    message,
    errors
  };
};
