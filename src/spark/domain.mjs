export const activeStatuses = ['requested','accepted','arriving','arrived','in_progress'];
export const services = ['taxi','master','delivery'];
export function textValue(value, max=120) {
  if (typeof value !== 'string' || !value.trim() || value.trim().length > max) throw Error('invalid-argument');
  return value.trim();
}
export function phoneValue(value) {
  const phone=String(value||'').replace(/[\s()-]/g,'');
  if (!/^\+992\d{9}$/.test(phone)) throw Error('invalid-phone');
  return phone;
}
export function pointValue(value) {
  if (!value || !Number.isFinite(value.lat) || !Number.isFinite(value.lon) || value.lat<35.5 || value.lat>42 || value.lon<66 || value.lon>76.5) throw Error('invalid-location');
  return {lat:value.lat,lon:value.lon,name:textValue(value.name,160)};
}
export function nextStatus(order, actorId, next) {
  if (!activeStatuses.includes(order.status)) throw Error('order-finished');
  if (next==='cancelled' && ['requested','accepted','arriving','arrived'].includes(order.status) && (actorId===order.customerId || actorId===order.providerId)) return next;
  const transitions={accepted:'arriving',arriving:'arrived',arrived:'in_progress',in_progress:'completed'};
  if (actorId!==order.providerId || transitions[order.status]!==next) throw Error('permission-denied');
  if (next==='in_progress' && (!order.pickupConfirmed || !order.quoteAccepted || !Number.isSafeInteger(order.quoteMinor) || order.quoteMinor<=0)) throw Error('customer-confirmation-required');
  return next;
}
export function paymentState(order) {return order.paymentReported && order.paymentConfirmed ? 'confirmed_by_parties' : order.paymentReported ? 'reported' : 'unpaid';}
export function quoteValue(value) {const n=Number(value);if (!Number.isSafeInteger(n)||n<=0||n>10000000) throw Error('invalid-price');return n;}
export function csvCell(value) {
  let s=String(value??''); if (/^[\s]*[=+@\-\t\r]/.test(s)) s="'"+s;
  return '"'+s.replaceAll('"','""')+'"';
}
export function dataToCsv(rows, keys) {return '\uFEFF'+[keys.map(csvCell).join(','),...rows.map(r=>keys.map(k=>csvCell(r[k])).join(','))].join('\r\n');}
