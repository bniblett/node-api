export {};

declare global {
  interface ValidationError {
    errorCode: ValidationErrorCode;
    primaryField: ValidationPrimaryField;
    secondaryField: ValidationSecondaryField;
    params: ValidationParams;
  }

  type ValidationErrorCode = string;
  type ValidationPrimaryField = string;
  type ValidationSecondaryField = string | null;
  type ValidationParams = object | null;
}