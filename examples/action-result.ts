/**
 * @tapizlabs/app-kit — ActionResult
 *
 * A tiny framework-agnostic result type for server actions: never throw across
 * the action boundary, return ok()/fail() and narrow with isOk().
 * Run: `npx tsx examples/action-result.ts`
 */
import { ok, fail, isOk, type ActionResult } from "@tapizlabs/app-kit";

async function createTeam(name: string): Promise<ActionResult<{ id: string }>> {
  if (!name.trim()) return fail("Name is required", "VALIDATION");
  return ok({ id: "team_42" });
}

const res = await createTeam("Platform");
if (isOk(res)) {
  console.log("created:", res.data.id);
} else {
  console.log(`failed [${res.code}]:`, res.error);
}
