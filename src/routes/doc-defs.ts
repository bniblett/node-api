"use strict";

/**
 * @apiDefine CommonHeaders
 * @apiHeader {String} Accept-Encoding ="Accept-Encoding: gzip, deflate"    Accept Encoding Value
 */

/**
 * @apiDefine AuthHeader
 * @apiHeader {String} Authorization ="xxxxxxx.xxxxxxx.xxxxxxx"             JSON Web Token provided at Login
 */

/**
 * @apiDefine MediaHeader
 * @apiHeader {String} Content-Type ="multipart/form-data"             Prepare Server for Upload
 */

/**
 * @apiDefine None Global Access
 * There is no limitation on who can use this endpoint.
 */

/**
 * @apiDefine User User Access
 * A JSON Web Token must be provided to ensure User Authentication
 */

/**
 * @apiDefine Admin Admin Access
 * A JSON Web Token must be provided to ensure User Authentication
 * A user must also have the role of Admin
 */

/**
 * @apiDefine 401Example
 * @apiErrorExample {json} 401 Error:
 *     The JSON Web Token is invalid.
 *
 *     HTTP/1.1 401 Not Authorized
 *     {
 *       "success": false,
 *       "code": {String},
 *       "message": "Lorem ipsum dolor sit amet",
 *       "detail": "Lorem ipsum dolor sit amet, consectetur adipiscing elit",
 *       "help": "https://example.com/help/error/account",
 *       "path": {String},
 *       "timestamp": "YYYY-MM-DDTHH:MM:SS.000Z",
 *     }
 */

/**
 * @apiDefine 404Example
 * @apiErrorExample {json} 404 Error:
 *     Can't find the data in the database.
 *
 *     HTTP/1.1 404 Not Found
 *     {
 *       "success": false,
 *       "code": {String},
 *       "message": "Lorem ipsum dolor sit amet",
 *       "detail": "Lorem ipsum dolor sit amet, consectetur adipiscing elit",
 *       "help": "https://example.com/help/error/account",
 *       "path": {String},
 *       "timestamp": "YYYY-MM-DDTHH:MM:SS.000Z",
 *     }
 */

/**
 * @apiDefine 422Example
 * @apiErrorExample {json} 422 Error:
 *     Data alreday exists in the database.
 *
 *     HTTP/1.1 422 Conflict
 *     {
 *       "success": false,
 *       "code": {String},
 *       "message": "Lorem ipsum dolor sit amet",
 *       "detail": "Lorem ipsum dolor sit amet, consectetur adipiscing elit",
 *       "payload": {Mixed},
 *       "help": "https://example.com/help/error/account",
 *       "path": {String},
 *       "timestamp": "YYYY-MM-DDTHH:MM:SS.000Z",
 *     }
 */

/**
 * @apiDefine 500Example
 * @apiErrorExample {json} 500 Error:
 *     HTTP/1.1 500 Internal Server Error
 *     {
 *       "success": false,
 *       "code": {String},
 *       "message": "Lorem ipsum dolor sit amet",
 *       "detail": "Lorem ipsum dolor sit amet, consectetur adipiscing elit",
 *       "payload":{Number},
 *       "help": "https://example.com/help/error/account",
 *       "path": {String},
 *       "timestamp": "YYYY-MM-DDTHH:MM:SS.000Z",
 *     }
 */
