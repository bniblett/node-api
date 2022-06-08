"use strict";

/**
 * The purpose of this function is to ensure that an object does not
 * contain any data that it should not. Data passed TO the user in
 * a SELECT / GET request, or FROM a user in an Insert/Updating of
 * the database
 *
 * Loop through all `data` OBJECT fields
 * Check if the key is in the `allowed` Object
 * remove from the `data` object if it isn't allowed
 * return filtered `data` object
 *
 * @param allowed  object  An array of safe fields
 * @param data     $repeat An Object of data - Schema or body
 *
 * @author Byron Niblett <bniblett@gmail.com>
 * @return Data
 */
const secureData = (allowed, data) => {
  for (const [key, value] of Object.entries(data)) {
    if (!allowed.includes(key)) {
      delete data[key];
    }
  }
  return data;
};

export { secureData };
