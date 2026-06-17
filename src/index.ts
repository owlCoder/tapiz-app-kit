// @tapizlabs/app-kit — framework-agnostic app infra shared across Tapiz products.
// Root export is zero-dependency pure TS. Node-only DB helpers live under
// `@tapizlabs/app-kit/db` so agnostic consumers don't pull mysql2.

/**
 * Result of a server action / use case. `code` is optional for callers that map
 * machine-readable error codes to UI (e.g. FREE_LIMIT_REACHED, PROFILE_MANAGED_BY_LMS);
 * callers that don't need it simply ignore it.
 */
export type ActionResult<T = void> =
  | { ok: true; data: T }
  | { ok: false; error: string; code?: string };

export function ok<T>(data: T): ActionResult<T> {
  return { ok: true, data };
}

export function fail<T = void>(error: string, code?: string): ActionResult<T> {
  return code === undefined ? { ok: false, error } : { ok: false, error, code };
}

export function isOk<T>(r: ActionResult<T>): r is { ok: true; data: T } {
  return r.ok;
}
