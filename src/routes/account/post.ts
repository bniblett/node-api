"use strict";

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
 */
import APIResponse from "../../libraries/APIResponse";
import { ajv, JSONSchemaType } from "../../libraries/Ajv";
import Encrypt from "../../libraries/Encrypt";
import Tokens from "../../libraries/Tokens";

/**
 * The Model script will load a list of all files inside the
 * /models folder. Just declare which model inside the {} that
 * is required, and it will pull it automatically
 */
import { Query, SchemaInterface, SchemaRules } from "../../models/Users";

/**
 * Import the following Helper Scripts:
 *  - Data Helper
 *  - Validation Helper
 */
import { secureData } from "../../helpers/data";
import { buildErrors } from "../../helpers/validation";

/**
 * Start Query Object
 */
const Users = new Query({ tableName: "Users" });

/**
 * Define which fields from the schema are allowed to be
 * passed for this request method {POST}.
 */
const _Accepted = ["Email", "Password", "FirstName", "LastName", "Salutation"];

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
  const Props = req.body;
  const Rules = secureData(_Accepted, SchemaRules);
  const response = new APIResponse(req, res);

  /**
   * Build Schema for validation
   */
  const Schema: JSONSchemaType<SchemaInterface> = {
    type: "object",
    properties: Rules,
    required: ["Email", "Password", "FirstName", "LastName"],
    additionalProperties: false,
  };

  /**
   * Compile the Schema, then Validate the Input
   */
  const validate = ajv.compile(Schema);
  const valid = validate(Props);

  /**
   * If there is an error, find the type and display an
   * error response with appropriate error code
   */
  if (!valid) {
    const ErrorMessage = buildErrors(validate);
    response.validation({
      code: "validate-" + ErrorMessage[0].codeType,
      field: ErrorMessage[0].fieldName,
      type: ErrorMessage[0].type,
      expected: ErrorMessage[0].expected,
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
      .then((hash) => ({ ...user, Password: hash }))
      .catch((err: any) => `Error hashing password: ${err}`);
  };
};
