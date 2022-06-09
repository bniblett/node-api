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
import APIResponse from "../../../libraries/APIResponse";
import { ajv, JSONSchemaType } from "../../../libraries/ajv";
import Encrypt from "../../../libraries/Encrypt";
import Tokens from "../../../libraries/Tokens";

/**
 * The Model script will load a list of all files inside the
 * /models folder. Just declare which model inside the {} that
 * is required, and it will pull it automatically
 */
import { Query, SchemaInterface, SchemaRules } from "../../../models/Users";

/**
 * Import the following Helper Scripts:
 *  - Data Helper
 *  - Validation Helper
 */
import { secureData } from "../../../helpers/data";
import { buildErrors } from "../../../helpers/validation";

/**
 * Start Query Object
 */
const Users = new Query({ tableName: "Users" });

/**
 * Define which fields from the schema are allowed to be
 * passed for this request method {POST}.
 */
const _Accepted = ["Email", "Password"];

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
    required: ["Email", "Password"],
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

  /* Search for user's Email Address */
  Users.findOne({ Email: Props.Email })
    .then((user) => {
      /**
       * Reusable const 'unauthorized' to be used when there is
       * no user or the wrong password
       */
      const unauthorized = { code: "auth-failed" };

      /* If there isn't a user, display unauthorized message */
      if (typeof user == "undefined") {
        response.unauthorized(unauthorized);

      /* If there is a user, perform more checks */
      } else {
        /* Compare user object password to props password */
        const encrypt = new Encrypt();
        encrypt.compare(Props.Password, user.Password).then((compare) => {
          /* If the passwords match */
          if (compare === false) {
            response.unauthorized(unauthorized);
          } else {
            /* Delete Password from user object */
            if ("Password" in user) delete user.Password;

            const Token = new Tokens();
            response.ok({
              payload: user,
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
        data: { Email: Props.Email },
        err: err,
      });
    });
};
