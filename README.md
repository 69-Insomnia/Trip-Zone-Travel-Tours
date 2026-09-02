# Trip Zone Travel & Tours

Trip Zone Travel & Tours is a Nepal travel website for exploring destinations,
tour packages, travel services, photo galleries, and practical trip guides.

## Development

Install Node.js, then install dependencies and start the development server:

```sh
git clone https://github.com/69-Insomnia/Trip-Zone-Travel-Tours.git
cd Trip-Zone-Travel-Tours
npm install
npm run dev
```

Create a production build with `npm run build`.

## Content database

All site content — tours, prices, itineraries, destinations, films, photos,
gallery, blogs, FAQs, testimonials and the contact details in the header and
footer — is stored in Supabase. Editing a row changes every page that shows it.
Contact form submissions are stored in the `inquiries` table.

Copy `.env.example` to `.env` and fill in the three values:

| Variable                        | Used by                                     |
| ------------------------------- | ------------------------------------------- |
| `VITE_SUPABASE_URL`             | the website, at build time and in browsers  |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | the website (safe to expose; RLS protected) |
| `DATABASE_URL`                  | migrations and seeding only, never shipped  |

`.env` is gitignored. The two `VITE_` values are inlined during `npm run build`,
so they must also be set in the hosting environment that runs the build.

Take `DATABASE_URL` from Supabase's **Session pooler** string
(`postgres.<project-ref>@aws-0-<region>.pooler.supabase.com:5432`), not the
direct `db.<project-ref>.supabase.co` one. The direct host publishes an AAAA
record and no A record, so it is unreachable from any network without IPv6 and
the scripts fail with `ENOTFOUND` before they ever reach Postgres.

The database password cannot be changed over SQL — Supabase revokes `alter role`
from `postgres`, so it is reset from the dashboard under Project Settings →
Database → Reset database password. Afterwards replace the password inside
`DATABASE_URL`; the rest of the string is unchanged.

Database commands:

```sh
npm run db:migrate   # create tables, row level security policies and triggers
npm run db:seed      # load the content snapshot in src/data into the database
npm run db:sync-faqs # add FAQs written in src/data that the database lacks
```

Seeding overwrites database rows with the files in `src/data`, so run it once on
a fresh project. After that the database is the source of truth; those files
remain as the offline fallback used when Supabase cannot be reached, which keeps
pages rendering instead of failing.

Because seeding deletes before it inserts, it destroys anything written in
`/admin`. To publish new FAQs added to `src/data/tours.ts` on a project already
in use, run `npm run db:sync-faqs` instead — it only inserts questions the
database does not have, and leaves edited answers alone. Pass `--dry-run` first
to see what it would add.

Row level security lets anonymous visitors read published content and insert an
inquiry, nothing more. `node scripts/db/verify-inquiry.mjs` checks that: it
submits an inquiry, confirms inquiries cannot be read back, and cleans up.

## Admin area

`/admin` is a password-protected editor for everything in the database: tours
(including prices and day-by-day itineraries), destinations, blog posts, the
gallery, films and page photographs, FAQs, testimonials, the company details in
the header and footer, and an inbox of contact form inquiries. A save is live on
the website immediately. Unpublished rows are visible in `/admin` only.

Films and photographs are uploaded from the computer you are editing on: choose
or drop a file in the editor and it goes into the public `media` bucket in
Supabase Storage, with the record keeping the URL of the stored file. There is no
box for pasting a link or a path — every new film and photograph comes off a
device, and the files that shipped in `public/` keep working until they are
replaced. `npm run db:migrate` creates the bucket — reading it is public,
uploading needs an account listed in `admins`. One upload is capped at 512 MB by
the bucket and, on the Supabase free plan, at 50 MB by the project; raise the
project cap under Storage → Settings if a film is bigger.

Create an administrator, or reset a forgotten password:

```sh
npm run db:admin -- you@example.com              # prints a generated password
npm run db:admin -- you@example.com 'a password' # or choose your own
```

Being a Supabase Auth user is not enough on its own — write access comes from
being listed in the `admins` table, which the command above does. Someone who
signs up on their own can do no more than an anonymous visitor. Turn signups off
under Authentication → Sign In / Providers in the Supabase dashboard anyway.

`node scripts/db/verify-admin.mjs <email> <password>` checks the whole chain:
that anonymous writes are refused, that the account signs in, that it can edit
content and read the inbox, and that signing out revokes all of it.

The admin pages sign in through a browser-only Supabase client that keeps its
session in local storage; the client the website itself uses never persists a
session, so nothing leaks between visitors during server rendering. `/admin` is
marked `noindex, nofollow` and renders without the public header and footer.

## Built with

- TanStack Start
- TypeScript
- React
- Tailwind CSS
