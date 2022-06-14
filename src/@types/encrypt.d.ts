export {};

declare global {
  interface EncryptInterface {
    SALT_ROUNDS: number;
    password(password: string): Promise<string>;
    compare(PlainPassword: string, HashedPassword: string): Promise<boolean>;
  }
}
