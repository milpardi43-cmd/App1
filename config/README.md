# Public app connection

`supabase.public.json` contains only the user-supplied public Supabase URL and
anon key. These values are already shipped to every client; database RLS and
Supabase Auth still enforce access. Never add a service_role or secret key.

The Expo npm scripts load `.env` first and use these persistent defaults only
when the corresponding variables are absent. Production environment values take
precedence. Build with `npm run build:web`; it checks the connection settings and
clears Metro's export cache so a previous disconnected bundle is not reused.
No database migration or Supabase dashboard change is required by this repair.
