"use strict";

/**
 * Require the dotenv package. This will parse all entries in
 * the .env file, and allow them to be accessed through:
 * process.env.xxx
 */
import "dotenv/config";

/**
 * Import Express - the web framework for Node.js. This framework
 * will handle all the routing and response handling for the user
 */
import express from "express";

/**
 * Import Helmet - a way to help secure Express by setting various
 * HTTP headers for this application.
 */
import helmet from "helmet";

/**
 * Invoke Express. We can configure express further by using app.use()
 * Different options can be found in the link below:
 *
 * https://expressjs.com/en/api.html
 */
const app = express();

/**
 * Here we can initiate Helmet, and we can configure it using
 * various options. To view those options, see link:
 *
 * https://www.npmjs.com/package/helmet
 */
app.use(helmet({}));

/**
 * Here we will setup express to parse incoming requests
 * with JSON payloads
 *
 * https://expressjs.com/en/api.html
 */
app.use(express.json());

/**
 * Import all middleware to be used within the application
 */
import { Debug, Validate } from "./middleware/Setup";

/**
 * Import all Routes to be used within the application
 */
import Routes from "./routes";

/**
 * Apply all middleware validation and route endpoints
 */
app.use("*", Debug, Validate);
app.use("/api", Routes);

/**
 * Start the server on the port found in the .env file, and
 * display a message saying it's enabled.
 */
app.listen(process.env.PORT, () => {
  console.log("Application started on port", process.env.PORT);
});
