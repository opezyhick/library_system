export class Exception extends Error {
  cause;
  constructor(message, cause) {
    super(message);
    this.cause = cause || this;
    this.name = this.constructor.name;
  }
  initCause(cause) {
    this.cause = cause;
  }
}

export class DatabaseException extends Exception {
  constructor(message, cause) {
    super(message, cause);
  }
}

export class AuthenticationException extends Exception {
  constructor(message, cause) {
    super(message, cause);
  }
}

export class UnAuthorizedException extends Exception {
  constructor(message = "Unauthorized", cause) {
    super(message, cause);
  }
}

export class BadRequestException extends AuthenticationException {
  constructor(message = "Bad Request", cause) {
    super(message, cause);
  }
}

export class BadCredentialsException extends AuthenticationException {
  constructor(message = "Bad Credentials", cause) {
    super(message, cause);
  }
}

export class ValidationException extends Exception {
  constructor(message, cause) {
    super(message, cause);
  }
}
