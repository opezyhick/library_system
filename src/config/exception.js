const express = require("express");
const yup = require("yup");
const logger = require("./logging").getLogger("exception-middleware");
const {
  AuthenticationException,
  BadRequestException,
  UnAuthorizedException,
} = require("exceptions");

function exceptionMiddleware() {
  return (error, _, res, next) => {
    logger.error(`<${error.name}> ${error.message} \n${error.stack}`);
    if (res.headersSent) {
      return next(error);
    }
    if (error instanceof BadRequestException) {
      const body = {
        message: error.message,
        code: "validation",
        status: 400,
        errors: [],
      };
      res.status(body.status).json(body);
    } else if (error instanceof AuthenticationException) {
      const body = {
        message: error.message,
        code: "auth",
        status: 401,
        errors: [],
      };
      res.status(body.status).json(body);
    } else if (error instanceof UnAuthorizedException) {
      const body = {
        message: error.message,
        code: "auth",
        status: 403,
        errors: [],
      };
      res.status(body.status).json(body);
    } else if (error instanceof yup.ValidationError) {
      const body = {
        message: "Validation Error",
        code: "validation",
        status: 400,
        errors: error.inner.map((err) => ({
          path: err.path,
          message: err.message,
        })),
      };
      res.status(body.status).json(body);
      // } else if (error instanceof MongoServerError) {
      //   console.log(`Error worth logging: ${error}`); // special case for some reason
    } else {
      const body = {
        message: "Internal Server Error",
        code: "server",
        status: 500,
        errors: [],
      };
      res.status(body.status).json(body);
    }
  };
}

const SqlErrorCodeMessageResolver = {
  11000: "Already exists",
};

module.exports = exceptionMiddleware;
