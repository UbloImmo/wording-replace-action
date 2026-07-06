import { SQL } from "bun";
import mysql from "mysql2/promise";

import { DB_CONFIG } from "../../constants/db.constants";

export const DB = new SQL(DB_CONFIG);

export const DB_POOL = mysql.createPool({
  host: DB_CONFIG.host,
  port: DB_CONFIG.port,
  user: DB_CONFIG.username,
  database: DB_CONFIG.database,
  password: DB_CONFIG.password,
  waitForConnections: true,
  connectionLimit: 10,
  maxIdle: 10,
  idleTimeout: 60000,
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelay: 0,
});
