"use strict";
export const ID = {
  type: "integer",
};

export const Email = {
  type: "string",
  minLength: 5,
  maxLength: 60,
  format: "email",
};

export const Password = {
  type: "string",
  format: "_password",
};

export const Profile = {
  type: "object",
  minProperties: 3,
  required: ["FirstName", "LastName", "Salutation"],
};

export const ResetToken = {
  type: "string",
};

export const TokenExpiry = {
  type: "integer",
  format: "date-time",
};

export const CreateDate = {
  type: "string",
};

export const IsActive = {
  type: "string",
};
