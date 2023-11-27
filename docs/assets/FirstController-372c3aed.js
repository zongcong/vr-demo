import{C as A,G}from"./Capsule-5d402d02.js";import{D as H}from"./DRACOLoader-95884015.js";import{d as m,e as O,L as D,f as V,B,g as Y,h as X,i as _,j as q,F as K,W as N,k as j,l as Z,P as J,S as Q,C as U,m as $,G as ee,H as te,D as ne,n as se}from"./three.module-6576df63.js";import{d as oe,o as ie,c as re,a as ae}from"./index-df782a4d.js";const w=new m,b=new m,p=new O,v=new D,le=new D,M=new V,g=new A;class T{constructor(e){this.triangles=[],this.box=e,this.subTrees=[]}addTriangle(e){return this.bounds||(this.bounds=new B),this.bounds.min.x=Math.min(this.bounds.min.x,e.a.x,e.b.x,e.c.x),this.bounds.min.y=Math.min(this.bounds.min.y,e.a.y,e.b.y,e.c.y),this.bounds.min.z=Math.min(this.bounds.min.z,e.a.z,e.b.z,e.c.z),this.bounds.max.x=Math.max(this.bounds.max.x,e.a.x,e.b.x,e.c.x),this.bounds.max.y=Math.max(this.bounds.max.y,e.a.y,e.b.y,e.c.y),this.bounds.max.z=Math.max(this.bounds.max.z,e.a.z,e.b.z,e.c.z),this.triangles.push(e),this}calcBox(){return this.box=this.bounds.clone(),this.box.min.x-=.01,this.box.min.y-=.01,this.box.min.z-=.01,this}split(e){if(!this.box)return;const n=[],o=b.copy(this.box.max).sub(this.box.min).multiplyScalar(.5);for(let t=0;t<2;t++)for(let s=0;s<2;s++)for(let c=0;c<2;c++){const d=new B,r=w.set(t,s,c);d.min.copy(this.box.min).add(r.multiply(o)),d.max.copy(d.min).add(o),n.push(new T(d))}let i;for(;i=this.triangles.pop();)for(let t=0;t<n.length;t++)n[t].box.intersectsTriangle(i)&&n[t].triangles.push(i);for(let t=0;t<n.length;t++){const s=n[t].triangles.length;s>8&&e<16&&n[t].split(e+1),s!==0&&this.subTrees.push(n[t])}return this}build(){return this.calcBox(),this.split(0),this}getRayTriangles(e,n){for(let o=0;o<this.subTrees.length;o++){const i=this.subTrees[o];if(e.intersectsBox(i.box))if(i.triangles.length>0)for(let t=0;t<i.triangles.length;t++)n.indexOf(i.triangles[t])===-1&&n.push(i.triangles[t]);else i.getRayTriangles(e,n)}return n}triangleCapsuleIntersect(e,n){n.getPlane(p);const o=p.distanceToPoint(e.start)-e.radius,i=p.distanceToPoint(e.end)-e.radius;if(o>0&&i>0||o<-e.radius&&i<-e.radius)return!1;const t=Math.abs(o/(Math.abs(o)+Math.abs(i))),s=w.copy(e.start).lerp(e.end,t);if(n.containsPoint(s))return{normal:p.normal.clone(),point:s.clone(),depth:Math.abs(Math.min(o,i))};const c=e.radius*e.radius,d=v.set(e.start,e.end),r=[[n.a,n.b],[n.b,n.c],[n.c,n.a]];for(let f=0;f<r.length;f++){const S=le.set(r[f][0],r[f][1]),[x,y]=e.lineLineMinimumPoints(d,S);if(x.distanceToSquared(y)<c)return{normal:x.clone().sub(y).normalize(),point:y.clone(),depth:e.radius-x.distanceTo(y)}}return!1}triangleSphereIntersect(e,n){if(n.getPlane(p),!e.intersectsPlane(p))return!1;const o=Math.abs(p.distanceToSphere(e)),i=e.radius*e.radius-o*o,t=p.projectPoint(e.center,w);if(n.containsPoint(e.center))return{normal:p.normal.clone(),point:t.clone(),depth:Math.abs(p.distanceToSphere(e))};const s=[[n.a,n.b],[n.b,n.c],[n.c,n.a]];for(let c=0;c<s.length;c++){v.set(s[c][0],s[c][1]),v.closestPointToPoint(t,!0,b);const d=b.distanceToSquared(e.center);if(d<i)return{normal:e.center.clone().sub(b).normalize(),point:b.clone(),depth:e.radius-Math.sqrt(d)}}return!1}getSphereTriangles(e,n){for(let o=0;o<this.subTrees.length;o++){const i=this.subTrees[o];if(e.intersectsBox(i.box))if(i.triangles.length>0)for(let t=0;t<i.triangles.length;t++)n.indexOf(i.triangles[t])===-1&&n.push(i.triangles[t]);else i.getSphereTriangles(e,n)}}getCapsuleTriangles(e,n){for(let o=0;o<this.subTrees.length;o++){const i=this.subTrees[o];if(e.intersectsBox(i.box))if(i.triangles.length>0)for(let t=0;t<i.triangles.length;t++)n.indexOf(i.triangles[t])===-1&&n.push(i.triangles[t]);else i.getCapsuleTriangles(e,n)}}sphereIntersect(e){M.copy(e);const n=[];let o,i=!1;this.getSphereTriangles(e,n);for(let t=0;t<n.length;t++)(o=this.triangleSphereIntersect(M,n[t]))&&(i=!0,M.center.add(o.normal.multiplyScalar(o.depth)));if(i){const t=M.center.clone().sub(e.center),s=t.length();return{normal:t.normalize(),depth:s}}return!1}capsuleIntersect(e){g.copy(e);const n=[];let o,i=!1;this.getCapsuleTriangles(g,n);for(let t=0;t<n.length;t++)(o=this.triangleCapsuleIntersect(g,n[t]))&&(i=!0,g.translate(o.normal.multiplyScalar(o.depth)));if(i){const t=g.getCenter(new m).sub(e.getCenter(w)),s=t.length();return{normal:t.normalize(),depth:s}}return!1}rayIntersect(e){if(e.direction.length()===0)return;const n=[];let o,i,t=1e100;this.getRayTriangles(e,n);for(let s=0;s<n.length;s++){const c=e.intersectTriangle(n[s].a,n[s].b,n[s].c,!0,w);if(c){const d=c.sub(e.origin).length();t>d&&(i=c.clone().add(e.origin),t=d,o=n[s])}}return t<1e100?{distance:t,triangle:o,position:i}:!1}fromGraphNode(e){return e.updateWorldMatrix(!0,!0),e.traverse(n=>{if(n.isMesh===!0){let o,i=!1;n.geometry.index!==null?(i=!0,o=n.geometry.toNonIndexed()):o=n.geometry;const t=o.getAttribute("position");for(let s=0;s<t.count;s+=3){const c=new m().fromBufferAttribute(t,s),d=new m().fromBufferAttribute(t,s+1),r=new m().fromBufferAttribute(t,s+2);c.applyMatrix4(n.matrixWorld),d.applyMatrix4(n.matrixWorld),r.applyMatrix4(n.matrixWorld),this.addTriangle(new Y(c,d,r))}i&&o.dispose()}}),this.build(),this}}class ce extends X{constructor(e,n=16776960){super(new _,new q({color:n,toneMapped:!1})),this.octree=e,this.color=n,this.type="OctreeHelper",this.update()}update(){const e=[];function n(o){for(let i=0;i<o.length;i++){const t=o[i].box.min,s=o[i].box.max;e.push(s.x,s.y,s.z),e.push(t.x,s.y,s.z),e.push(t.x,s.y,s.z),e.push(t.x,t.y,s.z),e.push(t.x,t.y,s.z),e.push(s.x,t.y,s.z),e.push(s.x,t.y,s.z),e.push(s.x,s.y,s.z),e.push(s.x,s.y,t.z),e.push(t.x,s.y,t.z),e.push(t.x,s.y,t.z),e.push(t.x,t.y,t.z),e.push(t.x,t.y,t.z),e.push(s.x,t.y,t.z),e.push(s.x,t.y,t.z),e.push(s.x,s.y,t.z),e.push(s.x,s.y,s.z),e.push(s.x,s.y,t.z),e.push(t.x,s.y,s.z),e.push(t.x,s.y,t.z),e.push(t.x,t.y,s.z),e.push(t.x,t.y,t.z),e.push(s.x,t.y,s.z),e.push(s.x,t.y,t.z),n(o[i].subTrees)}}n(this.octree.subTrees),this.geometry.dispose(),this.geometry=new _,this.geometry.setAttribute("position",new K(e,3))}dispose(){this.geometry.dispose(),this.material.dispose()}}const de={id:"container"},he=30,ye=oe({__name:"FirstController",setup(I){let e,n,o,i,t,s=!1;const c={},d=new T;let r={geometry:new A(new m(0,.35,0),new m(0,1,0),.35),velocity:new m,direction:new m};const f=()=>{i=document.getElementById("container"),e=new N({antialias:!0}),e.setPixelRatio(window.devicePixelRatio),e.setSize(window.innerWidth,window.innerHeight),e.shadowMap.enabled=!0,e.shadowMap.type=j,e.toneMapping=Z,i.appendChild(e.domElement),n=new J(75,window.innerWidth/window.innerHeight,.1,1e3),n.position.set(0,0,0),n.rotation.order="YXZ",o=new Q,o.background=new U(8965358),o.fog=new $(8965358,0,50),o.add(new ee(10));const l=new te(9290206,26253,.5);l.position.set(2,1,1),o.add(l);const a=new ne(16777215,.8);a.position.set(-5,25,-1),a.castShadow=!0,a.shadow.camera.near=.01,a.shadow.camera.far=500,a.shadow.camera.right=30,a.shadow.camera.left=-30,a.shadow.camera.top=30,a.shadow.camera.bottom=-30,a.shadow.mapSize.width=1024,a.shadow.mapSize.height=1024,a.shadow.radius=4,a.shadow.bias=-6e-5,o.add(a),t=new se,window.addEventListener("resize",S),x()},S=()=>{n.aspect=window.innerWidth/window.innerHeight,n.updateProjectionMatrix(),e.setSize(window.innerWidth,window.innerHeight)},x=()=>{const l=new G,a=new H;a.setDecoderPath("/draco/"),a.setDecoderConfig({type:"js"}),a.preload(),l.setDRACOLoader(a),l.load("https://threejs.org/examples/models/gltf/collision-world.glb",u=>{console.log(u.scene),o.add(u.scene),d.fromGraphNode(u.scene);const h=new ce(d);h.visible=!0,o.add(h),u.scene.traverse(z=>{z.isMesh&&(z.castShadow=!0,z.receiveShadow=!0)})}),L()},y=()=>{let l=!1,a=0,u=0;document.addEventListener("mousedown",h=>{l=!0,a=h.clientX,u=h.clientY},!1),document.addEventListener("mouseup",h=>{l=!1},!1),document.addEventListener("mousemove",h=>{if(l){const R=h.clientX-a,k=h.clientY-u;n.rotation.y-=R/500,n.rotation.x-=k/500,n.rotation.x=Math.max(-Math.PI/2,Math.min(Math.PI/2,n.rotation.x)),a=h.clientX,u=h.clientY}},!1),document.addEventListener("keydown",h=>{c[h.code]=!0}),document.addEventListener("keyup",h=>{c[h.code]=!1})},W=l=>{const a=l*(s?25:8);c.KeyW&&r.velocity.add(P().multiplyScalar(a)),c.KeyS&&r.velocity.add(P().multiplyScalar(-a)),c.KeyA&&r.velocity.add(C().multiplyScalar(-a)),c.KeyD&&r.velocity.add(C().multiplyScalar(a)),s&&c.Space&&(r.velocity.y=8)},P=()=>(n.getWorldDirection(r.direction),r.direction.y=0,r.direction.normalize(),r.direction),C=()=>(n.getWorldDirection(r.direction),r.direction.y=0,r.direction.normalize(),r.direction.cross(n.up),r.direction),E=()=>{const l=d.capsuleIntersect(r.geometry);s=!1,l&&(s=l.normal.y>0,s||r.velocity.addScaledVector(l.normal,-l.normal.dot(r.velocity)),r.geometry.translate(l.normal.multiplyScalar(l.depth)))},F=l=>{let a=Math.exp(-4*l)-1;s||(r.velocity.y-=he*l,a*=.1),r.velocity.addScaledVector(r.velocity,a);const u=r.velocity.clone().multiplyScalar(l);r.geometry.translate(u),E(),n.position.copy(r.geometry.end)},L=()=>{const l=Math.min(.05,t.getDelta());W(l),F(l),e.render(o,n),requestAnimationFrame(L)};return ie(()=>{f(),y()}),(l,a)=>(ae(),re("div",de))}});export{ye as default};
