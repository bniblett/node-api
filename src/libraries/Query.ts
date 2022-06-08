"use strict";

/**
 * Import Knex module
 * Load Database Connection, import knex Library
 */
import { knex } from "knex";
import { dbconn } from "../database/mysql";

/**
 * Initiate knex setup
 */
const conn = knex(dbconn);

/**
 * Defined Types
 */
type TableName = string;
type Fields = string[] | undefined;
type Timeout = number | undefined;

/**
 * Defined Interfaces
 */
interface Params {
  tableName: TableName;
  [key: string]: any;
}

/*
 * This QueryHelper is designed to use a knexjs module to store and retrieve
 * data from a database.
 *
 * Common functionality is created and listed below, and additional custom
 * functionality can be added by extending this class.
 */
class QueryHelper {
  /* Class Props */
  tableName: TableName;
  fields: Fields;
  timeout: Timeout;
  query: any = conn; // default connection

  constructor(params: Params) {
    this.tableName = params.tableName;
    this.fields = this.fields = "fields" in params ? params.fields : [];
    this.timeout = this.timeout = "timeout" in params ? params.timeout : 1000;
  }

  create(props: any) {
    delete props.ID; // not allowed to set `ID`

    return this.query
      .insert(props)
      .returning(this.fields)
      .into(this.tableName)
      .then((response) => {
        return { ID: response[0] };
      });
  }

  findOne(filters: any) {
    return this.find(filters).then((results) => {
      if (!Array.isArray(results)) return results;
      return results[0];
    });
  }

  find(filters: any) {
    return this.query
      .select(this.fields)
      .from(this.tableName)
      .where(filters)
      .timeout(this.timeout);
  }

  findAll() {
    this.query.select(this.fields).from(this.tableName).timeout(this.timeout);
  }

  findById(ID: number) {
    this.query
      .select(this.fields)
      .from(this.tableName)
      .where({ ID })
      .timeout(this.timeout);
  }

  update(ID: number, props: any) {
    delete props.ID;

    return this.query
      .update(props)
      .from(this.tableName)
      .where({ ID })
      .returning(this.fields)
      .timeout(this.timeout);
  }

  destroy(ID: number): void {
    this.query.del().from(this.tableName).where({ ID }).timeout(this.timeout);
  }
}

export default QueryHelper;
