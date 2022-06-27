"use strict";

/**
 * @api {put} /account/ Update User Data
 * @apiName UpdateUserData
 * @apiGroup Accounts
 * @apiVersion 0.0.1
 * @apiUse CommonHeaders
 * @apiUse AuthHeader
 * @apiPermission User
 * @apiSampleRequest off
 *
 * @apiDescription This function will accept a JSON body, and will update a user's data
 * in the database. The UserID is provided in the JSON Web Token (JWT), so it is not
 * needed as an endpoint param.
 *
 * @apiParamExample {json} Request Body:
 *     {
 *       "Password": "Testing123!",
 *       "Profile": {
 *         "FirstName": "John",
 *         "LastName": "Smith",
 *         "Salutation": "Dr.",
 *       }
 *     }
 *
 * @apiBody {String} [Password]            Optional Password.
 * @apiBody {Object} [Profile]             Optional Profile object.
 * @apiBody {String} [Profile[FirstName]]  Optional User First Name.
 * @apiBody {String} [Profile[LastName]]   Optional User Last Name.
 * @apiBody {String} [Profile[Salutation]] Optional User Salutation.
 *
 * @apiUse 500Example
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "success": true,
 *       "code": "user-updated",
 *       "message": "User Updated",
 *       "detail": "User details updated successfully",
 *       "path": "/api/account",
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
 *  - Tokens Library
 *  - Query Library
 */
import APIResponse from "../../libraries/APIResponse";
import { ajv } from "../../libraries/Ajv";
import Encrypt from "../../libraries/Encrypt";
import Tokens from "../../libraries/Tokens";
import Query from "../../libraries/Query";

/**
 * Import the Schema from the Model
 */
import { Password, Profile } from "../../models/Users";

/**
 * Import the following Util Helper Scripts:
 *  - Data Helper
 *  - Validation Helper
 */
import { buildErrors } from "../../utils/helpers";

/**
 * Start Query Object
 */
const Users = new Query({ tableName: "Users" });

/**
 * Create an Endpoint function that will update an
 * existing user in the system.
 *
 * This endpoint will hash / sanitize the props
 * before making the database update action
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
  const Props: SchemaUserUpdate = {
    Password: req.body.Password,
    Profile: req.body.Profile,
  };
  const response = new APIResponse(req, res);

  /**
   * Build Schema for validation
   */
  const SchemaBuild = {
    type: "object",
    properties: {
      Password,
      Profile,
    },
    required: [],
    additionalProperties: false,
  };

  /**
   * Compile the Schema, then Validate the Input
   */
  const validate = ajv.compile(SchemaBuild);
  const valid = validate(Props);

  /* Encrypt Password using Encrypt Library */
  const hashPassword = (password: string) => {
    const encrypt = new Encrypt();
    return encrypt.password(password);
  };

  /* Prepare the payload for DB Query */
  const prepare = (user: any) => {
    user = JSON.parse(JSON.stringify(user)); // remove empty keys
    if (user.Profile) user.Profile = JSON.stringify(user.Profile);
    if (!user.Password) return Promise.resolve(user);

    // `password` will always be hashed before being saved.
    return hashPassword(user.Password)
      .then((hash) => ({
        ...user,
        Password: hash,
      }))
      .catch((err: any) => `Error hashing password: ${err}`);
  };

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

  /**
   * Prepare / Sanitize the Props object which will be
   * updating the user data provided in the call.
   */
  prepare(Props)
    .then((props) => {
      Users.update(props, { ID: req.UserID })
        .then((data) => {
          response.ok({
            code: "user-updated",
          });
        })
        .catch((err) => {
          response.server_error({
            code: "system-update",
            payload: { ID: req.UserID },
            err: err,
          });
        });
    })
    .catch((err) => {
      response.server_error({
        code: "system-preparing",
        payload: { ID: req.UserID },
        err: err,
      });
    });
};
