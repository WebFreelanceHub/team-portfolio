/* Shared helpers: index.html aur projects.html dono use karte hain */
const esc=t=>String(t??'').replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const isUrl=u=>!!u&&u.trim()!==''&&u.trim()!=='#';
// Live project = jisme Live Demo URL ho
const isLive=p=>isUrl(p.demo_url);

function projectCard(p){
 const chips=(p.tech||[]).map(t=>`<span>${esc(t)}</span>`).join('');
 const live=isUrl(p.demo_url)?`<a class="fill" href="${esc(p.demo_url)}" target="_blank" rel="noopener">Live Demo ↗</a>`:'';
 const git=isUrl(p.github_url)?`<a href="${esc(p.github_url)}" target="_blank" rel="noopener">GitHub</a>`:'';
 return `<article class="card pcard tilt in" data-r>
  <div class="thumb">
   ${p.image_url?`<img src="${esc(p.image_url)}" alt="${esc(p.title)} website screenshot" loading="lazy" onerror="this.remove()">`:''}
   ${p.category?`<span class="tag">${esc(p.category)}</span>`:''}
  </div>
  <div class="pbody">
   <h3>${esc(p.title)}</h3>
   <p>${esc(p.description)}</p>
   <div class="chips">${chips}</div>
   <div class="pbtns">${live}${git}</div>
  </div></article>`;
}
