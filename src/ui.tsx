import type {Lang} from './i18n';

export const say=(lang:Lang,tg:string,ru:string,uz:string)=>({tg,ru,uz})[lang];
const paths:Record<string,string>={
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
export function Car({large=false}:{large?:boolean}){return <svg className={'car-art '+(large?'large':'')} viewBox="0 0 180 90" aria-hidden="true"><ellipse cx="91" cy="75" rx="73" ry="7" fill="#123b2910"/><path d="M17 57l12-17 32-5 20-18h44l23 25 17 8v18H15z" fill="#e2e8e3" stroke="#315442" strokeWidth="2"/><path d="M67 35l18-14h35l15 20-74-2z" fill="#315442"/><path d="M100 21v19M27 48l130 3" stroke="#fff" strokeWidth="2"/><path d="M23 53h15m116 1h9" stroke="#bac772" strokeWidth="5"/><circle cx="48" cy="67" r="14" fill="#243c31"/><circle cx="48" cy="67" r="7" fill="#d9e0db"/><circle cx="137" cy="67" r="14" fill="#243c31"/><circle cx="137" cy="67" r="7" fill="#d9e0db"/></svg>}
