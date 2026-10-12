// Public client connection settings only: never put secret/service_role keys here.
// Keep a persistent source because .env may be absent in a restored workspace.
import fs from 'node:fs';
import { load } from '@expo/env';
process.env.NODE_ENV ||= 'production';
load(process.cwd());
const file=new URL('../config/supabase.public.json',import.meta.url);
if(fs.existsSync(file)){
 const saved=JSON.parse(fs.readFileSync(file,'utf8'));
 for(const name of ['EXPO_PUBLIC_SUPABASE_URL','EXPO_PUBLIC_SUPABASE_ANON_KEY']){
  if(process.env[name]===undefined&&typeof saved[name]==='string')process.env[name]=saved[name];
 }
}
const key=process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY||'';
if(key.startsWith('sb_secret_'))throw Error('Secret keys must never be bundled in the app.');
if(key.startsWith('eyJ')){
 let payload;try{payload=JSON.parse(Buffer.from(key.split('.')[1],'base64url').toString());}catch{throw Error('Invalid public Supabase key format.');}
 if(payload.role!=='anon')throw Error('Only a public anon key may be bundled in the app.');
}
