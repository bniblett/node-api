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
    let codeType: string;
    let fieldName: string;
    let type: string;
    let expected: string | null;

    /**
     * Switch based on error keyword
     */
    switch (error?.keyword) {
      /* Fields are included that shoudn't */
      case "required":
        codeType = "required";
        fieldName = error?.params?.missingProperty;
        type = error?.keyword;
        expected = null;
        break;

      /* Fields are included that shoudn't */
      case "additionalProperties":
        codeType = "properties";
        fieldName = error?.params?.additionalProperty;
        type = "UnexpectedField";
        expected = null;
        break;

      /* custom format filters */
      case "format":
        codeType = "format";
        fieldName = field;
        type = error?.params?.format;
        expected = error?.params?.format;
        break;

      /* custom pattern filters */
      case "pattern":
        codeType = "pattern";
        fieldName = field;
        type = error?.params?.pattern;
        expected = null;
        break;

      /* Min / Max Lengths aren't valid */
      case "minLength":
      case "maxLength":
        codeType = error?.keyword;
        fieldName = field;
        type = error?.keyword;
        expected = error?.params?.limit;
        break;

      /* default error message */
      default:
        codeType = "no";
        fieldName = field;
        type = error?.keyword;
        expected = null;
        break;
    }

    /* Add to Error Message Array */
    ErrorMessage.push({
      codeType: codeType,
      fieldName: fieldName,
      type: type,
      expected: expected,
    });
  });

  /**
   * Return Error Message
   */
  return ErrorMessage;
};

export { buildErrors, secureData };
