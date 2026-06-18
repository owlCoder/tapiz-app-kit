# @tapizlabs/app-kit

Framework-agnostic application infrastructure shared across Tapiz spoke products.

"How a spoke technically works" — the plumbing every product duplicates, with no tie
to identity (`@tapizlabs/identity`) or design (`@tapizlabs/ui`).

## Exports

### `@tapizlabs/app-kit` (zero-dependency)

The `ActionResult` discriminated union for server actions / use cases.

```ts
import { ok, fail, isOk, type ActionResult } from "@tapizlabs/app-kit";

function load(): ActionResult<User> {
  if (!user) return fail("Not found", "NOT_FOUND");
  return ok(user);
}
```

`code?` is optional — for callers that map machine-readable error codes to UI
(`FREE_LIMIT_REACHED`, `PROFILE_MANAGED_BY_LMS`, …).

### `@tapizlabs/app-kit/db` (Node only)

`buildMysqlPoolOptions(env)` — serverless-safe MySQL pool options for an Aiven-hosted
spoke DB. Returns a plain options object with **zero runtime dependency**; the consumer
passes it to its own `mysql2.createPool(...)`.

```ts
import mysql from "mysql2/promise";
import { buildMysqlPoolOptions } from "@tapizlabs/app-kit/db";

const pool = mysql.createPool(buildMysqlPoolOptions(process.env));
```

- Defaults `connectionLimit` to **1** (Vercel serverless + Aiven free tier: each warm
  lambda holds its own pool, so N×limit easily exceeds `max_connections`). Override via
  `DATABASE_POOL_LIMIT`.
- When `DATABASE_SSL_CA_BASE64` is set, enables strict TLS with the decoded Aiven CA.

## Three-package discipline

`@tapizlabs/ui` (design) · `@tapizlabs/identity` (who-you-are / what-you-may) ·
`@tapizlabs/app-kit` (how the spoke runs) + `@tapizlabs/sdk` (LMS API client).
**Do not add a 4th** — anything else risks becoming a junk drawer.

## Install

```bash
npm install @tapizlabs/app-kit
```

ESM only. The root entry is zero-dependency; `/db` is Node-only and expects the
consumer to provide `mysql2`.
