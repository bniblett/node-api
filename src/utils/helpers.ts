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

/**
 * The purpose of this function is to build an object of error
 * data from the avj validation module.
 *
 * This will Loop through all error messages provided by avj and
 * build the proper error message depending on what the error is:
 *
 * required, missing, format, not expected etc
 *
 * @param validate  object  the validate response from avj
 *
 * @author Byron Niblett <bniblett@gmail.com>
 * @return ErrorMessage
 */
const buildErrors = (validate) => {
  /**
   * Start an Error Message Array
   */
  const ErrorMessage: ValidationError[] = [];

  /**
   * Loop through the validation Errors
   */
  validate?.errors?.forEach(function (error) {
    /* Start a Field string */
    const field: string = error?.instancePath.replace("/", "");

    /**
     * fields to be passed back in the error message
     */
    let errorCode: ValidationErrorCode;
    let primaryField: ValidationPrimaryField;
    let secondaryField: ValidationSecondaryField;
    let params: ValidationParams;

    /**
     * Switch based on error keyword
     */
    switch (true) {
      /**
       * Field(s) are missing from the POST JSON Body that
       * shoud be present
       */
      case error?.keyword == "required" && error?.instancePath == "":
        errorCode = "required-primary";
        primaryField = error?.params?.missingProperty;
        secondaryField = null;
        params = error?.params;
        break;

      /**
       * Field(s) are missing from a JSON field Body that
       * shoud be present
       */
      case error?.keyword == "required" && error?.instancePath != "":
        errorCode = "required-secondary";
        primaryField = error?.instancePath.replace("/", "");
        secondaryField = error?.params?.missingProperty;
        params = error?.params;
        break;

      /**
       * Field(s) exist in the JSON field Body that should
       * NOT be present
       */
      case error?.keyword == "additionalProperties" &&
        error?.instancePath == "":
        errorCode = "properties-unnecessary";
        primaryField = error?.params?.additionalProperty;
        secondaryField = null;
        params = error?.params;
        break;

      /* Min / Max Object or Array Properties aren't valid */
      case error?.keyword == "minProperties" ||
        error?.keyword == "maxProperties":
        errorCode = "properties-count";
        primaryField = field;
        secondaryField = null;
        params = error?.params;
        break;

      /* custom format filters */
      case error?.keyword == "format":
        errorCode = "format";
        primaryField = field;
        secondaryField = null;
        params = error?.params;
        break;

      /* Min / Max Lengths aren't valid */
      case error?.keyword == "minLength" || error?.keyword == "maxLength":
        errorCode = error?.keyword;
        primaryField = field;
        secondaryField = null;
        params = error?.params;
        break;

      /* default error message */
      default:
        errorCode = "no";
        primaryField = field;
        secondaryField = error?.keyword;
        params = null;
        break;
    }

    /* Add to Error Message Array */
    ErrorMessage.push({
      errorCode: errorCode,
      primaryField: primaryField,
      secondaryField: secondaryField,
      params: params,
    });
  });

  /**
   * Return Error Message
   */
  return ErrorMessage;
};

export { buildErrors, secureData };
