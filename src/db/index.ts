// MySQL/Aiven pool configuration shared by Tapiz spoke products.
// Returns a plain options object — the consumer passes it to its own
// `mysql2.createPool(...)`, so this module has ZERO runtime dependencies and
// stays decoupled from any specific mysql2 version.

export type MysqlPoolEnv = Record<string, string | undefined> & {
  /** Connection URI (mysql://...). */
  DATABASE_URL?: string;
  /** Base64-encoded Aiven CA cert — when present, enables strict TLS. */
  DATABASE_SSL_CA_BASE64?: string;
  /** Pool size override; defaults to 1 (Vercel serverless + Aiven free tier). */
  DATABASE_POOL_LIMIT?: string;
};

export interface MysqlPoolOptions {
  uri: string;
  connectionLimit: number;
  maxIdle: number;
  idleTimeout: number;
  enableKeepAlive: boolean;
  waitForConnections: boolean;
  queueLimit: number;
  ssl?: { ca: string; rejectUnauthorized: boolean };
}

/**
 * Build serverless-safe MySQL pool options for an Aiven-hosted spoke DB.
 *
 * Defaults `connectionLimit` to 1: on Vercel each warm lambda holds its own
 * pool, so N×limit easily exceeds Aiven's small max_connections. Override via
 * DATABASE_POOL_LIMIT only on a stronger plan / with a connection pooler.
 *
 * When DATABASE_SSL_CA_BASE64 is set, enables TLS with strict server verification
 * (mysql2 does not understand Aiven's `ssl-mode=REQUIRED` URI param, so the CA is
 * passed explicitly here).
 */
export function buildMysqlPoolOptions(env: MysqlPoolEnv): MysqlPoolOptions {
  const uri = env.DATABASE_URL;
  if (!uri) throw new Error("DATABASE_URL nije podešen");

  const configured = Number(env.DATABASE_POOL_LIMIT ?? "1");
  const connectionLimit =
    Number.isFinite(configured) && configured > 0 ? Math.floor(configured) : 1;

  const caBase64 = env.DATABASE_SSL_CA_BASE64;

  return {
    uri,
    connectionLimit,
    maxIdle: 1,
    idleTimeout: 30_000,
    enableKeepAlive: true,
    waitForConnections: true,
    queueLimit: 0,
    ...(caBase64
      ? { ssl: { ca: Buffer.from(caBase64, "base64").toString("utf8"), rejectUnauthorized: true } }
      : {}),
  };
}
