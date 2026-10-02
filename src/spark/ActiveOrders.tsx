import {useEffect,useState} from 'react';
import {onAuthStateChanged} from 'firebase/auth';
import {doc,onSnapshot} from 'firebase/firestore';
import {auth,db} from '../firebase';
import type {Lang} from '../i18n';
import {labels} from '../admin/i18n';
import {OrderCard} from './OrderCard';
export function ActiveOrders({lang}:{lang:Lang}){
 const[uid,setUid]=useState(auth.currentUser?.uid||null),[id,setId]=useState<string|null>(null),[loading,setLoading]=useState(true),[error,setError]=useState(''),[retry,setRetry]=useState(0);const t=labels(lang);
 useEffect(()=>onAuthStateChanged(auth,u=>setUid(u?.uid||null)),[]);
 useEffect(()=>{setId(null);setError('');if(!uid){setLoading(false);return}setLoading(true);return onSnapshot(doc(db,'activeCustomers',uid),d=>{setId(d.data()?.orderId||null);setLoading(false);setError('')},()=>{setLoading(false);setError(t.dataError)})},[uid,lang,retry]);
 if(error)return <p className="spark-error" role="alert">{error} <button onClick={()=>setRetry(v=>v+1)}>{t.retry}</button></p>;
 if(id)return <OrderCard key={id} id={id} lang={lang}/>;
 return <p className="spark-caption">{loading?t.loading:(lang==='ru'?'Нет активных заказов':lang==='tg'?'Фармоиши фаъол нест':'Faol buyurtma yo‘q')}</p>;
}
