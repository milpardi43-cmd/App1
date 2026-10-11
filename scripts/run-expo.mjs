// Load public connection defaults into the actual Expo child process.
if(process.argv[2]==='start')process.env.NODE_ENV ||= 'development';
await import('./load-public-connection.mjs');
const {spawn}=await import('node:child_process');
const child=spawn(process.execPath,['node_modules/expo/bin/cli',...process.argv.slice(2)],{stdio:'inherit',env:process.env});
for(const signal of ['SIGINT','SIGTERM'])process.on(signal,()=>child.kill(signal));
child.on('error',()=>{console.error('Expo could not start.');process.exitCode=1;});
child.on('exit',(code)=>{process.exitCode=code??1;});
