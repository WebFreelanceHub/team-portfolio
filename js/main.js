/* ===== DATA (baad mein Supabase se aayega; same field names rakhe hain) ===== */
const team=[
 {name:'Anuja Chavan',role:'PHP & Backend Developer',skills:['PHP','MySQL','Supabase'],photo_url:'images/anuja.jpg'},
 {name:'Minal',role:'Frontend Developer',skills:['HTML','CSS','JavaScript'],photo_url:'images/minal.jpg'},
 {name:'Pinky',role:'UI / UX Designer',skills:['Figma','CSS','Branding'],photo_url:'images/pinky.jpg'},
 {name:'Member 4',role:'Full-stack Developer',skills:['JS','PHP','SEO'],photo_url:'images/member4.jpg'}];
const projects=[
 {title:'Restaurant Website',description:'Menu, gallery and table booking.',tech:['HTML','CSS','JS'],category:'Website',image_url:'images/project-1.jpg',demo_url:'#',github_url:'#'},
 {title:'Gym Website',description:'Plans, trainers and enquiry form.',tech:['HTML','CSS','JS'],category:'Website',image_url:'images/project-2.jpg',demo_url:'#',github_url:'#'},
 {title:'Event Planner',description:'Event packages with PHP admin panel.',tech:['PHP','MySQL'],category:'PHP',image_url:'images/project-3.jpg',demo_url:'#',github_url:'#'},
 {title:'Shop Catalogue',description:'Online product catalogue with cart.',tech:['PHP','JS'],category:'E-commerce',image_url:'images/project-4.jpg',demo_url:'#',github_url:'#'}];
const reviews=[
 {client_name:'Client Name',stars:5,review_text:'Fast delivery and the site looks amazing on mobile.'},
 {client_name:'Client Name',stars:5,review_text:'They understood our shop and made it simple to order online.'},
 {client_name:'Client Name',stars:4,review_text:'Good communication and support even after launch.'}];
const faqs=[
 ['How long does a website take?','Usually 1 to 3 weeks, depending on pages and features.'],
 ['How does payment work?','50% advance to start, 50% before launch.'],
 ['Do you give support after launch?','Yes. First month free support, then optional maintenance.']];
const tech=['HTML','CSS','JavaScript','PHP','MySQL','Supabase','WordPress','Figma','GitHub','SEO'];

const $=s=>document.querySelector(s);

/* ===== RENDER ===== */
$('#marquee').innerHTML=[...tech,...tech].map(t=>`<span>✦ ${t}</span>`).join('');
const LIVE=typeof SUPABASE_URL!=='undefined'&&!SUPABASE_URL.includes('YOUR-');
function renderTeam(inst){
 $('#team-grid').innerHTML=team.map(m=>`<div class="card tilt${inst?' in':''}" data-r>
  <div class="avatar">${esc((m.name||'?')[0])}</div>
  <h3>${esc(m.name)}</h3><p>${esc(m.role)}</p><small>${(m.skills||[]).map(esc).join(' • ')}</small></div>`).join('');
 document.querySelectorAll('#team-grid .avatar').forEach((a,k)=>{
  const p=team[k]&&team[k].photo_url;if(!p)return;
  const im=new Image();im.alt=team[k].name;im.loading='lazy';im.onerror=()=>im.remove();im.src=p;a.appendChild(im);
 });
 bindTilt();
}
function renderReviews(inst){
 $('#reviews-grid').innerHTML=reviews.map(r=>`<div class="card tilt${inst?' in':''}" data-r>
  <div class="stars">${'★'.repeat(r.stars)}${'☆'.repeat(5-r.stars)}</div><p>"${esc(r.review_text)}"</p><h3>${esc(r.client_name)}</h3></div>`).join('');
 bindTilt();
}
renderTeam();
if(!LIVE)renderReviews();
$('#faq-list').innerHTML=faqs.map(f=>`<details data-r><summary>${esc(f[0])}</summary><p>${esc(f[1])}</p></details>`).join('');

let ptab='all';
function buildTabs(){
 const n=projects.filter(isLive).length;
 ptab=n?'live':'all';
 $('#tabs').innerHTML=`<button data-t="live" class="${ptab==='live'?'on':''}">Live Projects (${n})</button><button data-t="all" class="${ptab==='all'?'on':''}">All Projects (${projects.length})</button>`;
 showProjects();
}
function showProjects(){
 const list=ptab==='live'?projects.filter(isLive):projects;
 $('#projects-grid').innerHTML=list.slice(0,6).map(projectCard).join('')||'<p class="sub" style="grid-column:1/-1">Projects coming soon.</p>';
 $('#proj-more').innerHTML=projects.length>6?'<a class="btn primary" href="projects.html">See all projects →</a>':'';
 bindTilt();
}
buildTabs();
$('#tabs').addEventListener('click',e=>{
 const b=e.target.closest('button');if(!b)return;
 ptab=b.dataset.t;
 document.querySelectorAll('#tabs button').forEach(x=>x.classList.toggle('on',x===b));
 showProjects();
});

