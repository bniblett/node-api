"use strict";

/**
 * Create an Error Message Type
 */
type Error = {
  codeType: string;
  fieldName: string;
  type: string;
  expected: string | null;
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
  const ErrorMessage: Error[] = [];

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
        codeType = "unexpected-properties";
        fieldName = error?.params?.additionalProperty;
        type = "UnexpectedField";
        expected = null;
        break;

      /* custom format filters */
      case "format":
        codeType = "field-format";
        fieldName = field;
        type = error?.params?.format;
        expected = error?.params?.format;
        break;

      /* custom pattern filters */
      case "pattern":
        codeType = "field-pattern";
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

export { buildErrors };
