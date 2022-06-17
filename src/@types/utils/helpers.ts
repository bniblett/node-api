export {};

declare global {
  interface ValidationError {
    codeType: string;
    fieldName: string;
    type: string;
    expected: string | null;
  };