/* ===== EFFECTS ===== */
addEventListener('load',()=>setTimeout(()=>$('#loader').classList.add('done'),700));

// typing roles
const roles=['web developers','PHP experts','shop-website makers','your growth team'];
let ri=0,ci=0,del=false;
(function type(){
 const w=roles[ri];ci+=del?-1:1;$('#typed').textContent=w.slice(0,ci);
 if(!del&&ci===w.length){del=true;return setTimeout(type,1400)}
 if(del&&ci===0){del=false;ri=(ri+1)%roles.length}
 setTimeout(type,del?40:90);
})();

// cursor glow + scroll progress
addEventListener('mousemove',e=>{const g=$('#glow');g.style.left=e.clientX+'px';g.style.top=e.clientY+'px'});
addEventListener('scroll',()=>{
 const h=document.documentElement;
 $('#progress').style.width=(h.scrollTop/(h.scrollHeight-h.clientHeight)*100)+'%';
});

// scroll reveal + counters
const io=new IntersectionObserver(es=>es.forEach(e=>{
 if(!e.isIntersecting)return;
 e.target.classList.add('in');io.unobserve(e.target);
 const n=e.target.querySelector('[data-n]');
 if(n){const to=+n.dataset.n;let v=0;const t=setInterval(()=>{v+=Math.ceil(to/40);if(v>=to){v=to;clearInterval(t)}n.textContent=v},35)}
}),{threshold:.2});
document.querySelectorAll('[data-r]').forEach(el=>io.observe(el));

// 3D tilt on cards
function bindTilt(){
 document.querySelectorAll('.tilt').forEach(c=>{
  if(c._t)return;c._t=1;
  c.addEventListener('mousemove',e=>{
   const r=c.getBoundingClientRect(),x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;
   c.style.transform=`perspective(700px) rotateY(${x*14}deg) rotateX(${-y*14}deg) scale(1.03)`;
  });
  c.addEventListener('mouseleave',()=>c.style.transform='');
 });
}
bindTilt();

// magnetic buttons
document.querySelectorAll('.magnet').forEach(b=>{
 b.addEventListener('mousemove',e=>{const r=b.getBoundingClientRect();
  b.style.transform=`translate(${(e.clientX-r.left-r.width/2)*.25}px,${(e.clientY-r.top-r.height/2)*.35}px)`});
 b.addEventListener('mouseleave',()=>b.style.transform='');
});

// mobile menu
$('#burger').onclick=()=>$('#menu').classList.toggle('open');
$('#menu').onclick=()=>$('#menu').classList.remove('open');

// contact form -> WhatsApp (baad mein Supabase messages table)
$('#contact-form').addEventListener('submit',e=>{
 e.preventDefault();
 const name=$('#f-name').value.trim(),email=$('#f-email').value.trim(),msg=$('#f-msg').value.trim();
 if(LIVE)db.from('messages').insert({name,email,message:msg}).then(({error})=>{if(error)console.error(error)});
 open('https://wa.me/91XXXXXXXXXX?text='+encodeURIComponent(`Hi! I'm ${name} (${email}). ${msg}`),'_blank');
 e.target.reset();
});

/* ================= V2 UPGRADES ================= */
const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
const fine=matchMedia('(pointer: fine)').matches;
const store={get:k=>{try{return localStorage.getItem(k)}catch(e){return null}},set:(k,v)=>{try{localStorage.setItem(k,v)}catch(e){}}};

/* dark / light */
const root=document.documentElement;
root.dataset.theme=store.get('theme')||'dark';
$('#theme').onclick=()=>{const t=root.dataset.theme==='dark'?'light':'dark';root.dataset.theme=t;store.set('theme',t)};

/* text scramble on headings */
function scramble(el){
 if(reduce)return;
 const fin=el.textContent,ch='!<>-_/[]{}=+*^?#';let f=0;
 const id=setInterval(()=>{
  el.textContent=[...fin].map((c,i)=>c===' '||i<f/2?c:ch[Math.random()*ch.length|0]).join('');
  if(++f>fin.length*2){el.textContent=fin;clearInterval(id)}
 },30);
}
const hio=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){scramble(e.target);hio.unobserve(e.target)}}),{threshold:.6});
document.querySelectorAll('.sec h2').forEach(h=>hio.observe(h));

/* custom cursor */
if(fine&&!reduce){
 const d=$('#cdot'),r=$('#cring');let x=0,y=0,rx=0,ry=0;
 addEventListener('mousemove',e=>{x=e.clientX;y=e.clientY;d.style.transform=`translate(${x}px,${y}px)`});
 (function loop(){rx+=(x-rx)*.18;ry+=(y-ry)*.18;r.style.transform=`translate(${rx}px,${ry}px)`;requestAnimationFrame(loop)})();
 document.addEventListener('mouseover',e=>r.classList.toggle('big',!!e.target.closest('a,button,summary,input,textarea,.card')));
}

