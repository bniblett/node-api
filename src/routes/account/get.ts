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
 * The Model script will load a list of all files inside the
 * /models folder. Just declare which model inside the {} that
 * is required, and it will pull it automatically
 */
import { Query } from "../../models/Users";

/**
 * Start Query Object
 */
const Users = new Query({ tableName: "Users" });

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

  Users.findById(req.UserID)
    .then((results) => {
      if (results.length === 0) {
        response.not_found({ code: "user-none" });
      } else {
        const user = results[0];
        delete user.Password;

        response.ok({
          payload: user,
          code: "user-exists",
        });
      }
    })
    .catch((err) => {
      response.server_error({
        code: "system-find",
        payload: req.UserID,
        err: err,
      });
    });
};
