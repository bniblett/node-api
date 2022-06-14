export {};

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      APP_DEFAULT_PATH: string;
      NODE_ENV: "development" | "production";
      PORT?: number;

      DB_HOST: string;
      DB_USER: string;
      DB_PASS: string;
      DB_NAME: string;

      JWT_SECRET: string;
      JWT_EXPIRY: string;

      PW_RESET_TOKEN_EXPIRY: number;

      PASSWORD_REGEX: number;

      [key: string]: string | undefined;
    }
  }
}
