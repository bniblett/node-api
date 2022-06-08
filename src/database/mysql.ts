"use strict";

/**
 * Shape the Error Message object
 */
type DBConn = {
  client: "mysql";
  connection: {
    host: any;
    user: any;
    password: any;
    database: any;
  };
  debug: boolean;
};

/**
 * Database Connection Details
 */
const dbconn: DBConn = {
  client: "mysql",
  connection: {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
  },
  debug: true,
};

/**
 * Export Database Config
 */
export { dbconn };
