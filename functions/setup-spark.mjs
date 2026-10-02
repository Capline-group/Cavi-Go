// Run locally with the project's owner's Application Default Credentials.
// No private credentials belong in this repository or in the browser.
import {initializeApp,applicationDefault} from 'firebase-admin/app';
import {getAuth} from 'firebase-admin/auth';
import {getFirestore,FieldValue} from 'firebase-admin/firestore';
const projectId='cavi-go',ownerEmail='caplinegroup.tj@gmail.com';
if(process.env.GOOGLE_CLOUD_PROJECT!==projectId)throw Error('Set GOOGLE_CLOUD_PROJECT=cavi-go. No other project is supported.');
if(process.env.FIRESTORE_EMULATOR_HOST||process.env.FIREBASE_AUTH_EMULATOR_HOST)throw Error('Owner setup is for cavi-go production only; emulator settings must be absent.');
initializeApp({credential:applicationDefault(),projectId});
const owner=await getAuth().getUserByEmail(ownerEmail);
if(owner.disabled||!owner.emailVerified||owner.email?.toLowerCase()!==ownerEmail)throw Error('Create and verify the owner’s Firebase Auth account first.');
if(process.argv[2]!==owner.uid)throw Error('Supply the owner UID as the first argument; it must match caplinegroup.tj@gmail.com.');
const db=getFirestore(),now=FieldValue.serverTimestamp();
const seeds={
 'settings/platform':{ordersEnabled:false,services:{taxi:false,master:false,delivery:false},cityId:'dushanbe',supportEmail:ownerEmail,supportPhone:'',notice:''},
 'cities/dushanbe':{name:'Dushanbe',active:true,timezone:'Asia/Dushanbe'},
};
for(const [service,values] of Object.entries({taxi:['economy','comfort','business','minivan'],master:['repair','finishing','electrical','plumbing','climate'],delivery:['parcel']})){
 for(const name of values)seeds['categories/'+service+'_'+name]={name,serviceType:service,active:true};
}
const refs=Object.keys(seeds).map(path=>db.doc(path)),roleRef=db.doc('adminRoles/'+owner.uid);
if(!process.argv.includes('--apply')){
 console.log(JSON.stringify({projectId,ownerEmail,ownerUid:owner.uid,mode:'review',role:'admin',missingDefaultsOnly:Object.keys(seeds),ordersEnabled:false},null,2));
 console.log('Reviewed setup only. Add --apply to grant the owner role and create missing defaults. Existing settings and data are retained.');
}else{
 await db.runTransaction(async tx=>{
  const snapshots=await tx.getAll(roleRef,...refs),audit=db.collection('auditLogs').doc();
  tx.set(roleRef,{role:'admin',enabled:true,ownerEmail,createdAt:snapshots[0].data()?.createdAt||now,updatedAt:now});
  snapshots.slice(1).forEach((snap,i)=>{if(!snap.exists)tx.set(refs[i],{...seeds[refs[i].path],createdAt:now,updatedAt:now,version:1,lastEventId:audit.id})});
  tx.set(audit,{actorId:owner.uid,action:'ownerSparkSetup',targetPath:roleRef.path,targetCollection:'adminRoles',targetId:owner.uid,reason:'Owner-authorized Spark setup; no billing change',version:1,createdAt:now});
 });
 console.log('Owner admin role and missing defaults saved. Open /admin and configure services before enabling new orders.');
}
