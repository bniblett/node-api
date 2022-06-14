"use strict";

/**
 * Import Express - the web framework for Node.js. This framework
 * will handle all the routing and response handling for the user
 */
import express from "express";

/* Invoke Express Router */
const router = express.Router();

/* Import Middlewares */
import { IsAuthenticated } from "../middleware/Authenticate";

/* Default Routes */
import { route as DefaultGet } from "./default/get";
import { route as DefaultPost } from "./default/post";

/* Account Routes */
import { route as LoginPost } from "./account/login/post";
import { route as ForgotPasswordPost } from "./account/password/forgot/post";
import { route as ResetPasswordPut } from "./account/password/reset/put";
import { route as AccountPost } from "./account/post";
import { route as UserGet } from "./account/get";

/**
 * Add routes to router, and export
 */
router.get("/account", IsAuthenticated, UserGet);
router.post("/account/login", LoginPost);
router.post("/account/password/forgot", ForgotPasswordPost);
router.put("/account/password/reset/:Email/:ResetToken", ResetPasswordPut);
router.post("/account", AccountPost);

/**
 * Default Routes for a Catch-All
 */
router.get("*", DefaultGet);
router.post("*", DefaultPost);

export default router;
