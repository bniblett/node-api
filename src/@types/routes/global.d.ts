export {};

declare global {
  interface SchemaUserLogin {
    Email: SchemaFieldTypeEmail;
    Password: SchemaFieldTypePassword;
  }

  interface SchemaUserForgot {
    Email: SchemaFieldTypeEmail;
  }

  interface SchemaUserReset {
    Email: SchemaFieldTypeEmail;
    Password: SchemaFieldTypePassword;
    ResetToken: SchemaFieldTypeResetToken;
  }

  interface SchemaUserCreate {
    Email: SchemaFieldTypeEmail;
    Password: SchemaFieldTypePassword;
    Profile: SchemaUserFieldProfile;
  }

  interface SchemaUserUpdate {
    Password?: SchemaFieldTypePassword;
    Profile?: SchemaUserFieldProfile;
  }

  interface SchemaUserFieldProfile {
    FirstName: string;
    LastName: string;
    Salutation: string;
    Avatar?: [];
  }

  type SchemaFieldTypeID = number;
  type SchemaFieldTypeEmail = string;
  type SchemaFieldTypePassword = string;
  type SchemaFieldTypeProfile = [];
  type SchemaFieldTypeResetToken = string;
}
