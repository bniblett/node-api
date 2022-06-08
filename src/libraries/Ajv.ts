"use strict";

/**
 * Import Ajv validation utilities
 */
import Ajv from "ajv";
import addFormats from "ajv-formats";

/**
 * Start a new Ajv instance, and add the provided filters
 * from ajv-filters module:
 *
 * - email
 * - date-time
 * - password
 */
const ajv = new Ajv();
addFormats(ajv, ["email", "date-time", "password"]);

ajv.addFormat(
  "_password",
  new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})")
);

/* Export the updated ajv instance and SchemaType */
export { ajv };
export { JSONSchemaType } from "ajv";
