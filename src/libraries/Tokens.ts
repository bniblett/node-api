"use strict";

/**
 * Import the Request and Response objects from Express
 */
import { Request, Response } from "express";

/**
 * Import the Request and Response objects from Express
 */
import jwt from "jsonwebtoken";

/**
 * Build the json web token that will be sent back to the user
 * so they can authenticate the user
 *
 * @param data  Object Data Object passed from the Application
 *
 * @author Byron Niblett <bniblett@gmail.com>
 * @return Object
 */
class Tokens implements TokensInterface {

  constructor() {}

  sign(data) {
    return jwt.sign(data, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRY,
    });
  }

  verify(token) {
    jwt.verify(token, process.env.JWT_SECRET);
  }

  decode(token) {
    try {
      const { ID } = jwt.decode(token) as {
        ID: TokenUserID;
      };

      return ID;
    } catch {
      throw new Error("invalid");
    }
  }
}

export default Tokens;
