"use strict";

/**
 * @api {get} /account/ Request User Data
 * @apiName GetUser
 * @apiGroup Accounts
 * @apiVersion 0.0.1
 * @apiUse CommonHeaders
 * @apiUse AuthHeader
 * @apiPermission User
 * @apiSampleRequest off
 *
 * @apiDescription This function does not require a JSON Body or any params, and will
 * return the User's record from the database. The UserID is provided in the JSON Web
 * Token (JWT), so it is not needed as an endpoint param.
 *
 * @apiUse 401Example
 * @apiUse 404Example
 * @apiUse 500Example
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "success": true,
 *       "code": "user-exists",
 *       "message": "Lorem ipsum dolor sit amet",
 *       "detail": "Lorem ipsum dolor sit amet, consectetur adipiscing elit",
 *       "path": "/account",
 *       "timestamp": "YYYY-MM-DDTHH:MM:SS.000Z",
 *       "payload": {
 *           "ID": 1,
 *           "Email": "test@email.com",
 *           "Profile": {
 *               "LastName": "LastName",
 *               "FirstName": "FirstName",
 *               "Salutation": "Mr."
 *           },
 *           "CreateDate": "YYYY-MM-DDTHH:MM:SS.000Z",
 *           "Status": "Active"
 *       },
 *     }
 */

/**
 * Import the Request and Response objects from Express
 */
import { Request, Response } from "express";

/**
 * Import API Libraries
 *  - API Response Library
 *  - Query Library
 */
import Query from "../../libraries/Query";
import APIResponse from "../../libraries/APIResponse";

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
          payload: { ...user, Profile: JSON.parse(user.Profile) },
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
