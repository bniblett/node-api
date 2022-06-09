"use strict";

/**
 * Import Express - the web framework for Node.js. This framework
 * will handle all the routing and response handling for the user
 */
import express from "express";

/* Invoke Express Router */
const router = express.Router();

/* Default Routes */
import { route as DefaultGet } from "./default/get";
import { route as DefaultPost } from "./default/post";

/* User Routes */
//import { route as UserGet } from "./user/get";
import { route as UserPost } from "./user/post";

/* Auth Routes */
import { route as AuthLoginPost } from "./auth/login/post";

/**
 * Add routes to router, and export
 */
//router.get("*", UserGet);
router.post("/user", UserPost);
router.post("/auth/login", AuthLoginPost);

/**
 * Default Routes for a Catch-All
 */
router.get("*", DefaultGet);
router.post("*", DefaultPost);

export default router;
