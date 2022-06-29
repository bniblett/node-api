"use strict";

/**
 * Import app
 */
import app from "./app";

/**
 * Start the server on the port found in the .env file, and
 * display a message saying it's enabled.
 */
app.listen(process.env.PORT, () => {
  console.log("Application started on ports", process.env.PORT);
});
