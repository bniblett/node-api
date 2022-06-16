export {};

declare global {
  interface APIResponseInterface {
    OK: number;
    BAD_REQUEST: number;
    UNAUTHORIZED: number;
    FORBIDDEN: number;
    NOT_FOUND: number;
    UNSUPPORTED_ACTION: number;
    CONFLICT: number;
    VALIDATION_FAILED: number;
    SERVER_ERROR: number;
    date: Date;

    build(status: number, body: APIBuildBody): void;
    buildMessage(
      file: APILanguageFiles,
      code: string,
      errors?: any
    ): APIBuildMessage;
    ok(data: APIOkData): void;
    unauthorized(data: { code: string }): void;
    validation(data: { code: string; errors?: APIValidationError }): void;
    conflict(data: { code: string }): void;
    not_found(data: { code: string }): void;
    server_error(data: { code: string; payload?: APIPayload; err?: any }): void;
  }

  interface APIResponseBody {
    success: boolean;
    code: string;
    message: string;
    detail?: string;
    help?: string;
    path: string;
    timestamp: string;
    payload?: APIPayload;
    token?: string;
    errors?: string;
  }

  interface APIBuildBody {
    language: APILanguageFiles;
    success: boolean;
    code: string;
    errors?: APIValidationError | undefined;
    payload?: APIPayload;
    token?: string;
  }

  interface APIValidationError {
    field: string;
    type: string;
    expected: string;
  }

  interface APIOkData {
    code: string;
    payload?: APIPayload;
    token?: string;
  }

  interface APIPayload {
    [key: string]: any;
  }

  interface APIBuildMessage {
    message: string;
    detail: string;
  }

  type APILanguageFiles = "translations.json" | "errors.json";
}
