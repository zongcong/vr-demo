import{S as x,P as g,A as h,W as y,b as C,T as P,x as T,y as _,V as S,C as E,c as F,n as M}from"./three.module-9041595f.js";import{O as b}from"./OrbitControls-89ca71c8.js";import{d as k,r as q,o as j,c as A,a as H}from"./index-e861cf6e.js";const R=`uniform vec2 uFrequency;\r
uniform float uTime;\r
\r
varying vec2 vUv;\r
varying float vElevation;\r
\r
void main() {\r
  vUv = uv;\r
  vec4 modelPosition = modelMatrix * vec4(position, 1.0);\r
  float elevation = sin(modelPosition.x * uFrequency.x - uTime) * 0.1;\r
  elevation += sin(modelPosition.y * uFrequency.y - uTime) * 0.1;\r
//modelPosition.z += elevation;\r
  vec4 viewPosition = viewMatrix * modelPosition;\r
  vec4 projectedPosition = projectionMatrix * viewPosition;\r
  gl_Position = projectedPosition;\r
  vElevation = elevation;\r
}`,U=`uniform sampler2D uTexture;\r
\r
varying vec2 vUv;\r
varying float vElevation;\r
\r
void main() {\r
  vec4 textureColor = texture2D(uTexture, vUv);\r
  textureColor.rgb *= vElevation * 2.0 + 0.5;\r
  gl_FragColor = textureColor;\r
}`,z=k({__name:"RawShader",setup(W){const t=q(),d=()=>{const n=new x,i=new M,r=new g(70,window.innerWidth/window.innerHeight,.1,1e3);r.position.set(0,0,1);const m=new h(5);n.add(m);const o=new y,a=new b(r,o.domElement);a.update(),o.setSize(window.innerWidth,window.innerHeight),t.value.appendChild(o.domElement);const s=new C(1,32,16),l=s.attributes.position.count,v=new Float32Array(l);for(let e=0;e<l;e++)v[e]=Math.random();const p=new P,c=new T({vertexShader:R,fragmentShader:U,side:_,transparent:!0,uniforms:{uFrequency:{value:new S(10,5)},uTime:{value:0},uColor:{value:new E("orange")},uTexture:{value:p.load("./0.jpg")}}}),w=new F(s,c);n.add(w);function u(){a.update(),f(),o.render(n,r),requestAnimationFrame(u)}const f=()=>{const e=i.getElapsedTime();c.uniforms.uTime.value=e};u()};return j(()=>{d()}),(n,i)=>(H(),A("div",{ref_key:"threeRef",ref:t},null,512))}});export{z as default};
