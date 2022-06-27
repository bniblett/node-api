"use strict";

/**
 * @api {post} /auth/login User Login
 * @apiName Login
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
 * @apiBody {String} Password            Mandatory Password.
 *
 * @apiParamExample {json} JSON Body:
 *     {
 *       "Email": "test@email.com",
 *       "Password": "Testing123!"
 *     }
 *
 * @apiUse 404Example
 * @apiUse 422Example
 * @apiUse 500Example
 *
 * @apiSuccessExample {json} Success-Response:
 *     The 'Token' field is the JSON Web Token, and it should be
 *     passed to the api endpoints that require authentication.
 *     See the "Introduction" tab to learn more.
 *
 *     HTTP/1.1 200 OK
 *     {
 *       "success": true,
 *       "code": "auth-login",
 *       "message": "Lorem ipsum dolor sit amet",
 *       "detail": "Lorem ipsum dolor sit amet, consectetur adipiscing elit",
 *       "path": "/auth/login",
 *       "timestamp": "YYYY-MM-DDTHH:MM:SS.000Z",
 *       "payload": {
 *           "ID": 1,
 *           "Email": "test@email.com",
 *           "Profile": {
 *               "LastName": "LastName",
 *               "FirstName": "FirstName",
 *               "Salutation": "Mr."
 *           },
 *           "CreateDate": "YYYY-MM-DDTHH:MM:SS.000Z",
 *           "Status": "Active"
 *       },
 *       "token": "xxxxxxx.xxxxxxx.xxxxxxx"
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
 *  - Query
 */
import APIResponse from "../../../libraries/APIResponse";
import { ajv } from "../../../libraries/Ajv";
import Encrypt from "../../../libraries/Encrypt";
import Tokens from "../../../libraries/Tokens";
import Query from "../../../libraries/Query";

/**
 * Import the Schema from the Model
 */
import { Email, Password } from "../../../models/Users";

/**
 * Import the following Util Helper Scripts:
 *  - Data Helper
 *  - Validation Helper
 */
import { buildErrors } from "../../../utils/helpers";

/**
 * Start Query Object
 */
const Users = new Query({ tableName: "Users" });

/**
 * Create an Endpoint function that will validate
 * user data, and determine if there is an active
 * user in the system.
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
  const Props: SchemaUserLogin = {
    Email: req.body.Email,
    Password: req.body.Password,
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
    },
    required: ["Email", "Password"],
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
  Users.findOne({ Email: Props.Email })
    .then((user) => {
      /**
       * Reusable const 'not_found' to be used when there is
       * no user or the wrong password
       */
      const not_found = { code: "user-none" };

      /* If there isn't a user, display not found message */
      if (typeof user == "undefined") {
        response.not_found(not_found);

      /* If there is a user, perform more checks */
      } else {
        /* Compare user object password to props password */
        const encrypt = new Encrypt();
        encrypt.compare(Props.Password, user.Password).then((compare) => {
          /* If the passwords DO NOT match, or user isn't active */
          if (compare === false || user.Status !== "Active") {
            response.not_found(not_found);
          } else {
            /* Delete Password from user object */
            if ("Password" in user) delete user.Password;

            const Token = new Tokens();
            response.ok({
              payload: {
                ...user,
                Profile: JSON.parse(user.Profile),
              },
              code: "auth-login",
              token: Token.sign({ ID: user.ID }),
            });
          }
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
