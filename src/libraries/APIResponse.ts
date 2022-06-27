"use strict";

import fs from "fs";

/**
 * Import the Request and Response objects from Express
 */
import { Request, Response } from "express";

/**
 * Build the api response that will be sent back to the user
 *
 * @param req   Object The Express Request Object
 * @param res   Object The Express Response Object
 *
 * @author Byron Niblett <bniblett@gmail.com>
 * @return Object
 */
class APIResponse implements APIResponseInterface {
  /* HTTP Response Codes */
  OK = 200;
  BAD_REQUEST = 400;
  UNAUTHORIZED = 401;
  FORBIDDEN = 403;
  NOT_FOUND = 404;
  UNSUPPORTED_ACTION = 405;
  CONFLICT = 409;
  VALIDATION_FAILED = 422;
  SERVER_ERROR = 500;
  date;

  /* Class Props */
  res: Response;
  req: Request;

  constructor(req: Request, res: Response) {
    this.req = req;
    this.res = res;
    this.date = new Date();
  }

  build(status, body) {

    /**
     * To Do:
     *
     * 1. Pull `message` from codes.json based on code
     * 2. pull `detail` from codes.json based on code
     * 3. modify `help` - add the code instead of the URL. Replace '-' with '/'
     * 4. ensure toISOString() is actual GMT time
     */
    const _body: APIResponseBody = {
      success: body.success,
      code: body.code,
      message: "Incorrect username and password",
      detail: "Ensure that the username and password are correct",
      help: "https://example.com/help/error" + this.res.req.originalUrl,
      path: this.res.req.originalUrl,
      timestamp: this.date.toISOString(),
    };

    const getMessage = this.buildMessage(
      body.language,
      body.code,
      body?.errors
    );
    let output = { ..._body, ...getMessage };

    /**
     * IF data.success is true:
     *
     * delete keys from body object
     */
    if (body.success === true) {
      if ("help" in output) delete output.help;
      //if ("detail" in output) delete output.detail;
    }

    /* keys to add */
    if ("payload" in body)
      output = Object.assign(output, { payload: body.payload });
    if ("token" in body) output = Object.assign(output, { token: body.token });
    if ("errors" in body)
      output = Object.assign(output, { errors: body.errors });

    /** Return response */
    this.res.status(status).json(output);
  }

  buildMessage(file, code, errors) {
    const readFile = fs.readFileSync(
      // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
      `./src/language/${this.req.locale}/${file}`,
      "utf8"
    );
    const parsed = JSON.parse(readFile);
    const split = code.split("-");
    let output;
    if (split.length > 2) {
      output = parsed[split[0]][split[1]][split[2]];
    } else {
      output = parsed[split[0]][split[1]];
    }

    if (typeof errors === "object") {
      output.detail = output.detail.replace("_PRIMARY_", errors.primaryField);
      output.detail = output.detail.replace("_SECONDARY_", errors.secondaryField);
      output.detail = output.detail.replace("_LIMIT_", errors.params.limit);
      output.detail = output.detail.replace("_FORMAT_", errors.params.format);
    }
    return output;
  }

  ok(data) {
    let body: APIBuildBody;

    body = {
      language: "translations.json",
      success: true,
      code: data.code,
    };

    if ("payload" in data)
      body = Object.assign(body, { payload: data.payload });
    if ("token" in data) body = Object.assign(body, { token: data.token });

    return this.build(this.OK, body);
  }

  /* Unauthorized Response */
  unauthorized(data) {
    return this.build(this.UNAUTHORIZED, {
      language: "translations.json",
      success: false,
      code: data.code,
    });
  }

  /* Validation Failed */
  validation(data) {
    return this.build(this.VALIDATION_FAILED, {
      language: "errors.json",
      success: false,
      code: data.code,
      errors: {
        primaryField: data.primaryField,
        secondaryField: data.secondaryField,
        params: data.params,
      },
    });
  }

  /* conflict with the code */
  conflict(data) {
    return this.build(this.CONFLICT, {
      language: "translations.json",
      success: false,
      code: data.code,
    });
  }

  /* Not Found Error */
  not_found(data) {
    return this.build(this.NOT_FOUND, {
      language: "translations.json",
      success: false,
      code: data.code,
    });
  }

  /* Server Error */
  server_error(data) {
    return this.build(this.SERVER_ERROR, {
      language: "errors.json",
      success: false,
      code: data.code,
    });
  }
}

export default APIResponse;
