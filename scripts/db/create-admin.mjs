/**
 * Creates — or resets the password of — an administrator who can sign in at
 * /admin.
 *
 *   node scripts/db/create-admin.mjs you@example.com               # generates a password
 *   node scripts/db/create-admin.mjs you@example.com "your-password"
 *
 * Works over DATABASE_URL, so no service role key is needed. The account is
 * written to Supabase Auth with a bcrypt password hash and then registered in
 * public.admins, which is what actually grants write access.
 *
 * Re-running for an existing email resets that account's password instead of
 * failing, which is the recovery path if the password is ever lost.
 */

import { randomBytes } from "node:crypto";
import { connect } from "./env.mjs";

const [emailArg, passwordArg] = process.argv.slice(2);

if (!emailArg) {
  console.error("Usage: node scripts/db/create-admin.mjs <email> [password]");
  process.exit(1);
}

const email = emailArg.trim().toLowerCase();
if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
  console.error(`"${emailArg}" is not an email address.`);
  process.exit(1);
}

/** Readable but strong: 22 characters of base64url from the system CSPRNG. */
function generatePassword() {
  return randomBytes(16).toString("base64url");
}

const password = passwordArg ?? generatePassword();
const generated = passwordArg === undefined;

if (password.length < 10) {
  console.error("Choose a password of at least 10 characters.");
  process.exit(1);
}

const sql = connect();

try {
  // pgcrypto lives in the `extensions` schema on Supabase and in `public`
  // elsewhere. Put whichever one this database has on the search path so
  // crypt() and gen_salt() resolve.
  const [ext] = await sql`
    select n.nspname as schema
    from pg_extension e
    join pg_namespace n on n.oid = e.extnamespace
    where e.extname = 'pgcrypto'
  `;
  if (!ext) throw new Error("pgcrypto is not installed — run npm run db:migrate first");
  if (!/^[a-z_][a-z0-9_]*$/i.test(ext.schema)) {
    throw new Error(`unexpected pgcrypto schema name: ${ext.schema}`);
  }
  await sql.unsafe(`set search_path to public, auth, "${ext.schema}"`);

  const created = await sql.begin(async (tx) => {
    const [existing] = await tx`select id from auth.users where email = ${email}`;

    if (existing) {
      await tx`
        update auth.users set
          encrypted_password = crypt(${password}, gen_salt('bf')),
          email_confirmed_at = coalesce(email_confirmed_at, now()),
          banned_until = null,
          deleted_at = null,
          updated_at = now()
        where id = ${existing.id}
      `;
      await tx`
        insert into public.admins (user_id, email)
        values (${existing.id}, ${email})
        on conflict (user_id) do update set email = excluded.email
      `;
      return false;
    }

    const [user] = await tx`
      insert into auth.users (
        instance_id, id, aud, role, email, encrypted_password, email_confirmed_at,
        raw_app_meta_data, raw_user_meta_data, created_at, updated_at,
        confirmation_token, recovery_token, email_change_token_new, email_change,
        email_change_token_current, reauthentication_token
      ) values (
        '00000000-0000-0000-0000-000000000000', gen_random_uuid(), 'authenticated',
        'authenticated', ${email}, crypt(${password}, gen_salt('bf')), now(),
        '{"provider":"email","providers":["email"]}'::jsonb, '{}'::jsonb, now(), now(),
        '', '', '', '', '', ''
      )
      returning id
    `;

    // Supabase pairs every password account with an `email` identity row.
    await tx`
      insert into auth.identities (provider_id, user_id, identity_data, provider,
                                   last_sign_in_at, created_at, updated_at)
      values (
        ${user.id}::text, ${user.id},
        jsonb_build_object('sub', ${user.id}::text, 'email', ${email}::text, 'email_verified', true),
        'email', now(), now(), now()
      )
    `;

    await tx`insert into public.admins (user_id, email) values (${user.id}, ${email})`;
    return true;
  });

  console.log(created ? "Administrator created." : "Administrator password reset.");
  console.log("");
  console.log(`  Sign in at   /admin/login`);
  console.log(`  Email        ${email}`);
  console.log(`  Password     ${generated ? password : "(the one you passed in)"}`);
  console.log("");
  if (generated) {
    console.log("Save that password now — it is not stored anywhere in readable form.");
  }
} catch (error) {
  console.error("Could not create the administrator:", error.message);
  process.exitCode = 1;
} finally {
  await sql.end();
}
