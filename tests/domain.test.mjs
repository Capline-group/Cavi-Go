import test from 'node:test';import assert from 'node:assert/strict';import{transition,money,paymentState,validText}from'../functions/domain.mjs';
test('driver cannot complete another ride or skip arrival',()=>{const r={status:'driver_assigned',driverId:'d',customerId:'c'};assert.throws(()=>transition(r,'other','driver_arriving'));assert.throws(()=>transition(r,'d','completed'));assert.equal(transition(r,'d','driver_arriving'),'driver_arriving');assert.equal(transition(r,'c','cancelled'),'cancelled')});
test('started ride cannot be casually cancelled',()=>assert.throws(()=>transition({status:'in_progress',customerId:'c'},'c','cancelled')));
test('payment remains separate from completed work',()=>{assert.equal(paymentState(true,false),'reported');assert.equal(paymentState(true,true),'confirmed_by_parties');assert.equal(paymentState(false,true),'unpaid')});
test('money in integer diram',()=>{assert.equal(money(500,2501,200,1000),1001);assert.throws(()=>money(1.5,2,3,4))});
test('reject invalid text',()=>{assert.throws(()=>validText(' '));assert.throws(()=>validText({}));assert.equal(validText(' hello '),'hello')});
