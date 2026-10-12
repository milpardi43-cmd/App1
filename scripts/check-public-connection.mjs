// Fail closed before publishing a disconnected build. Expo loads .env after
// npm prebuild hooks, so load it here too without printing any key.
import './load-public-connection.mjs';
const url=(process.env.EXPO_PUBLIC_SUPABASE_URL||'').trim();
const key=(process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY||'').trim();
let valid=false;
try { valid=new URL(url).protocol==='https:'&&!/placeholder|your-project|example\.com/.test(url)&&!!key&&!/placeholder|your-anon-key/.test(key); } catch {}
if(!valid){
 console.error('Web export stopped: public Supabase connection settings are missing. Restore the existing project URL and publishable/anon key; do not rerun database setup. No output has been replaced.');
 process.exit(1);
}
console.log('Public Supabase connection settings present (live connectivity not tested).');
