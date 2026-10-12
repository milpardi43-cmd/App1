// deterministic stand-in for ./supabase: local-only, no network
const rows = { records: [] };
export const supabase = {
  auth: {
    async getSession() { return { data: { session: { user: { id: 'test-user' } } }, error: null }; },
    async signInAnonymously() { return { data: { user: { id: 'test-user' } }, error: null }; },
  },
  from(table) {
    const q = {
      _table: table,
      upsert() { return Promise.resolve({ error: null }); },
      delete() { return q; },
      eq() { return q; },
      in() { return q; },
      insert(payload) { rows[table] = (rows[table] || []).concat(payload); return Promise.resolve({ error: null }); },
      select() { return q; },
      update() { return q; },
      order() { return q; },
      maybeSingle() { return Promise.resolve({ data: null, error: null }); },
      then(res) { return Promise.resolve({ data: [], error: null }).then(res); },
    };
    return q;
  },
  async rpc() { return { data: null, error: { message: 'rpc disabled in tests' } }; },
};
export function isSupabaseConfigured() { return false; }
