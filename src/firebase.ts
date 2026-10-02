import {initializeApp} from 'firebase/app';
import {getAuth,connectAuthEmulator,onAuthStateChanged} from 'firebase/auth';
import {getFirestore,connectFirestoreEmulator} from 'firebase/firestore';
import {initializeAppCheck,ReCaptchaEnterpriseProvider} from 'firebase/app-check';
import {firebaseConfig} from './config';
import {customerAction,requireUser,syncUser} from './spark/client';
const local=['localhost','127.0.0.1','[::1]'].includes(location.hostname);
const emulate=local&&import.meta.env.VITE_USE_EMULATORS==='true';
const app=initializeApp(emulate?{...firebaseConfig,projectId:'demo-cavi-go',apiKey:'demo-key',authDomain:'demo-cavi-go.firebaseapp.com'}:firebaseConfig);
export const auth=getAuth(app);export const db=getFirestore(app);
if(emulate){connectAuthEmulator(auth,'http://127.0.0.1:9099',{disableWarnings:true});connectFirestoreEmulator(db,'127.0.0.1',8080);}
if(!emulate&&import.meta.env.VITE_APPCHECK_SITE_KEY)initializeAppCheck(app,{provider:new ReCaptchaEnterpriseProvider(import.meta.env.VITE_APPCHECK_SITE_KEY),isTokenAutoRefreshEnabled:true});
onAuthStateChanged(auth,user=>{if(user)syncUser(db,user).catch(()=>{/* UI surfaces connection errors on requested reads/writes. */});});
// Spark uses guarded Firestore transactions. No Cloud Functions deployment or billing required.
export async function action(data:Record<string,unknown>){return customerAction(db,requireUser(auth.currentUser),data);}
