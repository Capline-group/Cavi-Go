import {initializeApp} from 'firebase/app';
import {getAuth} from 'firebase/auth';
import {getFirestore} from 'firebase/firestore';
import {getFunctions,httpsCallable} from 'firebase/functions';
import {firebaseConfig} from './config';
const app=initializeApp(firebaseConfig);export const auth=getAuth(app);export const db=getFirestore(app);const functions=getFunctions(app,'europe-west1');
export async function action(data:Record<string,unknown>){return (await httpsCallable(functions,'action')(data)).data as Record<string,unknown>;}
