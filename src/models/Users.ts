"use strict";

/**
 * Load the query argument, which is a valid database
 * connection and integration with the Knex Library,
 * ready to be configured
 */
import Query from "../libraries/Query";

/**
 * These are the Ajv Module validation rules that will
 * be passed to each /user endpoint script.
 */
const SchemaRules = {
  ID: {
    type: "integer",
  },
  Email: {
    type: "string",
    minLength: 5,
    maxLength: 255,
    format: "email",
  },
  Password: {
    type: "string",
    format: "_password",
  },
  FirstName: {
    type: "string",
    minLength: 5,
    maxLength: 60,
  },
  LastName: {
    type: "string",
    minLength: 5,
    maxLength: 60,
  },
  Salutation: {
    type: "string",
    minLength: 5,
    maxLength: 60,
  },
  ResetToken: {
    type: "string",
    format: "uuid",
  },
  TokenExpiry: {
    type: "integer",
    format: "date-time",
  },
  CreateDate: {
    type: "string",
  },
  Status: {
    enum: ["Active", "Inactive", "Pending"],
  },
};

export { Query, SchemaRules };
