// Run with: node tests/physics.test.cjs (no dependency installation).
const fs = require('node:fs');
const vm = require('node:vm');
const assert = require('node:assert/strict');
const path = require('node:path');
const html = fs.readFileSync(path.join(__dirname, '..', 'index.html'), 'utf8');
const script = html.split('<script>')[1].split('</script>')[0];
new vm.Script(script);
const context = {};
vm.createContext(context);
vm.runInContext(script.split('const $=')[0] + ';this.physics = Physics;', context);
const p = context.physics;
let count = 0;
function test(name, fn) { fn(); count++; console.log('OK', name); }
function near(a,b,e=1e-8){assert.ok(Math.abs(a-b)<e, `${a} ≠ ${b}`);}
function vnear(a,b,e=1e-8){a.forEach((x,i)=>near(x,b[i],e));}
const cfg = {frequency:2,amplitude:.65,wave:'sine',freeze:false,disable:false};
const initial = () => ({t:0,rotor:0,theta:0});
test('Reflection preserves norm and reverses normal component',()=>{
 for(let i=-30;i<=30;i++){const n=p.ry([0,0,1],i*p.rad),d=[0,0,1],r=p.reflect(d,n);near(p.dot(r,r),1);near(p.dot(r,n),-p.dot(d,n));}
});
test('Planar mirror rotation changes ray direction by twice the angle',()=>{
 for(const angle of [.01,.03,.1]){const r=p.reflect([0,0,1],p.ry([0,0,1],angle));near(Math.acos(-r[2]),2*angle);}
});
test('Central optical path hits both mirrors and center of screen',()=>{
 const r=p.trace(0,0);assert.ok(r.valid);assert.equal(r.points.length,4);vnear(r.points[1],p.P);vnear(r.points[2],p.M);vnear(r.outgoing,[0,0,1]);near(r.x,0);near(r.y,0);
});
test('Independent deflections are orthogonal at rest',()=>{
 const h=1e-6,a=p.trace(h,0),b=p.trace(-h,0),c=p.trace(0,h),d=p.trace(0,-h);
 assert.ok((a.x-b.x)/(2*h)>10);near(a.y-b.y,0);near((c.x-d.x)/(2*h),0);near((c.y-d.y)/(2*h),4.5,1e-6);
});
test('Screen hits satisfy reflection and finite mirror bounds across operating window',()=>{
 for(let a=-10;a<=10;a+=.5)for(let t=-6;t<=6;t+=1){const r=p.trace(a*p.rad,t*p.rad);assert.ok(r.valid,`miss at ${a}, ${t}`);near(r.hit[2],p.screenZ);near(p.dot(p.sub(r.points[2],p.M),r.normal),0);vnear(p.reflect(r.incoming,r.normal),r.outgoing);}
});
test('Eight identical sweeps per revolution and a dark interval between facets',()=>{
 for(let k=0;k<8;k++){const r=p.trace(k*Math.PI/4,0);assert.ok(r.valid);near(r.x,0);assert.ok(!p.trace(k*Math.PI/4+20*p.rad,0).valid);}
});
test('Horizontal sweep is monotonic, finite-angle optical deviations retained',()=>{
 let prev=-Infinity;for(let a=-10;a<=10;a+=.1){const r=p.trace(a*p.rad,0);assert.ok(r.x>prev);prev=r.x;}assert.ok(Math.abs(p.trace(0,.1).x)>.001);
});
test('Laplace forces cancel and form the expected vertical torque',()=>{
 for(const theta of [-.1,0,.1]){const f=p.forces(theta,-1);vnear(p.add(f.f1,f.f2),[0,0,0]);near(f.torque[0],0);near(f.torque[1],0);assert.ok(f.torque[2]>0);const g=p.forces(theta,1);near(g.torque[2],-f.torque[2]);}
});
test('Waveforms have requested period and unit extrema',()=>{
 for(const wave of ['sine','triangle','square'])for(const f of [.5,2,5]){near(p.signal(.25/f,f,wave),1);near(p.signal(.75/f,f,wave),-1);near(p.signal(.13/f,f,wave),p.signal(1.13/f,f,wave));}
});
test('Ideal response has expected gain; freeze and suppression are independent',()=>{
 const st=initial();p.advance(st,{...cfg,freeze:true},.125);near(st.theta,6*p.rad*.65);near(st.rotor,0);p.advance(st,{...cfg,disable:true},.01);near(st.theta,0);assert.ok(st.rotor>0);
});
test('Ideal square follows both current levels without mechanical lag',()=>{
 const st=initial(),c={...cfg,wave:'square'},h=1/720;
 p.advance(st,c,h);near(st.theta,6*p.rad*c.amplitude);
 st.t=.25-h/2;p.advance(st,c,h);near(st.theta,-6*p.rad*c.amplitude);
 p.advance(st,{...c,disable:true},h);near(st.theta,0);
});
test('Fixed time steps give identical state for different rendering cadences',()=>{
 function run(fps){const st=initial(),h=1/720;for(let frame=0;frame<fps*4;frame++)for(let i=0;i<720/fps;i++)p.advance(st,cfg,h);return st;}
 const a=run(30),b=run(60),c=run(120);for(const k of Object.keys(a)){near(a[k],b[k],1e-12);near(a[k],c[k],1e-12);}
});
console.log(`${count} physics checks passed.`);
