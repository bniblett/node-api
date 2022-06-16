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
export function SetLocale(req: Request, res: Response, next: NextFunction) {
  req.locale = "en-CA";
  next();
}
