"use strict";

/**
 * Import the Request and Response objects from Express
 */
import { Request, Response, NextFunction } from "express";

/**
 * Import API Libraries
 *  - API Response Library
 *  - Tokens Library
 */
import APIResponse from "../libraries/APIResponse";
import Tokens from "../libraries/Tokens";

/**
 * Create a middleware function that is going to validate common
 * query variables that are used by the application.
 *
 * Example: Ensure that the page number is valid, the locale is
 * correctly set.
 *
 * @param req  Object The Express Request Object
 * @param res  Object The Express Response Object
 *
 * @author Byron Niblett <bniblett@gmail.com>
 * @return null
 */
export function IsAuthenticated(
  req: Request,
  res: Response,
  next: NextFunction
) {
  /* create an api response */
  const response = new APIResponse(req, res);

  /* if the authorization header isn't set */
  if (req.headers?.authorization === undefined) {
    response.unauthorized({ code: "token-missing" });
    return;
  }

  /* Get our authorization token, start new Tokens() */
  const AuthToken = req.headers.authorization;
  const Token = new Tokens();

  /* if the token is valid */
  try {
    Token.verify(AuthToken);
    req.UserID = Token.decode(AuthToken);
    next();
  } catch (err) {
    response.unauthorized({ code: "token-invalid" });
  }
}
