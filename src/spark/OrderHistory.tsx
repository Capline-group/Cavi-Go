import {useEffect,useState} from 'react';
import {onAuthStateChanged} from 'firebase/auth';
import {collection,query,where,limit,orderBy,onSnapshot} from 'firebase/firestore';
import {auth,db} from '../firebase';
import type {Lang} from '../i18n';
import {labels,statusLabel} from '../admin/i18n';
import type {Data} from './client';
import {OrderCard} from './OrderCard';
import './style.css';
export function OrderHistory({lang,partner=false}:{lang:Lang;partner?:boolean}){
 const[uid,setUid]=useState(auth.currentUser?.uid||null),[rows,setRows]=useState<Data[]>([]),[selected,setSelected]=useState<string|null>(null),[error,setError]=useState('');const t=labels(lang);
 useEffect(()=>onAuthStateChanged(auth,u=>{setUid(u?.uid||null);setSelected(null)}),[]);
 useEffect(()=>{setRows([]);setError('');if(!uid)return;return onSnapshot(query(collection(db,'serviceOrders'),where(partner?'providerId':'customerId','==',uid),orderBy('createdAt','desc'),limit(20)),s=>{setRows(s.docs.map(d=>({id:d.id,...d.data()})));setError('')},()=>setError(t.dataError))},[uid,partner,lang]);
 if(!uid)return null;
 return <section className="spark-history"><h3>{t.orders}</h3>{error&&<p role="alert" className="spark-error">{error}</p>}{selected?<><button onClick={()=>setSelected(null)}>← {t.back}</button><OrderCard key={selected} id={selected} lang={lang} partner={partner} onClose={()=>setSelected(null)}/></>:rows.length?rows.map(r=><button className="spark-history-row" key={r.id} onClick={()=>setSelected(r.id)}><span><strong>{r.pickup?.name||r.id.slice(0,10)}</strong><small>{r.destination?.name||''}</small></span><span>{statusLabel(r.status,lang)} ›</span></button>):<p className="spark-caption">{t.empty}</p>}</section>;
}
