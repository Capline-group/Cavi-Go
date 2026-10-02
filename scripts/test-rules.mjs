import {spawn} from 'node:child_process';
import {mkdir} from 'node:fs/promises';
import {build} from 'esbuild';
await mkdir('tests/generated',{recursive:true});
await build({entryPoints:['src/spark/client.ts','src/spark/admin-data.ts'],outdir:'tests/generated',outExtension:{'.js':'.mjs'},bundle:true,platform:'node',format:'esm',external:['firebase/*']});
// Local verification only. This tested CLI supports the available Java 17 runtime.
// Production deploy uses the current Firebase CLI with its required Java runtime.
const version=process.env.CAVI_TEST_FIREBASE_CLI_VERSION||'13.35.1';
if(!/^\d+\.\d+\.\d+$/.test(version))throw Error('CLI version must be an exact numeric semver.');
const child=spawn('npx',['--yes','firebase-tools@'+version,'emulators:exec','--only','firestore','--config','firebase.spark.json','--project','demo-cavi-go','node --test tests/spark-rules.emulator.mjs'],{stdio:'inherit'});
child.on('error',error=>{console.error(error.message);process.exitCode=1});
child.on('exit',code=>{process.exitCode=code??1});
