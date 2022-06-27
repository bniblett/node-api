"use strict";

/**
 * @api {post} /account/ Create New User
 * @apiName CreateUser
 * @apiGroup Accounts
 * @apiVersion 0.0.1
 * @apiUse CommonHeaders
 * @apiPermission None
 * @apiSampleRequest off
 *
 * @apiDescription This function will create a new user and
 * return json response, using the POST method, with the UserID
 *
 * @apiParamExample {json} Request Body:
 *     {
 *       "Email": "test@email.com",
 *       "Password": "Testing123!",
 *       "Profile": {
 *         "FirstName": "John",
 *         "LastName": "Smith",
 *         "Salutation": "Dr.",
 *       }
 *     }
 *
 * @apiBody {String} Email               Mandatory Unique Email Address.
 * @apiBody {String} Password            Mandatory Password.
 * @apiBody {Object} Profile             Mandatory Profile object.
 * @apiBody {String} Profile[FirstName]  Mandatory User First Name.
 * @apiBody {String} Profile[LastName]   Mandatory User Last Name.
 * @apiBody {String} Profile[Salutation] Mandatory User Salutation.
 *
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
 *       "code": "user-exists",
 *       "message": "Lorem ipsum dolor sit amet",
 *       "detail": "Lorem ipsum dolor sit amet, consectetur adipiscing elit",
 *       "path": "/account",
 *       "timestamp": "YYYY-MM-DDTHH:MM:SS.000Z",
 *       "payload":{Number},
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
import { Email, Password, Profile } from "../../models/Users";

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
 * Create an Endpoint function that will validate
 * user data, and create a new user in the system.
 *
 * This checks for the user in advance and if ok
 * it will return a successful response with the
 * signed token
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
  const Props: SchemaUserCreate = {
    Email: req.body.Email,
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
      Email,
      Password,
      Profile,
    },
    required: ["Email", "Password", "Profile"],
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

  /**
   * Run a check within the database for a user, then wait
   * for a response. If there is an error, display an error.
   *
   * After checking for a user, prepare the data for insert.
   * If there is an error, display an error.
   *
   * Create the user and display an api response, otherwise
   * If there is an error, display an error.
   */
  Users.findOne({ Email: Props.Email })
    .then((user) => {
      if (typeof user == "undefined") {
        /* prepare props to be inserted */
        prepare(Props).then((props) => {
            /* take prepared props, and create row */
            Users.create(props)
              .then((payload) => {
                const Token = new Tokens();
                response.ok({
                  payload: payload,
                  code: "user-create",
                  token: Token.sign(payload),
                });
              })
              .catch((err) => {
                response.server_error({
                  code: "system-insert",
                  payload: props,
                  err: err,
                });
              });
          })
          .catch((err) =>
            response.server_error({
              code: "system-preparing",
              payload: Props,
              err: err,
            })
          );
      } else {
        response.conflict({
          code: "user-exists",
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

  /* Encrypt Password using Encrypt Library */
  const hashPassword = (password: string) => {
    const encrypt = new Encrypt();
    return encrypt.password(password);
  };

  /* Prepare the payload for DB Query */
  const prepare = (user: any) => {
    if (!user.Password) return Promise.resolve(user);

    // `password` will always be hashed before being saved.
    return hashPassword(user.Password)
      .then((hash) => ({
        ...user,
        Password: hash,
        Profile: JSON.stringify(user.Profile),
      }))
      .catch((err: any) => `Error hashing password: ${err}`);
  };
};
