import{a as x,t as y,c as i,f as I,s as c}from"../chunks/disclose-version.JjLX6-4n.js";import{u as k,m as f,l as w,r as l,n as m,o as E,q as d,s as N,v as u,w as U,U as b,x as p,y as q,p as A,t as D,k as L}from"../chunks/runtime.D0En0JZf.js";import{s as _}from"../chunks/render.Ck0yda4T.js";import{s as S}from"../chunks/entry.umf3zUcp.js";function T(){const s=w,e=s.l.u;e&&(e.b.length&&k(()=>{g(s),l(e.b)}),f(()=>{const n=m(()=>e.m.map(E));return()=>{for(const t of n)typeof t=="function"&&t()}}),e.a.length&&f(()=>{g(s),l(e.a)}))}function g(s){if(s.l.s)for(const e of s.l.s)d(e);N(s.s)}function Z(s,e,n){if(s==null)return e(void 0),u;const t=s.subscribe(e,n);return t.unsubscribe?()=>t.unsubscribe():t}function j(s,e,n){let t=n[e];const r=t===void 0;r&&(t={store:null,last_value:null,value:q(b),unsubscribe:u},n[e]=t),(r||t.store!==s)&&(t.unsubscribe(),t.store=s??null,t.unsubscribe=z(s,t.value));const a=d(t.value);return a===b?t.last_value:a}function z(s,e){return s==null?(p(e,void 0),u):Z(s,n=>p(e,n))}function B(s){C(()=>{let e;for(e in s)s[e].unsubscribe()})}function C(s){U(()=>()=>m(s))}const F=()=>{const s=S;return{page:{subscribe:s.page.subscribe},navigating:{subscribe:s.navigating.subscribe},updated:s.updated}},G={subscribe(s){return F().page.subscribe(s)}};var H=y("<h1> </h1> <p> </p>",1);function P(s,e){A(e,!1);const n={};B(n);const t=()=>j(G,"$page",n);T();var r=H(),a=I(r),v=i(a),h=c(c(a,!0)),$=i(h);D(()=>{var o;_(v,t().status),_($,(o=t().error)==null?void 0:o.message)}),x(s,r),L()}export{P as component};