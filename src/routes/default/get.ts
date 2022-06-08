"use strict";

/**
 * Import the Request and Response objects from Express
 */
import { Request, Response } from "express";

/**
 * Import the Response Payload object library.
 */
import APIResponse from "../../libraries/APIResponse";

/**
 * Create a function that will display a json response
 * when using the GET method
 *
 * @param req  Object The Express Request Object
 * @param res  Object The Express Response Object
 *
 * @author Byron Niblett <bniblett@gmail.com>
 * @return null
 */
export const route = (req: Request, res: Response): void => {
  const response = new APIResponse(req, res);
  response.unauthorized({ code: "default-endpoint" });
};
