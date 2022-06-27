"use strict";

/**
 * @api {post} /auth/forgot-password Forgot Password
 * @apiName ForgotPassword
 * @apiGroup Auth
 * @apiVersion 0.0.1
 * @apiUse CommonHeaders
 * @apiPermission None
 * @apiSampleRequest off
 *
 * @apiDescription This function will return a json response,
 * using the POST method, with the JSON Web Token
 *
 * @apiBody {String} Email               Mandatory Unique Email Address.
 *
 * @apiParamExample {json} JSON Body:
 *     {
 *       "Email": "test@email.com",
 *     }
 *
 * @apiUse 422Example
 * @apiUse 500Example
 *
 * @apiSuccessExample {json} Success-Response:
 *     The 'ResetToken' property needs to be passed back in the
 *     Reset Password Endpoint.
 *
 *     Note: An "HTTP/1.1 200 OK" response will be returned regardless
 *     if there is an email found or not, this will help prevent bots
 *     from searching for active accounts.
 *
 *     HTTP/1.1 200 OK
 *     {
 *       "success": true,
 *       "code": "user-updated",
 *       "message": "Lorem ipsum dolor sit amet",
 *       "detail": "Lorem ipsum dolor sit amet, consectetur adipiscing elit",
 *       "path": "/api/auth/forgot-password",
 *       "timestamp": "YYYY-MM-DDTHH:MM:SS.000Z",
 *       "payload": {
 *         "ResetToken": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
 *       }
 *     }
 */

/**
 * Import Module Packages
 *  - the Request and Response objects from Express
 */
import { Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";

/**
 * Import API Libraries
 *  - API Response Library
 *  - Ajv Library (Class & Type)
 *  - Query Library
 */
import APIResponse from "../../../../libraries/APIResponse";
import { ajv } from "../../../../libraries/Ajv";
import Query from "../../../../libraries/Query";

/**
 * Import the Schema from the Model
 */
import { Email } from "../../../../models/Users";

/**
 * Import the following Util Helper Scripts:
 *  - Data Helper
 *  - Validation Helper
 */
import { buildErrors } from "../../../../utils/helpers";

/**
 * Start Query Object
 */
const Users = new Query({ tableName: "Users" });

/**
 * Create an Endpoint function that will validate
 * user data, and update a user record's reset
 * token fields.
 *
 * @param req  Object The Express Request Object
 * @param res  Object The Express Response Object
 *
 * @author Byron Niblett <bniblett@gmail.com>
 * @return void
 */
export const route = (req: Request, res: Response): void => {
  /**
   * Collect the Props that were passed
   */
  const Props: SchemaUserForgot = {
    Email: req.body.Email,
  };
  const response = new APIResponse(req, res);

  /**
   * Build Schema for validation
   */
  const SchemaBuild = {
    type: "object",
    properties: {
      Email,
    },
    required: ["Email"],
    additionalProperties: false,
  };

  /**
   * Compile the Schema, then Validate the Input
   */
  const validate = ajv.compile(SchemaBuild);
  const valid = validate(Props);

  /**
   * If there is an error, find the type and display an
   * error response with appropriate error code
   */
  if (!valid) {
    const ErrorMessage = buildErrors(validate);
    response.validation({
      code: "validate-" + ErrorMessage[0].errorCode,
      primaryField: ErrorMessage[0].primaryField,
      secondaryField: ErrorMessage[0].secondaryField,
      params: ErrorMessage[0].params,
    });
    return;
  }

  /* Search for user's Email Address */
  /* if there isn't an active account, still return a token */
  Users.findOne({ Email: Props.Email })
    .then((user) => {
      const ResetToken = uuidv4();
      if (typeof user === "object" && user.Status == "Active") {
        Users.setToken({ ResetToken, Email: Props.Email })
          .then((data) => {
            response.ok({
              payload: { ResetToken: ResetToken },
              code: "user-updated",
            });
          })
          .catch((err) => {
            response.server_error({
              code: "system-update",
              payload: { ResetToken: ResetToken, Email: Props.Email },
              err: err,
            });
          });
      } else {
        response.ok({
          payload: { ResetToken: ResetToken },
          code: "user-updated",
        });
      }
    })
    .catch((err) => {
      response.server_error({
        code: "system-find",
        payload: { Email: Props.Email },
        err: err,
      });
    });
};
