export {};

declare global {
  interface SchemaUsers {
    ID: bigint;
    Email: string;
    Password: string;
    FirstName: string;
    LastName: string;
    Salutation: string;
    ResetToken: string; // this is a uuid string for checking, stored as binary(16)
    TokenExpiry: number;
    CreateDate: Date;
    Status: SchemaUsersStatus;
  }

  type SchemaUsersStatus = "Active" | "Inactive" | "Pending"
}
