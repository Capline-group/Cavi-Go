import {collection,doc,getDoc,runTransaction,serverTimestamp,type Firestore,type Transaction} from 'firebase/firestore';
import type {User} from 'firebase/auth';
import {textValue,phoneValue,pointValue,nextStatus,quoteValue} from './domain.mjs';
export type Data=Record<string,any>;
export function requireUser(user:User|null):User {if(!user)throw Error('unauthenticated');return user;}
export async function syncUser(db:Firestore,user:User) {
 const ref=doc(db,'users',user.uid);
 await runTransaction(db,async tx=>{const old=await tx.get(ref);if(!old.exists())tx.set(ref,{name:(user.displayName||'').slice(0,80),email:user.email||'',city:'dushanbe',blocked:false,blockedReason:'',version:1,createdAt:serverTimestamp(),updatedAt:serverTimestamp()});});
}
export async function adminAccess(db:Firestore,user:User) {
 const token=await user.getIdTokenResult();
 if(token.claims.admin===true)return true;
 const role=await getDoc(doc(db,'adminRoles',user.uid));
 return role.exists()&&role.data().enabled===true&&role.data().role==='admin';
}
function event(tx:Transaction,db:Firestore,uid:string,orderId:string,action:string,version:number,reason='') {
 const ref=doc(collection(db,'serviceOrders',orderId,'events'));
 tx.set(ref,{actorId:uid,action,version,reason:reason.slice(0,500),createdAt:serverTimestamp()});return ref.id;
}
export async function createOrder(db:Firestore,user:User,data:Data,id=doc(collection(db,'serviceOrders')).id) {
 const customerId=user.uid,serviceType=textValue(data.serviceType,20);
 if(!['taxi','master','delivery'].includes(serviceType))throw Error('invalid-argument');
 const pickup=pointValue(data.pickup),destination=data.destination?pointValue(data.destination):null;
 if(serviceType!=='master'&&!destination)throw Error('destination-required');
 const orderRef=doc(db,'serviceOrders',id),lock=doc(db,'activeCustomers',customerId);
 await runTransaction(db,async tx=>{
  const [existing,current,settings]=await Promise.all([tx.get(orderRef),tx.get(lock),tx.get(doc(db,'settings','platform'))]);
  if(existing.exists())return;
  if(current.data()?.orderId)throw Error('active-order-exists');
  if(!settings.exists()||settings.data().ordersEnabled!==true||settings.data().services?.[serviceType]!==true)throw Error('service-paused');
  const timestamp=serverTimestamp(),lastEventId=event(tx,db,customerId,id,'requested',1);
  tx.set(orderRef,{customerId,customerName:textValue(user.displayName||data.customerName,80),customerPhone:phoneValue(data.phone),providerId:null,providerName:'',providerPhone:'',serviceType,category:textValue(data.category||'economy',40),cityId:'dushanbe',pickup,destination,notes:String(data.notes||'').trim().slice(0,1000),paymentMethod:data.paymentMethod==='direct_transfer'?'direct_transfer':'cash',status:'requested',quoteMinor:null,quoteAccepted:false,pickupConfirmed:false,paymentReported:false,paymentConfirmed:false,currency:'TJS',version:1,lastEventId,createdAt:timestamp,updatedAt:timestamp});
  tx.set(doc(db,'orderOffers',id),{orderId:id,customerId,providerId:null,serviceType,category:textValue(data.category||'economy',40),cityId:'dushanbe',pickupZone:pickup.lat.toFixed(2)+', '+pickup.lon.toFixed(2),destinationZone:destination?destination.lat.toFixed(2)+', '+destination.lon.toFixed(2):'',status:'requested',createdAt:timestamp,updatedAt:timestamp});
  tx.set(lock,{orderId:id,lastCreatedAt:timestamp,updatedAt:timestamp});
 });return {id,status:'requested'};
}
export async function acceptOrder(db:Firestore,user:User,id:string) {
 const offerRef=doc(db,'orderOffers',id),lock=doc(db,'activeProviders',user.uid);
 await runTransaction(db,async tx=>{
  const [offer,active]=await Promise.all([tx.get(offerRef),tx.get(lock)]);
  if(!offer.exists()||offer.data().status!=='requested')throw Error('order-taken');
  if(active.data()?.orderId)throw Error('active-order-exists');
  const d=offer.data(),profile=await tx.get(doc(db,d.serviceType==='master'?'technicianProfiles':'driverProfiles',user.uid));
  if(!profile.exists()||profile.data().status!=='approved'||d.customerId===user.uid)throw Error('permission-denied');
  const application=d.serviceType==='master'?await tx.get(doc(db,'providerApplications',user.uid+'_technician')):null;
  const contact=d.serviceType==='master'?application?.data()?.phone:profile.data().phone;
  const lastEventId=event(tx,db,user.uid,id,'accepted',2),timestamp=serverTimestamp();
  tx.update(doc(db,'serviceOrders',id),{providerId:user.uid,providerName:profile.data().name,providerPhone:phoneValue(contact),status:'accepted',version:2,lastEventId,updatedAt:timestamp});
  tx.update(offerRef,{providerId:user.uid,status:'accepted',updatedAt:timestamp});
  tx.set(lock,{orderId:id,updatedAt:timestamp});
 });return {id,status:'accepted'};
}
export async function updateOrder(db:Firestore,user:User,id:string,kind:string,data:Data={}) {
 const ref=doc(db,'serviceOrders',id);
 await runTransaction(db,async tx=>{
  const snapshot=await tx.get(ref);if(!snapshot.exists())throw Error('not-found');const o=snapshot.data(),v=o.version+1;
  const customer=user.uid===o.customerId,provider=user.uid===o.providerId;let patch:Data={},reason='';
  if(kind==='status'){patch.status=nextStatus(o,user.uid,String(data.status));if(patch.status==='cancelled')reason=textValue(data.reason,500);}
  else if(kind==='quote'){if(!provider||!['accepted','arriving','arrived'].includes(o.status)||o.quoteAccepted)throw Error('permission-denied');patch.quoteMinor=quoteValue(data.quoteMinor);}
  else if(kind==='acceptQuote'){if(!customer||!['accepted','arriving','arrived'].includes(o.status)||!o.quoteMinor)throw Error('permission-denied');if(data.quoteMinor!==o.quoteMinor)throw Error('price-changed');patch.quoteAccepted=true;}
  else if(kind==='confirmPickup'){if(!customer||o.status!=='arrived'||!o.quoteAccepted)throw Error('permission-denied');patch.pickupConfirmed=true;}
  else if(kind==='reportPayment'){if(!customer||o.status!=='completed')throw Error('permission-denied');patch.paymentReported=true;}
  else if(kind==='confirmPayment'){if(!provider||o.status!=='completed'||!o.paymentReported)throw Error('permission-denied');patch.paymentConfirmed=true;}
  else throw Error('unimplemented');
  const ending=['completed','cancelled'].includes(patch.status),customerLock=ending?await tx.get(doc(db,'activeCustomers',o.customerId)):null;
  const lastEventId=event(tx,db,user.uid,id,kind==='status'?patch.status:kind,v,reason);
  tx.update(ref,{...patch,version:v,lastEventId,updatedAt:serverTimestamp()});
  if(ending){
   tx.update(doc(db,'orderOffers',id),{status:patch.status,updatedAt:serverTimestamp()});
   tx.set(doc(db,'activeCustomers',o.customerId),{orderId:null,lastCreatedAt:customerLock!.data()!.lastCreatedAt,updatedAt:serverTimestamp()});
   if(o.providerId)tx.set(doc(db,'activeProviders',o.providerId),{orderId:null,updatedAt:serverTimestamp()});
  }
 });return {ok:true};
}
export async function customerAction(db:Firestore,user:User,data:Data) {
 await syncUser(db,user);const uid=user.uid,now=serverTimestamp();
 if(data.kind==='createOrder')return createOrder(db,user,data);
 if(data.kind==='acceptOrder')return acceptOrder(db,user,textValue(data.orderId));
 if(data.kind==='updateOrder')return updateOrder(db,user,textValue(data.orderId),textValue(data.operation),data);
 if(data.kind==='reportOrder'){
  const orderId=textValue(data.orderId),ref=doc(db,'complaints',orderId+'_'+uid);
  await runTransaction(db,async tx=>{const old=await tx.get(ref);if(old.exists())return;tx.set(ref,{ownerId:uid,orderId,subject:textValue(data.subject,80),description:textValue(data.description,2000),status:'open',resolution:'',version:1,createdAt:now,updatedAt:now})});return {id:ref.id};
 }
 if(data.kind==='createJob'){
  const ref=doc(collection(db,'jobPosts'));
  await runTransaction(db,async tx=>tx.set(ref,{ownerId:uid,title:textValue(data.title),company:textValue(data.company),description:textValue(data.description,4000),city:'Dushanbe',category:'other',status:'pending_review',createdAt:now,updatedAt:now,version:1}));return {id:ref.id,status:'pending_review'};
 }
 if(data.kind==='applyJob'){
  const id=textValue(data.jobId),ref=doc(db,'jobApplications',id+'_'+uid);
  await runTransaction(db,async tx=>{const[job,old]=await Promise.all([tx.get(doc(db,'jobPosts',id)),tx.get(ref)]);if(old.exists())return;if(!job.exists()||job.data().status!=='published'||job.data().ownerId===uid)throw Error('permission-denied');tx.set(ref,{jobId:id,candidateId:uid,employerId:job.data().ownerId,status:'submitted',createdAt:now,updatedAt:now,version:1})});return {id:ref.id};
 }
 if(data.kind==='providerApplication'){
  if(!['driver','technician'].includes(data.role))throw Error('invalid-argument');const ref=doc(db,'providerApplications',uid+'_'+data.role);
  await runTransaction(db,async tx=>{const old=await tx.get(ref);if(old.exists()&&old.data().status!=='rejected')throw Error('already-exists');tx.set(ref,{ownerId:uid,role:data.role,name:textValue(data.name,80),phone:phoneValue(data.phone),vehicle:data.role==='driver'?textValue(data.vehicle,80):'',plate:data.role==='driver'?textValue(data.plate,20):'',skills:data.role==='technician'?textValue(data.skills,120):'',category:textValue(data.category||(data.role==='driver'?'economy':'repair'),40),city:'Dushanbe',status:'pending',reason:'',version:(old.data()?.version||0)+1,createdAt:old.data()?.createdAt||now,updatedAt:now})});return {id:ref.id,status:'pending'};
 }
 throw Error('unimplemented');
}
