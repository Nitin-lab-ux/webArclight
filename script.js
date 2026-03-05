document.getElementById('year').textContent = new Date().getFullYear();

function submitLead(e){
  e.preventDefault();
  const msg=document.getElementById('formMsg');
  msg.textContent='Thanks! Strategy team will contact you in 24 hours.';
  e.target.reset();
  return false;
}

// Custom cursor
const dot = document.getElementById('cursor-dot');
const ring = document.getElementById('cursor-ring');
let mx=window.innerWidth/2,my=window.innerHeight/2,rx=mx,ry=my;
window.addEventListener('mousemove',(e)=>{mx=e.clientX;my=e.clientY;dot.style.left=mx+'px';dot.style.top=my+'px';});
(function loop(){rx += (mx-rx)*0.16; ry += (my-ry)*0.16; ring.style.left=rx+'px'; ring.style.top=ry+'px'; requestAnimationFrame(loop);}());

for(const a of document.querySelectorAll('a,button,.card')){
  a.addEventListener('mouseenter',()=>{ring.style.width='52px';ring.style.height='52px';ring.style.borderColor='rgba(45,226,230,.8)';});
  a.addEventListener('mouseleave',()=>{ring.style.width='34px';ring.style.height='34px';ring.style.borderColor='rgba(255,255,255,.45)';});
}

// Magnetic buttons
for(const el of document.querySelectorAll('.magnetic')){
  el.addEventListener('mousemove',(e)=>{
    const r=el.getBoundingClientRect();
    const x=e.clientX-r.left-r.width/2; const y=e.clientY-r.top-r.height/2;
    el.style.transform=`translate(${x*0.12}px,${y*0.12}px)`;
  });
  el.addEventListener('mouseleave',()=>el.style.transform='translate(0,0)');
}

// Card tilt
for(const card of document.querySelectorAll('.tilt')){
  card.addEventListener('mousemove',(e)=>{
    const r=card.getBoundingClientRect();
    const x=(e.clientX-r.left)/r.width-0.5; const y=(e.clientY-r.top)/r.height-0.5;
    card.style.transform=`rotateX(${-y*7}deg) rotateY(${x*9}deg) translateY(-6px)`;
  });
  card.addEventListener('mouseleave',()=>card.style.transform='rotateX(0) rotateY(0) translateY(0)');
}

// GSAP reveal
if(window.gsap){
  gsap.registerPlugin(ScrollTrigger);
  gsap.to('.hero-panel',{y:-8,repeat:-1,yoyo:true,duration:3.2,ease:'sine.inOut'});
  gsap.utils.toArray('.reveal').forEach((el)=>{
    gsap.to(el,{opacity:1,y:0,duration:0.9,ease:'power2.out',scrollTrigger:{trigger:el,start:'top 86%'}});
  });
}

// Three.js background
const canvas=document.getElementById('bg3d');
const scene=new THREE.Scene();
const camera=new THREE.PerspectiveCamera(65,window.innerWidth/window.innerHeight,0.1,1000);
camera.position.z=8;
const renderer=new THREE.WebGLRenderer({canvas,antialias:true,alpha:true});
renderer.setPixelRatio(Math.min(window.devicePixelRatio,2));
renderer.setSize(window.innerWidth,window.innerHeight);

const geo=new THREE.TorusKnotGeometry(1.6,0.42,160,22);
const mat=new THREE.MeshStandardMaterial({color:0x6b7cff,metalness:0.65,roughness:0.18,wireframe:false});
const knot=new THREE.Mesh(geo,mat);
scene.add(knot);

const starsGeo=new THREE.BufferGeometry();
const starCount=900;
const arr=new Float32Array(starCount*3);
for(let i=0;i<starCount*3;i++) arr[i]=(Math.random()-0.5)*50;
starsGeo.setAttribute('position',new THREE.BufferAttribute(arr,3));
const stars=new THREE.Points(starsGeo,new THREE.PointsMaterial({size:0.03,color:0x9bb2ff}));
scene.add(stars);

scene.add(new THREE.AmbientLight(0x9bb2ff,0.35));
const d=new THREE.DirectionalLight(0x2de2e6,1.2); d.position.set(5,5,5); scene.add(d);

window.addEventListener('mousemove',(e)=>{
  const x=(e.clientX/window.innerWidth-0.5); const y=(e.clientY/window.innerHeight-0.5);
  gsap.to(knot.rotation,{x:y*1.2,y:x*1.8,duration:1.3,ease:'power2.out'});
});

window.addEventListener('scroll',()=>{
  const s=window.scrollY*0.0012;
  knot.rotation.z=s*2.2;
  stars.rotation.y=s*0.7;
});

function animate(){
  requestAnimationFrame(animate);
  knot.rotation.x += 0.0024;
  knot.rotation.y += 0.002;
  renderer.render(scene,camera);
}
animate();

window.addEventListener('resize',()=>{
  camera.aspect=window.innerWidth/window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth,window.innerHeight);
});
