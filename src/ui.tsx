import {useId} from 'react';
import type {Lang} from './i18n';

export const say=(lang:Lang,tg:string,ru:string,uz:string)=>({tg,ru,uz})[lang];
const paths:Record<string,string>={
 settings:'M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8M9 3h6l1 3 3 1 2 5-2 5-3 1-1 3H9l-1-3-3-1-2-5 2-5 3-1z',
 grid:'M3 3h7v7H3zM14 3h7v7h-7zM3 14h7v7H3zM14 14h7v7h-7z',
 plus:'M12 4v16M4 12h16',
 chevron:'M9 5l7 7-7 7',
 chat:'M3 3h18v13H9l-6 5zM7 8h10M7 12h6',
 paint:'M3 3h14v7H3zM17 6h4v8h-9v7',
 plug:'M8 3v5m8-5v5M6 8h12v5a6 6 0 0 1-12 0zM12 19v3',
 faucet:'M4 12h11V8H9v4M6 6h12M12 3v5M15 12h5v5h-5M3 10v8',
 climate:'M2 5h20v11H2zM5 9h14M5 13h14M7 19v2m5-2v3m5-3v2',
 shop:'M3 10h18v11H3zM2 10l2-7h16l2 7M9 21v-7h6v7',
 food:'M3 17h18M5 15a7 7 0 0 1 14 0M12 4v3M2 21h20',
 wallet:'M3 7V4h16v3M3 7h18v14H3zM15 11h6v6h-6z',
 ticket:'M3 4h18v6a2 2 0 0 0 0 4v6H3v-6a2 2 0 0 0 0-4zM15 7l-6 10M9 8h.01M15 16h.01',
 megaphone:'M3 10v7h5l12 5V3L8 10zM8 17l2 5H6l-2-5M8 10v7',
 home:'M3 10l9-7 9 7v10a1 1 0 0 1-1 1h-5v-7H9v7H4a1 1 0 0 1-1-1z',
 taxi:'M5 10l2-5h10l2 5M4 10h16v8H4zM6 18v2m12-2v2M7 14h1m8 0h1',
 services:'M14 4a6 6 0 0 0-7 7L3 15a3 3 0 0 0 4 4l4-4a6 6 0 0 0 7-7l-4 3-3-3z',
 jobs:'M8 7V4h8v3M3 7h18v13H3zM3 12l9 3 9-3M10 14h4',
 delivery:'M3 6l9-4 9 4v13l-9 3-9-3zM3 6l9 4 9-4M12 10v12M7 4l10 4v5',
 fuel:'M4 3h10v18H4zM4 11h10M7 6h4M14 12h2a2 2 0 0 1 2 2v3a2 2 0 0 0 4 0V9l-4-4M19 6v4h3',
 profile:'M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8M4 21v-2a8 8 0 0 1 16 0v2z',
 search:'M10 17a7 7 0 1 0 0-14 7 7 0 0 0 0 14M15 15l6 6',
 pin:'M12 22s7-8 7-13A7 7 0 0 0 5 9c0 5 7 13 7 13M12 11a2 2 0 1 0 0-4 2 2 0 0 0 0 4',
 shield:'M12 3l8 3v6c0 5-8 9-8 9S4 17 4 12V6zM8 12l3 3 5-6',
 clock:'M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20M12 6v6l4 2',
 card:'M2 5h20v14H2zM2 10h20M6 15h4',
 language:'M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20M2 12h20M12 2c6 6 6 14 0 20-6-6-6-14 0-20',
 support:'M3 14v-3a9 9 0 0 1 18 0v3M3 12h4v7H3zM17 12h4v7h-4zM21 19c0 3-5 3-9 3',
 arrow:'M5 12h14M13 6l6 6-6 6',
 bell:'M5 17V9a7 7 0 0 1 14 0v8l2 2H3zM10 22h4',
 back:'M15 5l-7 7 7 7',
 star:'M12 2l3 6 7 1-5 5 1 7-6-3-6 3 1-7-5-5 7-1z',
 info:'M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20M12 11v6M12 7h.01',
 logout:'M9 4H3v16h6M9 12h12M17 8l4 4-4 4',
 filter:'M3 6h18M3 12h18M3 18h18M7 4v4M16 10v4M10 16v4'
};
export function Icon({name,className=''}:{name:string;className?:string}){return <svg className={'icon '+className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d={paths[name]||paths.info}/></svg>}
export function Car({large=false,variant='economy'}:{large?:boolean;variant?:string}){return <svg className={'car-art '+(large?'large':'')} viewBox="0 0 180 90" aria-hidden="true"><ellipse cx="91" cy="75" rx="73" ry="7" fill="#123b2910"/><path d="M17 57l12-17 32-5 20-18h44l23 25 17 8v18H15z" fill={variant==='business'?'#263932':variant==='taxi'?'#f4c739':'#eef1ef'} stroke="#315442" strokeWidth="2"/><path d="M67 35l18-14h35l15 20-74-2z" fill="#315442"/><path d="M100 21v19M27 48l130 3" stroke="#fff" strokeWidth="2"/><path d="M23 53h15m116 1h9" stroke="#bac772" strokeWidth="5"/><circle cx="48" cy="67" r="14" fill="#243c31"/><circle cx="48" cy="67" r="7" fill="#d9e0db"/><circle cx="137" cy="67" r="14" fill="#243c31"/><circle cx="137" cy="67" r="7" fill="#d9e0db"/></svg>}

export function ServiceArt({name}:{name:string}){
 const id=useId().replace(/:/g,'');
 if(name==='taxi')return <Car variant="taxi"/>;
 return <svg className="service-art" viewBox="0 0 120 110" aria-hidden="true"><defs><linearGradient id={id+'g'} x2="1" y2="1"><stop stopColor="#159566"/><stop offset="1" stopColor="#003d29"/></linearGradient><linearGradient id={id+'y'} x2=".8" y2="1"><stop stopColor="#ffe06a"/><stop offset="1" stopColor="#e69908"/></linearGradient><linearGradient id={id+'b'} x2="0" y2="1"><stop stopColor="#77d3e1"/><stop offset="1" stopColor="#12607b"/></linearGradient></defs><ellipse cx="60" cy="99" rx="40" ry="5" fill="#003d2912"/>
 {name==='jobs'?<><path d="M43 31V18q0-8 8-8h19q8 0 8 8v13" fill="none" stroke={'url(#'+id+'g)'} strokeWidth="8"/><rect x="19" y="28" width="84" height="67" rx="12" fill={'url(#'+id+'g)'}/><path d="M20 38q40 31 81 0v13q-40 27-81 0" fill="#147b57"/><rect x="55" y="49" width="13" height="22" rx="4" fill="#edeee5"/><rect x="59" y="54" width="5" height="8" rx="2" fill="#c8b46c"/></>:
 name==='services'?<><g transform="rotate(-39 60 56)"><path d="M47 12a24 24 0 1 0 26 0v19H47z" fill={'url(#'+id+'y)'}/><rect x="50" y="49" width="21" height="48" rx="9" fill={'url(#'+id+'g)'}/><circle cx="61" cy="85" r="4" fill="#d7d5b6"/></g><g transform="rotate(40 60 57)"><path d="M55 6h10l4 17-5 7v43h-9V30l-4-7z" fill={'url(#'+id+'y)'}/><rect x="48" y="64" width="23" height="37" rx="8" fill={'url(#'+id+'g)'}/><path d="M54 71v20m10-20v20" stroke="#199569" strokeWidth="3"/></g></>:
 name==='delivery'?<><circle cx="29" cy="84" r="15" fill="#26352d"/><circle cx="29" cy="84" r="7" fill="#ccd3ca"/><circle cx="93" cy="84" r="15" fill="#26352d"/><circle cx="93" cy="84" r="7" fill="#ccd3ca"/><path d="M21 64h38l14-38h12l9 48H62q-8 16-21 4H16z" fill={'url(#'+id+'y)'}/><path d="M53 55h-29" stroke="#30483a" strokeWidth="8" strokeLinecap="round"/><path d="M75 27l-4-15H61" stroke="#315343" strokeWidth="6" fill="none" strokeLinecap="round"/><rect x="13" y="33" width="33" height="28" rx="6" fill="#c7653f"/><path d="M27 34v26" stroke="#f0b183" strokeWidth="7"/><path d="M89 41l4 8" stroke="#fff8dd" strokeWidth="7" strokeLinecap="round"/></>:
 <><path d="M84 39l13 12v30q0 15-12 15t-12-12V64" fill="none" stroke="#264b3a" strokeWidth="6"/><rect x="27" y="9" width="51" height="89" rx="8" fill={'url(#'+id+'g)'}/><rect x="34" y="16" width="37" height="30" rx="4" fill="#122d25"/><rect x="38" y="20" width="29" height="20" rx="3" fill={'url(#'+id+'b)'}/><path d="M54 51c-3 10-11 14-11 22a11 11 0 0 0 22 0c0-7-9-14-11-22" fill={'url(#'+id+'y)'}/><rect x="23" y="92" width="59" height="8" rx="3" fill="#064331"/><path d="M83 33l14 14-4 7-14-13z" fill="#233e30"/></>}
 </svg>
}
