import { Knex } from "knex";

export {};

declare global {
  interface QueryInterface {
    tableName: QueryTableName;
    fields: QueryFields;
    timeout: QueryTimeout;
    query: Knex<any, unknown[]>;

    create(props: QueryAnyProps): Promise<{ ID: number } | undefined>;
    findOne(filters: any): Promise<{ [key: string]: string } | undefined>;
    find(filters: any): Promise<{ [key: string]: string }[] | []>;
    findAll(): Promise<{ [key: string]: string }[] | []>;
    findById(ID: number): Promise<{ [key: string]: string }[] | []>;
    update(
      props: { [key: string]: string },
      filters: { [key: string]: string },
      custom?:
        | {
            field: string;
            operator: ">" | ">=" | "<" | "<=" | "=" | "!=";
            value: string;
          }[]
        | undefined
    ): Promise<any[]>;
    //destroy
    setToken(props: { ResetToken: string; Email: string }): Promise<any[]>;
    checkToken(props: { Email: string }): Promise<any[]>;
    convertToken(Token: string): string;
  }

  interface QueryConstructorParams {
    tableName: QueryTableName;
    fields?: QueryFields;
    timeout?: QueryTimeout;
  }

  type QueryTableName = string;
  type QueryFields = string[] | undefined;
  type QueryTimeout = number | undefined;
  type QueryAnyProps = { [key: string]: string };
}
