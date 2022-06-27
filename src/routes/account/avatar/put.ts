"use strict";

/**
 * @api {put} /account/avatar/ Update User Avatar
 * @apiName UpdateUserAvatar
 * @apiGroup Accounts
 * @apiVersion 0.0.1
 * @apiUse CommonHeaders
 * @apiUse AuthHeader
 * @apiUse MediaHeader
 * @apiPermission User
 * @apiSampleRequest off
 *
 * @apiDescription This function won't accept any body, it will just accept a file
 * upload, then save and process the file, and update the user Profile
 *
 * @apiUse 500Example
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "success": true,
 *       "code": "user-updated",
 *       "message": "User Updated",
 *       "detail": "User details updated successfully",
 *       "path": "/api/account",
 *       "timestamp": "YYYY-MM-DDTHH:MM:SS.000Z",
 *     }
 */

/**
 * Import Module Packages
 *  - the Request and Response objects from Express
 */
import { Request, Response } from "express";

/**
 * Import API Libraries
 *  - API Response Library
 *  - Ajv Library (Class & Type)
 *  - Query Library
 */
import APIResponse from "../../../libraries/APIResponse";
import Query from "../../../libraries/Query";

/**
 * Start Query Object
 */
const Users = new Query({ tableName: "Users", fields: ["Profile"] });

/**
 * Create an Endpoint function that will update an
 * existing user in the system.
 *
 * This endpoint will hash / sanitize the props
 * before making the database update action
 *
 * @param req  Object The Express Request Object
 * @param res  Object The Express Response Object
 *
 * @author Byron Niblett <bniblett@gmail.com>
 * @return void
 */
export const route = (req: Request, res: Response): void => {
  /**
   * Collect the Props that were passed
   */
  const Props: SchemaUserUpdate = {
    Profile: req.body.Profile,
  };
  const response = new APIResponse(req, res);

  /**
   * If there is an error, find the type and display an
   * error response with appropriate error code
   */
  //if (!valid) {}

  /**
   * Prepare / Sanitize the Props object which will be
   * updating the user data provided in the call.
   */
  Users.findById(req.UserID)
    .then((results: any) => {
      const props = results[0];
      const Profile = JSON.stringify({
        ...JSON.parse(props.Profile),
        Avatar: "Smash",
      });

      Users.update({ Profile }, { ID: req.UserID })
        .then((data) => {
          response.ok({
            code: "user-updated",
          });
        })
        .catch((err) => {
          response.server_error({
            code: "system-update",
            payload: { ID: req.UserID },
            err: err,
          });
        });
    })
    .catch((err) => {
      response.server_error({
        code: "system-preparing",
        payload: { ID: req.UserID },
        err: err,
      });
    });
};
