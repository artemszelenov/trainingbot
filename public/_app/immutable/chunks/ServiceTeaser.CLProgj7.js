import{l as _,a as g,t as k,c as i,s as c}from"./disclose-version.JjLX6-4n.js";import{L as p,t as z}from"./runtime.D0En0JZf.js";import{s as f}from"./render.Ck0yda4T.js";function o(t,s,r){r=r==null?null:r+"";var a=t.__attributes??(t.__attributes={});_&&(a[s]=t.getAttribute(s),s==="src"||s==="href"||s==="srcset")||a[s]!==(a[s]=r)&&(s==="loading"&&(t[p]=r),r===null?t.removeAttribute(s):t.setAttribute(s,r))}var A=k('<article class="svelte-12zk3s2"><section class="svelte-12zk3s2"><h1 class="svelte-12zk3s2"> </h1> <p class="svelte-12zk3s2"> </p> <a class="svelte-12zk3s2">Подробнее</a></section></article>');function S(t,s){var r=A(),a=i(r),e=i(a),v=i(e),l=c(c(e,!0)),h=i(l),n=c(c(l,!0));z(()=>{o(r,"style",`--bg: url('${s.bgUrl??""}')`),f(v,s.title),f(h,s.subtitle),o(n,"href",s.href)}),g(t,r)}export{S};