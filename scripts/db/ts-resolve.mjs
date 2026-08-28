/**
 * Lets the seed script import the app's TypeScript data files directly.
 *
 * Node strips types on its own but will not guess a `.ts` extension for
 * extensionless relative imports like `./photos`, so this hook retries with it.
 *
 * Usage: node --import ./scripts/db/register-ts.mjs scripts/db/seed.mjs
 */

export async function resolve(specifier, context, next) {
  try {
    return await next(specifier, context);
  } catch (error) {
    if (error?.code === "ERR_MODULE_NOT_FOUND" && /^[./]/.test(specifier)) {
      return next(`${specifier}.ts`, context);
    }
    throw error;
  }
}
