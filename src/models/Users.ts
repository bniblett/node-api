"use strict";

/**
 * Load the query argument, which is a valid database
 * connection and integration with the Knex Library,
 * ready to be configured
 */
import Query from "../libraries/Query";

/**
 * This is the schema interface setup. This will declare what
 * property type names our schema object will have in validation.
 */
interface SchemaInterface {
  ID: number;
  Email: string;
  Password: string;
  FirstName: string;
  LastName: string;
  Salutation: string;
  ResetToken: string;
  TokenExpiry: string;
  CreateDate: string;
  IsActive: string;
}

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
    maxLength: 60,
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
  },
  TokenExpiry: {
    type: "integer",
    format: "date-time",
  },
  CreateDate: {
    type: "string",
  },
  IsActive: {
    type: "string",
  },
};

export { Query, SchemaInterface, SchemaRules };
