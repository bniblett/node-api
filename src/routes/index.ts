"use strict";

/**
 * Import Express - the web framework for Node.js. This framework
 * will handle all the routing and response handling for the user
 */
import express from "express";

/* Invoke Express Router */
const router = express.Router();

/**
 * Import all Routes to be used within the application
 */
import { route as DefaultGet } from "./default/get";
import { route as DefaultPost } from "./default/post";
//import { route as UserGet } from "./user/get";
import { route as UserPost } from "./user/post";
import { route as AuthPost } from "./auth/post";

/**
 * Add routes to router, and export
 */
//router.get("*", UserGet);
router.post("/user", UserPost);
router.post("/auth/login", AuthPost);

/**
 * Default Routes for a Catch-All
 */
router.get("*", DefaultGet);
router.post("*", DefaultPost);

export default router;
