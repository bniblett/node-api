"use strict";

/**
 * Import the Request and Response objects from Express
 */
import { Request, Response } from "express";

/** Define Types */
interface ResponseBody {
  success: boolean;
  code: string;
  message: string;
  path: string;
  timestamp: string;
  [key: string]: any;
}

/**
 * Build the api response that will be sent back to the user
 *
 * @param req   Object The Express Request Object
 * @param res   Object The Express Response Object
 *
 * @author Byron Niblett <bniblett@gmail.com>
 * @return Object
 */
class APIResponse {

  /* HTTP Response Codes */
  OK: number = 200;
  BAD_REQUEST: number = 400;
  UNAUTHORIZED: number = 401;
  FORBIDDEN: number = 403;
  NOT_FOUND: number = 404;
  UNSUPPORTED_ACTION: number = 405;
  CONFLICT: number = 409;
  VALIDATION_FAILED: number = 422;
  SERVER_ERROR: number = 500;

  /* Class Props */
  res: Response;
  req: Request;

  constructor(req: Request, res: Response) {
    this.req = req;
    this.res = res;
  }

  build(status: number, body: any) {
    /* variables */
    const date = new Date();

    /**
     * To Do:
     *
     * 1. Pull `message` from codes.json based on code
     * 2. pull `detail` from codes.json based on code
     * 3. modify `help` - add the code instead of the URL. Replace '-' with '/'
     * 4. ensure toISOString() is actual GMT time
     */
    let _body: ResponseBody = {
      success: body.success,
      code: body.code,
      message: "Incorrect username and password",
      detail: "Ensure that the username and password are correct",
      help: "https://example.com/help/error" + this.res.req.originalUrl,
      path: this.res.req.originalUrl,
      timestamp: date.toISOString(),
    };

    /**
     * IF data.success is true:
     *
     * delete keys from body object
     */
    if (_body.success === true) {
      if ("help" in _body) delete _body.help;
      if ("detail" in _body) delete _body.detail;
    }

    /* keys to add */
    if ("payload" in body) _body = Object.assign(_body, { payload: body.payload });
    if ("token" in body) _body = Object.assign(_body, { token: body.token });
    if ("errors" in body) _body = Object.assign(_body, { errors: body.errors });

    /** Return response */
    this.res.status(status).json(_body);
  }

  ok(data) {
    let payload: any;
    let token: string;
    let body;

    body = {
      success: true,
      code: data.code,
    };

    if ("payload" in data) body = Object.assign(body, { payload: data.payload });
    if ("token" in data) body = Object.assign(body, { token: data.token });

    return this.build(this.OK, body);
  }

  /* Unauthorized Response */
  unauthorized(data) {
    return this.build(this.UNAUTHORIZED, {
      success: false,
      code: data.code,
    });
  }

  /* Validation Failed */
  validation(data) {
    return this.build(this.VALIDATION_FAILED, {
      success: false,
      code: data.code,
      errors: {
        field: data.field,
        type: data.type,
        expected: data.expected,
      },
    });
  }

  /* conflict with the code */
  conflict(data) {
    return this.build(this.CONFLICT, {
      success: false,
      code: data.code,
    });
  }

  /* Not Found Error */
  not_found(data) {
    return this.build(this.NOT_FOUND, {
      success: false,
      code: data.code,
    });
  }

  /* Server Error */
  server_error(data) {
    console.log(data);
    return this.build(this.SERVER_ERROR, {
      success: false,
      code: data.code,
    });
  }
}

export default APIResponse;