/* particles in hero */
const cv=$('#fx'),cx=cv.getContext('2d');let W,H,P=[],mouse={x:-999,y:-999};
function sizeFx(){
 W=cv.width=cv.offsetWidth;H=cv.height=cv.offsetHeight;
 P=Array.from({length:Math.min(70,W/18|0)},()=>({x:Math.random()*W,y:Math.random()*H,vx:(Math.random()-.5)*.5,vy:(Math.random()-.5)*.5}));
}
sizeFx();addEventListener('resize',sizeFx);
$('#home').addEventListener('mousemove',e=>{const b=cv.getBoundingClientRect();mouse.x=e.clientX-b.left;mouse.y=e.clientY-b.top});
$('#home').addEventListener('mouseleave',()=>mouse.x=-999);
(function draw(){
 requestAnimationFrame(draw);
 if(reduce||document.hidden||scrollY>innerHeight*1.2)return;
 cx.clearRect(0,0,W,H);
 const col=getComputedStyle(root).getPropertyValue('--cyan').trim()||'#3de0ff';
 cx.fillStyle=cx.strokeStyle=col;
 P.forEach((p,i)=>{
  const dx=p.x-mouse.x,dy=p.y-mouse.y,d=Math.hypot(dx,dy);
  if(d<120){p.x+=dx/d*1.6;p.y+=dy/d*1.6}
  p.x+=p.vx;p.y+=p.vy;
  if(p.x<0||p.x>W)p.vx*=-1;if(p.y<0||p.y>H)p.vy*=-1;
  cx.globalAlpha=.7;cx.beginPath();cx.arc(p.x,p.y,2,0,7);cx.fill();
  for(let j=i+1;j<P.length;j++){
   const q=P[j],l=Math.hypot(p.x-q.x,p.y-q.y);
   if(l<110){cx.globalAlpha=(1-l/110)*.35;cx.beginPath();cx.moveTo(p.x,p.y);cx.lineTo(q.x,q.y);cx.stroke()}
  }
 });
})();

/* parallax: blobs follow mouse, headline drifts on scroll */
if(!reduce){
 $('#home').addEventListener('mousemove',e=>{
  const x=(e.clientX/innerWidth-.5)*40,y=(e.clientY/innerHeight-.5)*40;
  $('#blobs').style.transform=`translate(${x}px,${y}px)`;
 });
 const hero=document.querySelectorAll('.big,.lead,.hero .row');
 addEventListener('scroll',()=>{
  const s=Math.min(scrollY,innerHeight);
  hero.forEach((el,i)=>{el.style.transform=`translateY(${s*(.25-i*.05)}px)`;el.style.opacity=1-s/(innerHeight*.9)});
 });
}

/* chatbot */
const qa={
 'Services':'We build business websites, e-commerce stores and custom PHP apps.',
 'Pricing':'Basic ₹7,999, Standard ₹14,999. E-commerce and PHP apps ka quote project ke hisaab se.',
 'Timeline':'Usually 1 se 3 hafte, pages aur features par depend karta hai.',
 'Contact':'WhatsApp par message karo, hum 24 ghante mein reply karte hain.'};
document.body.insertAdjacentHTML('beforeend',`
<button class="chat-btn" id="cbtn" aria-label="Open chat">🤖</button>
<div class="chat" id="chat" role="dialog" aria-label="Chat">
 <header>Hi! Kuch poochna hai?</header>
 <div class="msgs" id="msgs"><div class="m bot">Neeche se ek option chuno:</div></div>
 <div class="qr" id="qr">${Object.keys(qa).map(k=>`<button>${k}</button>`).join('')}<a href="https://wa.me/91XXXXXXXXXX" target="_blank" rel="noopener">WhatsApp</a></div>
</div>`);
$('#cbtn').onclick=()=>$('#chat').classList.toggle('open');
$('#qr').addEventListener('click',e=>{
 if(e.target.tagName!=='BUTTON')return;
 const k=e.target.textContent,m=$('#msgs');
 m.insertAdjacentHTML('beforeend',`<div class="m me">${k}</div>`);
 setTimeout(()=>{m.insertAdjacentHTML('beforeend',`<div class="m bot">${qa[k]}</div>`);m.scrollTop=m.scrollHeight},400);
});

/* ===== LIVE DATA (Supabase) ===== */
(async function loadLive(){
 if(!LIVE)return;
 try{
  const [t,p,r]=await Promise.all([
   db.from('team').select('*').order('sort_order'),
   db.from('projects').select('*').order('created_at',{ascending:false}),
   db.from('reviews').select('*').eq('approved',true).order('created_at',{ascending:false})]);
  if(t.data&&t.data.length){team.length=0;team.push(...t.data);renderTeam(true)}
  if(p.data&&p.data.length){projects.length=0;projects.push(...p.data);buildTabs()}
  reviews.length=0;
  if(r.data&&r.data.length){reviews.push(...r.data);renderReviews(true)}
  else $('#reviews-grid').innerHTML='<div class="card in" data-r style="grid-column:1/-1;max-width:520px;margin:auto;text-align:center"><i>⭐</i><h3>Reviews coming soon</h3><p>Hamare pehle clients ke reviews jaldi yahan dikhenge.</p></div>';
 }catch(err){console.error(err)}
})();
