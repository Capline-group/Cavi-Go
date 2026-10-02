import type {Lang} from './i18n';

export const say=(lang:Lang,tg:string,ru:string,uz:string)=>({tg,ru,uz})[lang];
const paths:Record<string,string>={
 basket:'M3 9h18l-2 12H5zM7 9l3-6m7 6-3-6M9 13v4m6-4v4',
 medical:'M8 3h8v5h5v8h-5v5H8v-5H3V8h5z',
 flower:'M12 13a3 3 0 1 0 0-6 3 3 0 0 0 0 6M9 5q3-6 6 0 6-1 5 5 2 5-4 5-4 5-8 0-6 0-4-5-1-6 5-5M12 16v6M12 20l-5-2',
 headphones:'M4 13v-2a8 8 0 0 1 16 0v2M4 12h4v9H4zM16 12h4v9h-4z',
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
export function Car({large=false,variant='economy'}:{large?:boolean;variant?:string}){
 const van=variant==='minivan';
 return <svg className={'car-art '+(large?'large':'')} viewBox="0 0 96 44" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d={van?'M7 29l3-16q1-5 7-5h49l10 11 12 5v10H7z':'M7 29l5-9 17-3 12-9h25l12 12 10 4v10H7z'} fill={variant==='business'?'#26382f':'#edf0ed'}/><path d={van?'M18 12h45l8 9H16z':'M34 18l10-7h19l9 9z'} fill={variant==='business'?'#a9b9ae':'#c6d5cc'}/><path d="M51 12v8M34 24h7M60 25h6M9 25h8M80 25h6"/><circle cx="25" cy="33" r="7" fill="#fff"/><circle cx="73" cy="33" r="7" fill="#fff"/><circle cx="25" cy="33" r="2" fill="currentColor"/><circle cx="73" cy="33" r="2" fill="currentColor"/></svg>
}
