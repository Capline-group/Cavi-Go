import {readFile,writeFile} from 'node:fs/promises';
import {resolve} from 'node:path';
const root=resolve(process.argv[2]||'.');
const taxiPath=resolve(root,'src/Taxi.tsx'),mainPath=resolve(root,'src/main.tsx');
let taxi=await readFile(taxiPath,'utf8'),main=await readFile(mainPath,'utf8');
const originalTaxi=taxi,originalMain=main;
function replace(s,before,after,label){if(!s.includes(before))throw Error(`${label} changed; integrate manually without overwriting customer changes.`);return s.replace(before,after)}
if(!taxi.includes("from './spark/Booking'")){
 taxi="import {Booking} from './spark/Booking';\n"+taxi;
 taxi=replace(taxi,'<button className="order-button" disabled>{t.request}</button><p className="launch-note">{t.pending}</p>',"<Booking lang={lang} pickup={from} destination={to} category={vehicle} serviceType={mode==='delivery'?'delivery':'taxi'} paymentMethod={pay}/>",'Taxi booking');
 taxi=taxi.replace("s('Ба зудӣ','Скоро','Tez kunda')","s('Бо мувофиқа','По договорённости','Kelishiladi')");
}
if(!main.includes("from './spark/OrderHistory'")){
 main="import {OrderHistory} from './spark/OrderHistory';\nimport {EmailVerification} from './spark/EmailVerification';\nimport {ActiveOrders} from './spark/ActiveOrders';\n"+main;
 main=replace(main,"role:modal,name:f.get('name'),vehicle:f.get('vehicle'),plate:f.get('plate'),skills:f.get('skills')","role:modal,name:f.get('name'),phone:f.get('phone'),category:modal==='driver'?'economy':'repair',vehicle:f.get('vehicle'),plate:f.get('plate'),skills:f.get('skills')",'Provider submission');
 main=replace(main,"{modal==='info'?<p>{user?.email}</p>:modal==='driver'?","{(modal==='driver'||modal==='technician')&&<label>{s('Телефон','Телефон','Telefon')}<input name=\"phone\" type=\"tel\" required pattern=\"\\+992[0-9]{9}\" placeholder=\"+992901234567\" maxLength={13}/></label>}{modal==='info'?<p>{user?.email}</p>:modal==='driver'?",'Provider form');
 const mainTags=main.match(/<main\b[^>]*>/g)||[];
 if(mainTags.length!==1)throw Error('Main container changed; integrate verification manually.');
 main=replace(main,mainTags[0],mainTags[0]+'<EmailVerification lang={lang}/>','Main container');
 main=replace(main,'<section className="my-orders"','<OrderHistory lang={lang}/><section className="my-orders"','Profile history');
 const start=main.indexOf('<div className="no-orders">'),end=main.indexOf('</section>',start);
 if(start<0||end<0)throw Error('Home order section changed; add ActiveOrders manually.');
 main=main.slice(0,start)+'<ActiveOrders lang={lang}/>'+main.slice(end);
}
if(!taxi.includes('initialMode')){
 taxi=replace(taxi,'export function Taxi({lang}:{lang:Lang}){',"export function Taxi({lang,initialMode='taxi'}:{lang:Lang;initialMode?:'taxi'|'master'|'delivery'}){",'Taxi props');
 taxi=replace(taxi,"[mode,setMode]=useState('taxi'),[vehicle,setVehicle]=useState('economy')","[mode,setMode]=useState<string>(initialMode),[vehicle,setVehicle]=useState(initialMode==='master'?'repair':'economy')",'Taxi service state');
 taxi=replace(taxi,"[['taxi',t.taxi],['intercity'", "[['taxi',t.taxi],['master',t.services],['intercity'",'Taxi tabs');
 taxi=replace(taxi,"onClick={()=>setMode(key)}", "onClick={()=>{setMode(key);setVehicle(key==='master'?'repair':'economy')}}",'Service switch');
 const start=taxi.indexOf('<button className="address-row" onClick={()=>open(\'to\')}>'),end=taxi.indexOf('<div className="vehicle-grid">',start);
 if(start<0||end<0)throw Error('Taxi destination layout changed.');
 taxi=taxi.slice(0,start)+"{mode!=='master'&&<>"+taxi.slice(start,end)+'</>}'+taxi.slice(end);
 const g=taxi.indexOf('<div className="vehicle-grid">'),ge=taxi.indexOf('<div className="payment-row">',g);
 if(g<0||ge<0)throw Error('Taxi category layout changed.');
 const masters="<div className=\"vehicle-grid\">{[['repair',s('Таъмир','Ремонт','Ta’mirlash')],['finishing',s('Ороиш','Отделка','Pardozlash')],['electrical',s('Барқ','Электрика','Elektr')],['plumbing',s('Қубур','Сантехника','Santexnika')],['climate',s('Иқлим','Климат','Iqlim')]].map(([key,name])=><button key={key} aria-pressed={vehicle===key} onClick={()=>setVehicle(key)}><Icon name=\"services\"/><strong>{name}</strong><small>{s('Бо мувофиқа','По договорённости','Kelishiladi')}</small></button>)}</div>";
 taxi=taxi.slice(0,g)+"{mode==='master'?"+masters+':'+taxi.slice(g,ge)+'}'+taxi.slice(ge);
 taxi=replace(taxi,"serviceType={mode==='delivery'?'delivery':'taxi'}","serviceType={mode==='master'?'master':mode==='delivery'?'delivery':'taxi'}",'Booking service');
}
if(!main.includes('spark-open-link')){
 main=replace(main,"category:modal==='driver'?'economy':'repair'","category:f.get('category')",'Provider category');
 main=replace(main,"{modal==='info'?<p>{user?.email}</p>:modal==='driver'?","{(modal==='driver'||modal==='technician')&&<label>{s('Категория','Категория','Toifa')}<select name=\"category\" required>{(modal==='driver'?[['economy','Economy'],['comfort','Comfort'],['business','Business'],['minivan','Minivan']]:serviceCats.slice(1)).map(([value,label])=><option key={value} value={value}>{label}</option>)}</select></label>}{modal==='info'?<p>{user?.email}</p>:modal==='driver'?",'Provider category control');
 main=replace(main,'<Taxi lang={lang}/>',"<Taxi lang={lang} initialMode={new URLSearchParams(location.search).get('service')==='master'?'master':new URLSearchParams(location.search).get('service')==='delivery'?'delivery':'taxi'}/>",'Taxi mode');
 main=replace(main,'<div className="directory-tools">',"{page==='services'&&<a className=\"spark-open-link\" href=\"/?service=master#taxi\">{s('Усто фармоиш диҳед','Вызвать мастера','Usta chaqirish')} →</a>}<div className=\"directory-tools\">",'Master order link');
 main=replace(main,'<div className="delivery-categories">',"<a className=\"spark-open-link\" href=\"/?service=delivery#taxi\">{s('Расонидан аз рӯи суроға','Доставка по адресу','Manzil orqali yetkazish')} →</a><div className=\"delivery-categories\">",'Delivery order link');
 main=replace(main,'<div className="join-actions">',"<div className=\"join-actions\"><a className=\"spark-open-link\" href=\"/driver\">{s('Кабинети шарик','Кабинет партнёра','Hamkor kabineti')} →</a>",'Partner link');
}
if(main.includes('<OrderHistory lang={lang}/><section className="my-orders" id="my-orders">')){
 main=replace(main,'<OrderHistory lang={lang}/><section className="my-orders" id="my-orders"><div className="section-heading"><h2>{t.orders}</h2>',"<div id=\"my-orders\"><OrderHistory lang={lang}/></div><section className=\"my-orders\" id=\"job-applications\"><div className=\"section-heading\"><h2>{s('Аризаҳо ба кор','Отклики на вакансии','Ishga arizalar')}</h2>",'Order-history anchor');
}
taxi=taxi.replace("useRef<'from'|'to'>('to')","useRef<'from'|'to'>(initialMode==='master'?'from':'to')").replace("{setMode(key);setVehicle(key==='master'?'repair':'economy')}","{setMode(key);setVehicle(key==='master'?'repair':'economy');active.current=key==='master'?'from':'to'}").replace("destination={to}","destination={mode==='master'?null:to}").replace("name={key==='delivery'?'delivery':'taxi'}","name={key==='master'?'services':key==='delivery'?'delivery':'taxi'}");
// All anchors must validate before either shared file is touched.
if(await readFile(taxiPath,'utf8')!==originalTaxi||await readFile(mainPath,'utf8')!==originalMain)throw Error('Customer files changed during integration; retry from the current state.');
await writeFile(taxiPath,taxi);await writeFile(mainPath,main);
console.log('Spark booking, partner and history components integrated; existing customer layout retained.');
