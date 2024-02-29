import{_ as U,$ as h,a0 as u,a1 as R,r as k,a2 as I}from"./three.module-9041595f.js";class $ extends U{constructor(d){super(d),this.type=h}parse(d){const s=function(r,o){switch(r){case 1:console.error("THREE.RGBELoader Read Error: "+(o||""));break;case 2:console.error("THREE.RGBELoader Write Error: "+(o||""));break;case 3:console.error("THREE.RGBELoader Bad File Format: "+(o||""));break;default:case 4:console.error("THREE.RGBELoader: Error: "+(o||""))}return-1},L=`
`,B=function(r,o,c){o=o||1024;let i=r.pos,t=-1,n=0,l="",e=String.fromCharCode.apply(null,new Uint16Array(r.subarray(i,i+128)));for(;0>(t=e.indexOf(L))&&n<o&&i<r.byteLength;)l+=e,n+=e.length,i+=128,e+=String.fromCharCode.apply(null,new Uint16Array(r.subarray(i,i+128)));return-1<t?(c!==!1&&(r.pos+=n+t+1),l+e.slice(0,t)):!1},S=function(r){const o=/^#\?(\S+)/,c=/^\s*GAMMA\s*=\s*(\d+(\.\d+)?)\s*$/,a=/^\s*EXPOSURE\s*=\s*(\d+(\.\d+)?)\s*$/,i=/^\s*FORMAT=(\S+)\s*$/,t=/^\s*\-Y\s+(\d+)\s+\+X\s+(\d+)\s*$/,n={valid:0,string:"",comments:"",programtype:"RGBE",format:"",gamma:1,exposure:1,width:0,height:0};let l,e;if(r.pos>=r.byteLength||!(l=B(r)))return s(1,"no header found");if(!(e=l.match(o)))return s(3,"bad initial token");for(n.valid|=1,n.programtype=e[1],n.string+=l+`
`;l=B(r),l!==!1;){if(n.string+=l+`
`,l.charAt(0)==="#"){n.comments+=l+`
`;continue}if((e=l.match(c))&&(n.gamma=parseFloat(e[1])),(e=l.match(a))&&(n.exposure=parseFloat(e[1])),(e=l.match(i))&&(n.valid|=2,n.format=e[1]),(e=l.match(t))&&(n.valid|=4,n.height=parseInt(e[1],10),n.width=parseInt(e[2],10)),n.valid&2&&n.valid&4)break}return n.valid&2?n.valid&4?n:s(3,"missing image size specifier"):s(3,"missing format specifier")},A=function(r,o,c){const a=o;if(a<8||a>32767||r[0]!==2||r[1]!==2||r[2]&128)return new Uint8Array(r);if(a!==(r[2]<<8|r[3]))return s(3,"wrong scanline width");const i=new Uint8Array(4*o*c);if(!i.length)return s(4,"unable to allocate buffer space");let t=0,n=0;const l=4*a,e=new Uint8Array(4),x=new Uint8Array(l);let G=c;for(;G>0&&n<r.byteLength;){if(n+4>r.byteLength)return s(1);if(e[0]=r[n++],e[1]=r[n++],e[2]=r[n++],e[3]=r[n++],e[0]!=2||e[1]!=2||(e[2]<<8|e[3])!=a)return s(3,"bad rgbe scanline format");let f=0,g;for(;f<l&&n<r.byteLength;){g=r[n++];const m=g>128;if(m&&(g-=128),g===0||f+g>l)return s(3,"bad scanline data");if(m){const _=r[n++];for(let F=0;F<g;F++)x[f++]=_}else x.set(r.subarray(n,n+g),f),f+=g,n+=g}const D=a;for(let m=0;m<D;m++){let _=0;i[t]=x[m+_],_+=a,i[t+1]=x[m+_],_+=a,i[t+2]=x[m+_],_+=a,i[t+3]=x[m+_],t+=4}G--}return i},T=function(r,o,c,a){const i=r[o+3],t=Math.pow(2,i-128)/255;c[a+0]=r[o+0]*t,c[a+1]=r[o+1]*t,c[a+2]=r[o+2]*t,c[a+3]=1},M=function(r,o,c,a){const i=r[o+3],t=Math.pow(2,i-128)/255;c[a+0]=R.toHalfFloat(Math.min(r[o+0]*t,65504)),c[a+1]=R.toHalfFloat(Math.min(r[o+1]*t,65504)),c[a+2]=R.toHalfFloat(Math.min(r[o+2]*t,65504)),c[a+3]=R.toHalfFloat(1)},p=new Uint8Array(d);p.pos=0;const y=S(p);if(y!==-1){const r=y.width,o=y.height,c=A(p.subarray(p.pos),r,o);if(c!==-1){let a,i,t;switch(this.type){case u:t=c.length/4;const n=new Float32Array(t*4);for(let e=0;e<t;e++)T(c,e*4,n,e*4);a=n,i=u;break;case h:t=c.length/4;const l=new Uint16Array(t*4);for(let e=0;e<t;e++)M(c,e*4,l,e*4);a=l,i=h;break;default:console.error("THREE.RGBELoader: unsupported type: ",this.type);break}return{width:r,height:o,data:a,header:y.string,gamma:y.gamma,exposure:y.exposure,type:i}}}return null}setDataType(d){return this.type=d,this}load(d,E,w,b){function P(v,s){switch(v.type){case u:case h:v.colorSpace=k,v.minFilter=I,v.magFilter=I,v.generateMipmaps=!1,v.flipY=!0;break}E&&E(v,s)}return super.load(d,P,w,b)}}const Y=`precision lowp float;\r
\r
varying vec4 vPosition;\r
varying vec4 vgPostion;\r
\r
void main() {\r
    vgPostion = vec4(position, 1.0);\r
    vec4 modelPosition = modelMatrix * vgPostion;\r
    vPosition = modelPosition;\r
\r
    gl_Position = projectionMatrix * viewMatrix * modelPosition;\r
}\r
`,j=`precision lowp float;\r
\r
uniform float uTime;\r
\r
varying vec4 vPosition;\r
varying vec4 vgPostion;\r
\r
#define PI 3.14\r
\r
// 随机函数\r
float random (vec2 st) {\r
    return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453);\r
}\r
\r
// 旋转函数\r
vec2 rotate(vec2 uv, float rotation, vec2 mid) {\r
    return vec2(\r
    cos(rotation) * (uv.x - mid.x) + sin(rotation) * (uv.y - mid.y) + mid.x,\r
    cos(rotation) * (uv.y - mid.y) - sin(rotation) * (uv.x - mid.x) + mid.y\r
    );\r
}\r
\r
// 噪声函数\r
float noise (in vec2 st) {\r
    vec2 i = floor(st);\r
    vec2 f = fract(st);\r
\r
    // Four corners in 2D of a tile\r
    float a = random(i);\r
    float b = random(i + vec2(1.0, 0.0));\r
    float c = random(i + vec2(0.0, 1.0));\r
    float d = random(i + vec2(1.0, 1.0));\r
\r
    // Smooth Interpolation\r
\r
    // Cubic Hermine Curve.  Same as SmoothStep()\r
    vec2 u = f*f*(3.0-2.0*f);\r
    // u = smoothstep(0.,1.,f);\r
\r
    // Mix 4 coorners percentages\r
    return mix(a, b, u.x) +\r
    (c - a)* u.y * (1.0 - u.x) +\r
    (d - b) * u.x * u.y;\r
}\r
\r
\r
vec4 permute(vec4 x) {\r
    return mod(((x * 34.0) + 1.0) * x, 289.0);\r
}\r
\r
vec2 fade(vec2 t) {\r
    return t * t * t * (t * (t * 6.0 - 15.0) + 10.0);\r
}\r
\r
\r
// 经典柏林噪声函数\r
// https://blog.csdn.net/qq_28299311/article/details/103654190\r
float cnoise(vec2 P){\r
    vec4 Pi = floor(P.xyxy) + vec4(0.0, 0.0, 1.0, 1.0);\r
    vec4 Pf = fract(P.xyxy) - vec4(0.0, 0.0, 1.0, 1.0);\r
    Pi = mod(Pi, 289.0);// To avoid truncation effects in permutation\r
    vec4 ix = Pi.xzxz;\r
    vec4 iy = Pi.yyww;\r
    vec4 fx = Pf.xzxz;\r
    vec4 fy = Pf.yyww;\r
    vec4 i = permute(permute(ix) + iy);\r
    vec4 gx = 2.0 * fract(i * 0.0243902439) - 1.0;// 1/41 = 0.024...\r
    vec4 gy = abs(gx) - 0.5;\r
    vec4 tx = floor(gx + 0.5);\r
    gx = gx - tx;\r
    vec2 g00 = vec2(gx.x, gy.x);\r
    vec2 g10 = vec2(gx.y, gy.y);\r
    vec2 g01 = vec2(gx.z, gy.z);\r
    vec2 g11 = vec2(gx.w, gy.w);\r
    vec4 norm = 1.79284291400159 - 0.85373472095314 * vec4(dot(g00, g00), dot(g01, g01), dot(g10, g10), dot(g11, g11));\r
    g00 *= norm.x;\r
    g01 *= norm.y;\r
    g10 *= norm.z;\r
    g11 *= norm.w;\r
    float n00 = dot(g00, vec2(fx.x, fy.x));\r
    float n10 = dot(g10, vec2(fx.y, fy.y));\r
    float n01 = dot(g01, vec2(fx.z, fy.z));\r
    float n11 = dot(g11, vec2(fx.w, fy.w));\r
    vec2 fade_xy = fade(Pf.xy);\r
    vec2 n_x = mix(vec2(n00, n01), vec2(n10, n11), fade_xy.x);\r
    float n_xy = mix(n_x.x, n_x.y, fade_xy.y);\r
    return 2.3 * n_xy;\r
}\r
\r
// tips 重复：mod，波浪：sin\r
\r
void main() {\r
    vec4 redColor = vec4(1.0, 0, 0, 1);\r
    vec4 yellowColor = vec4(1.0, 1.0, 0.5, 1);\r
\r
    vec4 mixColor = mix(yellowColor, redColor, vgPostion.y / 3.0);\r
\r
    if (gl_FrontFacing) {\r
        gl_FragColor = vec4(mixColor.xyz - vPosition.y / 60.0 - 0.5, 1.0);\r
    } else {\r
        gl_FragColor = vec4(mixColor.xyz, 1.0);\r
    }\r
}\r
`;export{$ as R,j as f,Y as v};
