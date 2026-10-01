export type Place={id:string;lat:number;lon:number;tags:Record<string,string>};
export const placeName=(p:Place)=>p.tags.name||p.tags['name:ru']||p.tags['addr:street']||'📍';
export const placeAddress=(p:Place)=>[p.tags['addr:city'],p.tags['addr:street'],p.tags['addr:housenumber']].filter(Boolean).join(', ');
export function isPlace(p:unknown):p is Place {if(!p||typeof p!=='object')return false;const x=p as Place;return typeof x.id==='string'&&Number.isFinite(x.lat)&&Number.isFinite(x.lon)&&x.lat>=35.5&&x.lat<=42&&x.lon>=66&&x.lon<=76.5&&!!x.tags&&typeof x.tags==='object'}
let request:Promise<Place[]>|undefined;
export function loadPlaces(){return request??=fetch('https://sultonmusic.github.io/cavi-maps/places.json',{signal:AbortSignal.timeout(20000)}).then(r=>{if(!r.ok)throw Error('places unavailable');return r.json()}).then(data=>{if(!Array.isArray(data))throw Error('invalid places');return data.filter(isPlace)}).catch(e=>{request=undefined;throw e})}
