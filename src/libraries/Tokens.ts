"use strict";

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
class Tokens {

  constructor() {}

  sign(data) {
    return jwt.sign(
      data,
      "C*F-JaNdRgUkXn2r5u8x/A?D(G+KbPeShVmYq3s6v9y$B&E)H@McQfTjWnZr4u7w",
      {
        expiresIn: "24h",
      }
    );
  }
}

export default Tokens;
