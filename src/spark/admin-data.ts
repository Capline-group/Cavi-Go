import {collection,doc,runTransaction,serverTimestamp,type Firestore,type Transaction} from 'firebase/firestore';
import type {User} from 'firebase/auth';
import {textValue} from './domain.mjs';
import type {Data} from './client';
const editable=['users','providerApplications','jobPosts','complaints','settings','cities','categories','tariffs','organizations'];
export function auditMutation(tx:Transaction,db:Firestore,user:User,path:string,old:Data|undefined,patch:Data,reason:string){
 const ref=doc(db,path),log=doc(collection(db,'auditLogs')),version=(old?.version||0)+1;
 tx.set(ref,{...old,...patch,version,lastEventId:log.id,updatedAt:serverTimestamp(),createdAt:old?.createdAt||serverTimestamp()});
 const [targetCollection,targetId]=path.split('/');
 tx.set(log,{actorId:user.uid,action:patch.status||('blocked'in patch?(patch.blocked?'block':'unblock'):'update'),targetPath:path,targetCollection,targetId,reason:textValue(reason,500),version,createdAt:serverTimestamp()});
}
export async function adminMutation(db:Firestore,user:User,path:string,patch:Data,reason:string,expectedVersion?:number){
 if(!editable.includes(path.split('/')[0])||path.split('/').length!==2)throw Error('invalid-argument');
 await runTransaction(db,async tx=>{const old=await tx.get(doc(db,path));if(expectedVersion!==undefined&&(old.data()?.version||0)!==expectedVersion)throw Error('record-changed');auditMutation(tx,db,user,path,old.exists()?old.data():undefined,patch,reason)});
}
export async function moderateProvider(db:Firestore,user:User,id:string,status:string,reason:string,expectedVersion?:number){
 if(!['approved','rejected','suspended'].includes(status))throw Error('invalid-argument');
 await runTransaction(db,async tx=>{
  const appRef=doc(db,'providerApplications',id),app=await tx.get(appRef);if(!app.exists())throw Error('not-found');const a=app.data();if(expectedVersion!==undefined&&a.version!==expectedVersion)throw Error('record-changed');
  const name=a.role==='driver'?'driverProfiles':'technicianProfiles',profileRef=doc(db,name,a.ownerId),profile=await tx.get(profileRef);
  if(status==='approved'&&!/^\+992\d{9}$/.test(a.phone||''))throw Error('provider-phone-required');
  auditMutation(tx,db,user,appRef.path,a,{status,reason},reason);
  const p:Data={ownerId:a.ownerId,name:a.name,city:a.city||'Dushanbe',cityId:'dushanbe',category:a.category||'economy',status};
  if(a.role==='driver'){p.vehicle=a.vehicle;p.phone=a.phone;}else{p.skills=a.skills;p.description=a.skills;}
  // Technician contact is private; drivers have no public list.
  auditMutation(tx,db,user,profileRef.path,profile.exists()?profile.data():undefined,p,reason);
 });
}
