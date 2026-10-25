const $=s=>document.querySelector(s);
try{document.documentElement.dataset.theme=localStorage.getItem('theme')||'dark'}catch(e){}
let projects=[],tab='all';

function show(){
 const list=tab==='live'?projects.filter(isLive):projects;
 $('#projects-grid').innerHTML=list.map(projectCard).join('')||'<p class="sub" style="grid-column:1/-1">Projects coming soon.</p>';
}
function tabs(){
 const n=projects.filter(isLive).length;
 tab=n?'live':'all';
 $('#tabs').innerHTML=`<button data-t="live" class="${tab==='live'?'on':''}">Live Projects (${n})</button><button data-t="all" class="${tab==='all'?'on':''}">All Projects (${projects.length})</button>`;
 show();
}
$('#tabs').addEventListener('click',e=>{
 const b=e.target.closest('button');if(!b)return;
 tab=b.dataset.t;
 document.querySelectorAll('#tabs button').forEach(x=>x.classList.toggle('on',x===b));
 show();
});
(async()=>{
 try{
  const {data,error}=await db.from('projects').select('*').order('created_at',{ascending:false});
  if(error)throw error;
  projects=data||[];
 }catch(err){console.error(err)}
 tabs();
})();
