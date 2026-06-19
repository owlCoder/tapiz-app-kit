/**
 * @tapizlabs/app-kit/db — serverless-safe Aiven MySQL pool options.
 * Builds mysql2 pool options tuned for Vercel serverless against Aiven free tier
 * (max:1 connection per warm instance) straight from env vars.
 */
import mysql from "mysql2/promise";
import { buildMysqlPoolOptions } from "@tapizlabs/app-kit/db";

const options = buildMysqlPoolOptions(process.env);
export const pool = mysql.createPool(options);

const [rows] = await pool.query("SELECT 1 AS ok");
console.log(rows);
