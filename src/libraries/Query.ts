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

/*
 * This QueryHelper is designed to use a knexjs module to store and retrieve
 * data from a database.
 *
 * Common functionality is created and listed below, and additional custom
 * functionality can be added by extending this class.
 */
class QueryHelper implements QueryInterface {
  /* Class Props */
  tableName;
  fields;
  timeout;
  query = conn; // default connection

  constructor(params: QueryConstructorParams) {
    this.tableName = params.tableName;
    this.fields = "fields" in params ? params.fields : [];
    this.timeout = "timeout" in params ? params.timeout : 1000;
  }

  create(props) {
    delete props.ID; // not allowed to set `ID`

    return this.query
      .insert(props)
      .returning(this.fields)
      .into(this.tableName)
      .then((response) => {
        return { ID: response[0] };
      });
  }

  findOne(filters) {
    return this.find(filters).then((results) => {
      if (!Array.isArray(results)) return results;
      return results[0];
    });
  }

  find(filters) {
    return this.query
      .select(this.fields)
      .from(this.tableName)
      .where(filters)
      .timeout(this.timeout);
  }

  findAll() {
    return this.query
      .select(this.fields)
      .from(this.tableName)
      .timeout(this.timeout);
  }

  findById(ID) {
    return this.query
      .select(this.fields)
      .from(this.tableName)
      .where({ ID })
      .timeout(this.timeout);
  }

  update(props, filters, custom?) {
    const query = this.query
      .update(props)
      .from(this.tableName)
      .where(filters)
      .returning(this.fields)
      .timeout(this.timeout);

    if (typeof custom === "object" && Object.keys(custom).length >= 1) {
      custom.forEach((item, index) => {
        query.andWhere(item.column, item.operator, item.value);
      });
    }

    return query;
  }

  destroy(ID: number): void {
    this.query.del().from(this.tableName).where({ ID }).timeout(this.timeout);
  }

  setToken(props: any) {
    const { ResetToken, Email } = props;

    return this.query
      .update({
        ResetToken: this.query.fn.uuidToBin(ResetToken),
        TokenExpiry: this.query.raw("date_add(?, INTERVAL ? day)", [
          this.query.fn.now(),
          process.env.PW_RESET_TOKEN_EXPIRY,
        ]),
      })
      .from(this.tableName)
      .where({ Email })
      .returning(this.fields)
      .timeout(this.timeout);
  }

  checkToken(props: any) {
    const { Email } = props;

    return this.query
      .select(this.fields)
      .from(this.tableName)
      .where({
        Email: Email,
        Status: "Active",
      })
      .andWhere("TokenExpiry", ">", this.query.fn.now())
      .timeout(this.timeout);
  }

  convertToken(Token) {
    return this.query.fn.binToUuid(Token);
  }
}

export default QueryHelper;
