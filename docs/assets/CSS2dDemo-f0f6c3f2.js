import{R as O,V as z,d as y,ae as W,S as D,P as H,A,W as R,w as q,M as B,c as L,H as P,D as b}from"./three.module-6576df63.js";import{d as F,r as T,o as k,c as N,a as V}from"./index-27cacae6.js";class G extends O{constructor(i=document.createElement("div")){super(),this.isCSS2DObject=!0,this.element=i,this.element.style.position="absolute",this.element.style.userSelect="none",this.element.setAttribute("draggable",!1),this.center=new z(.5,.5),this.addEventListener("removed",function(){this.traverse(function(o){o.element instanceof Element&&o.element.parentNode!==null&&o.element.parentNode.removeChild(o.element)})})}copy(i,o){return super.copy(i,o),this.element=i.element.cloneNode(!0),this.center=i.center,this}}const m=new y,v=new W,_=new W,M=new y,C=new y;class I{constructor(i={}){const o=this;let s,c,u,h;const d={objects:new WeakMap},a=i.element!==void 0?i.element:document.createElement("div");a.style.overflow="hidden",this.domElement=a,this.getSize=function(){return{width:s,height:c}},this.render=function(e,t){e.matrixWorldAutoUpdate===!0&&e.updateMatrixWorld(),t.parent===null&&t.matrixWorldAutoUpdate===!0&&t.updateMatrixWorld(),v.copy(t.matrixWorldInverse),_.multiplyMatrices(t.projectionMatrix,v),w(e,e,t),f(e)},this.setSize=function(e,t){s=e,c=t,u=s/2,h=c/2,a.style.width=e+"px",a.style.height=t+"px"};function w(e,t,r){if(e.isCSS2DObject){m.setFromMatrixPosition(e.matrixWorld),m.applyMatrix4(_);const n=e.visible===!0&&m.z>=-1&&m.z<=1&&e.layers.test(r.layers)===!0;if(e.element.style.display=n===!0?"":"none",n===!0){e.onBeforeRender(o,t,r);const p=e.element;p.style.transform="translate("+-100*e.center.x+"%,"+-100*e.center.y+"%)translate("+(m.x*u+u)+"px,"+(-m.y*h+h)+"px)",p.parentNode!==a&&a.appendChild(p),e.onAfterRender(o,t,r)}const l={distanceToCameraSquared:x(r,e)};d.objects.set(e,l)}for(let n=0,l=e.children.length;n<l;n++)w(e.children[n],t,r)}function x(e,t){return M.setFromMatrixPosition(e.matrixWorld),C.setFromMatrixPosition(t.matrixWorld),M.distanceToSquared(C)}function S(e){const t=[];return e.traverse(function(r){r.isCSS2DObject&&t.push(r)}),t}function f(e){const t=S(e).sort(function(n,l){if(n.renderOrder!==l.renderOrder)return l.renderOrder-n.renderOrder;const p=d.objects.get(n).distanceToCameraSquared,E=d.objects.get(l).distanceToCameraSquared;return p-E}),r=t.length;for(let n=0,l=t.length;n<l;n++)t[n].element.style.zIndex=r-n}}}const K=F({__name:"CSS2dDemo",setup(g){const i=T(),o=()=>{const s=new D,c=new H(75,window.innerWidth/window.innerHeight,.1,1e3);c.position.z=10;const u=new A(100);s.add(u);const h=new R;h.setSize(window.innerWidth,window.innerHeight),i.value.appendChild(h.domElement);const d=new I;d.setSize(window.innerWidth,window.innerHeight),d.domElement.style.position="absolute",d.domElement.style.top="0px",i.value.appendChild(d.domElement);const a=document.createElement("div");a.textContent="Hello, CSS2DObject!",a.style.color="white";const w=new q(1,1,8),x=new B({color:65280}),S=new L(w,x);s.add(S);const f=new P(9290206,26253,.5);f.position.set(1,1,1),s.add(f);const e=new b(16777215,.8);e.position.set(-5,25,-1),e.castShadow=!0,e.shadow.camera.near=.01,e.shadow.camera.far=500,e.shadow.camera.right=30,e.shadow.camera.left=-30,e.shadow.camera.top=30,e.shadow.camera.bottom=-30,e.shadow.mapSize.width=1024,e.shadow.mapSize.height=1024,e.shadow.radius=4,e.shadow.bias=-6e-5,s.add(e);const t=new G(a);t.position.set(0,0,4),s.add(t);function r(){requestAnimationFrame(r),h.render(s,c),d.render(s,c)}r()};return k(()=>{o()}),(s,c)=>(V(),N("div",{ref_key:"threeRef",ref:i},null,512))}});export{K as default};
