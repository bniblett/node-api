"use strict";

/**
 * Import the Request and Response objects from Express
 */
import bcrypt from "bcrypt";

class Encrypt implements EncryptInterface {
  /* class props */
  SALT_ROUNDS: number = 10;

  constructor() {}

  /* encrypt password */
  password(password) {
    return bcrypt.hash(password, this.SALT_ROUNDS);
  }

  /* compare passwords */
  compare(PlainPassword, HashedPassword) {
    return bcrypt.compare(PlainPassword, HashedPassword);
  }
}

export default Encrypt;
