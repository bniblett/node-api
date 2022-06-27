"use strict";

/**
 * @api {put} /auth/reset-password/:Email/:ResetToken Reset Password
 * @apiName ResetPassword
 * @apiGroup Auth
 * @apiVersion 0.0.1
 * @apiUse CommonHeaders
 * @apiPermission None
 * @apiSampleRequest off
 *
 * @apiDescription This function will return a json response,
 * using the POST method, with the JSON Web Token
 *
 * @apiBody {String} Password            Mandatory Password.
 * @apiParam {String} Email              Mandatory Email Address.
 * @apiParam {String} ResetToken         Mandatory UUID ResetToken.
 *
 * @apiParamExample {json} JSON Body:
 *     {
 *       "Password": "Testing123!"
 *     }
 *
 * @apiUse 422Example
 * @apiUse 500Example
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "success": true,
 *       "code": "token-valid",
 *       "message": "Lorem ipsum dolor sit amet",
 *       "detail": "Lorem ipsum dolor sit amet, consectetur adipiscing elit",
 *       "path": "/auth/login",
 *       "timestamp": "YYYY-MM-DDTHH:MM:SS.000Z",
 *     }
 */

/**
 * Import Module Packages
 *  - the Request and Response objects from Express
 */
import { Request, Response } from "express";

/**
 * Import API Libraries
 *  - API Response Library
 *  - Ajv Library (Class & Type)
 *  - Encrypt Library
 *  - Query Library
 */
import APIResponse from "../../../../libraries/APIResponse";
import { ajv } from "../../../../libraries/Ajv";
import Encrypt from "../../../../libraries/Encrypt";
import Query from "../../../../libraries/Query";

/**
 * Import the Schema from the Model
 */
import { Email, Password, ResetToken } from "../../../../models/Users";

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
 * user data, update the user's password if the
 * validation passes
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
  const Data: SchemaUserReset = {
    Password: req.body.Password,
    Email: req.params.Email,
    ResetToken: req.params.ResetToken,
  };
  const response = new APIResponse(req, res);

  /**
   * Build Schema for validation
   */
  const SchemaBuild = {
    type: "object",
    properties: {
      Email,
      Password,
      ResetToken,
    },
    required: ["Email", "Password", "ResetToken"],
    additionalProperties: false,
  };

  /**
   * Compile the Schema, then Validate the Input
   */
  const validate = ajv.compile(SchemaBuild);
  const valid = validate(Data);

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

  Users.checkToken(Data)
    .then((data) => {
      let validToken = false;

      /* Convert Token and check if they match */
      if (typeof data[0] !== "undefined") {
        const Token = Users.convertToken(data[0].ResetToken);
        if (Token === Data.ResetToken) validToken = true;
      }

      /* if the tokens match */
      if (validToken === true) {
        hashPassword(Data.Password)
          .then((hashed) => {
            const UpdateData = {
              Password: hashed,
              ResetToken: null,
              TokenExpiry: null,
            };

            const customArgs: QueryCustomWhere = [];
            customArgs.push({
              column: "TokenExpiry",
              operator: ">",
              value: "CURRENT_TIMESTAMP",
            });

            Users.update(
              UpdateData,
              { Email: Data.Email, Status: "Active" },
              customArgs
            )
              .then((data) => {
                response.ok({
                  code: "token-valid",
                });
              })
              .catch((err) => {
                response.server_error({
                  code: "system-update",
                  payload: UpdateData,
                  err: err,
                });
              });
          })
          .catch((err) => {
            response.server_error({
              code: "system-preparing",
              payload: Data.Password,
              err: err,
            });
          });
      } else {
        response.conflict({
          code: "token-invalid",
        });
      }
    })
    .catch((err) => {
      response.server_error({
        code: "system-find",
        payload: Data,
        err: err,
      });
    });

  /* Encrypt Password using Encrypt Library */
  const hashPassword = (Password: string) => {
    const encrypt = new Encrypt();
    return encrypt.password(Password);
  };
};
