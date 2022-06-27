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

/* Auth Routes */
import { route as LoginPost } from "./auth/login/post";
import { route as ForgotPasswordPost } from "./auth/password/forgot/post";
import { route as ResetPasswordPut } from "./auth/password/reset/put";
router.post("/auth/login", LoginPost);
router.post("/auth/forgot-password", ForgotPasswordPost);
router.put("/auth/reset-password/:Email/:ResetToken", ResetPasswordPut);

/* Account routes */
import { route as AccountPost } from "./account/post";
import { route as AccountGet } from "./account/get";
import { route as AccountPut } from "./account/put";
import { route as AccountAvatarPut } from "./account/avatar/put";
router.post("/account", AccountPost);
router.get("/account", IsAuthenticated, AccountGet);
router.put("/account", IsAuthenticated, AccountPut);
router.put("/account/avatar", IsAuthenticated, AccountAvatarPut);

/* Default Routes */
import { route as DefaultGet } from "./default/get";
import { route as DefaultPost } from "./default/post";
router.get("*", DefaultGet);
router.post("*", DefaultPost);

export default router;
