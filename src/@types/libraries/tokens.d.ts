export {};

declare global {
  interface TokensInterface {
    sign(data: TokenSignData): string;
    verify(token: TokenValue): void;
    decode(token: TokenValue): void;
  }

  interface TokenSignData {
    ID: number;
    [key: string]: any | string | null;
  }

  type TokenValue = string;
  type TokenUserID = number;
}
