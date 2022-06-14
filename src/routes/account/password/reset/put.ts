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
 */
import APIResponse from "../../../../libraries/APIResponse";
import { ajv, JSONSchemaType } from "../../../../libraries/Ajv";
import Encrypt from "../../../../libraries/Encrypt";

/**
 * The Model script will load a list of all files inside the
 * /models folder. Just declare which model inside the {} that
 * is required, and it will pull it automatically
 */
import { Query, SchemaInterface, SchemaRules } from "../../../../models/Users";

/**
 * Import the following Helper Scripts:
 *  - Data Helper
 *  - Validation Helper
 */
import { secureData } from "../../../../helpers/data";
import { buildErrors } from "../../../../helpers/validation";

/**
 * Start Query Object
 */
const Users = new Query({ tableName: "Users" });

/**
 * Define which fields from the schema are allowed to be
 * passed for this request method {POST}.
 */
const _Accepted = ["Email", "Password", "ResetToken"];

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
  const Data = { ...req.body, ...req.params };
  const Rules = secureData(_Accepted, SchemaRules);
  const response = new APIResponse(req, res);

  /**
   * Build Schema for validation
   */
  const Schema: JSONSchemaType<SchemaInterface> = {
    type: "object",
    properties: Rules,
    required: ["Email", "Password", "ResetToken"],
    additionalProperties: false,
  };

  /**
   * Compile the Schema, then Validate the Input
   */
  const validate = ajv.compile(Schema);
  const valid = validate(Data);

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

  Users.checkToken(Data)
    .then((data) => {
      let validToken = false;

      /* Convert Token and check if they match */
      if (typeof data[0] !== "undefined") {
        const Token = Users.convertToken(data[0].ResetToken);
        if (Token === Data.ResetToken) validToken = true;
      }

      /* if the tokens match */
      if (validToken !== true) {
        hashPassword(Data.Password)
          .then((hashed) => {
            const UpdateData = {
              Password: hashed,
              ResetToken: null,
              TokenExpiry: null,
            };
            type NewType = {
              column: string;
              operator: string;
              value: string;
            }[];

            const customArgs: NewType = [];
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
