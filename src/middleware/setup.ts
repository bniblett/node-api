"use strict";

/**
 * Import the Request and Response objects from Express
 */
import { Request, Response, NextFunction } from "express";

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
export function Validate(req: Request, res: Response, next: NextFunction) {
  next();
}

/**
 * Create a middleware function that, when in development mode
 * only, will console log the request body variables, and the
 * request query variables for easy development validation
  *
 * @param req  Object The Express Request Object
 * @param res  Object The Express Response Object
 *
 * @author Byron Niblett <bniblett@gmail.com>
 * @return null
 */
export function Debug(req: Request, res: Response, next: NextFunction) {
  if (process.env.NODE_ENV === "development") {
    //console.log("body", req.body);
    //console.log("query", req.query);
  }
  next();
}
