/* ===== Har table ka config: [column, label, type, required] ===== */
const CFG = {
  projects: { label:'Projects', title:'title', sub:'category', img:'image_url', order:['created_at',false], fields:[
    ['title','Title','text',1],['description','Description','textarea'],['category','Category (Website / PHP / E-commerce)','text'],
    ['tech','Tech (comma separated)','array'],['demo_url','Live demo URL','text'],['github_url','GitHub URL','text'],['image_url','Screenshot','image']]},
  team: { label:'Team', title:'name', sub:'role', img:'photo_url', order:['sort_order',true], fields:[
    ['name','Name','text',1],['role','Role','text'],['skills','Skills (comma separated)','array'],['linkedin_url','LinkedIn URL','text'],
    ['github_url','GitHub URL','text'],['sort_order','Order (0 = first)','number'],['photo_url','Photo','image']]},
  reviews: { label:'Reviews', title:'client_name', sub:'review_text', img:'photo_url', order:['created_at',false], fields:[
    ['client_name','Client name','text',1],['stars','Stars (1-5)','number'],['review_text','Review','textarea'],
    ['photo_url','Client photo','image'],['approved','Approved (show on site)','checkbox']]},
  messages: { label:'Messages', title:'name', sub:'message', order:['created_at',false], readonly:true, fields:[]}
};
const $ = s => document.querySelector(s);
const esc = t => String(t ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
let cur = 'projects', rows = [], editing = null;

function toast(m){ const t=$('#toast'); t.textContent=m; t.classList.add('show'); setTimeout(()=>t.classList.remove('show'),2200); }

/* ===== AUTH ===== */
async function checkSession(){
  const { data } = await db.auth.getSession();
  data.session ? showDashboard() : showLogin();
}
function showLogin(){ $('#login').classList.remove('hide'); $('#dash').classList.add('hide'); }
function showDashboard(){
  $('#login').classList.add('hide'); $('#dash').classList.remove('hide');
  $('#tabs').innerHTML = Object.keys(CFG).map(k=>`<button data-t="${k}">${CFG[k].label}</button>`).join('');
  switchTab('projects');
}
async function login(){
  const { error } = await db.auth.signInWithPassword({ email:$('#email').value.trim(), password:$('#password').value });
  if (error) return alert(error.message);
  showDashboard();
}
async function logout(){ await db.auth.signOut(); showLogin(); }

/* ===== READ ===== */
function switchTab(t){
  cur = t; $('#ttl').textContent = CFG[t].label;
  $('#addBtn').classList.toggle('hide', !!CFG[t].readonly);
  document.querySelectorAll('#tabs button').forEach(b=>b.classList.toggle('on', b.dataset.t===t));
  loadList();
}
async function loadList(){
  const c = CFG[cur];
  const { data, error } = await db.from(cur).select('*').order(c.order[0], { ascending:c.order[1] });
  if (error) { $('#list').innerHTML = `<p>${esc(error.message)}</p>`; return; }
  rows = data; renderList();
}
function renderList(){
  const c = CFG[cur];
  if (!rows.length) { $('#list').innerHTML = '<p style="color:var(--mut)">Abhi kuch nahi hai.</p>'; return; }
  $('#list').innerHTML = rows.map(r => `
    <div class="item">
      ${c.img && r[c.img] ? `<img src="${esc(r[c.img])}" alt="">` : ''}
      <div class="t"><b>${esc(r[c.title])}</b>
        ${cur==='reviews' ? `<span class="badge ${r.approved?'ok':''}">${r.approved?'Approved':'Pending'}</span>` : ''}
        <small>${esc((r[c.sub]||'').toString().slice(0,140))}</small>
        ${cur==='messages' ? `<small>${esc(r.email||'')} ${esc(r.phone||'')} · ${new Date(r.created_at).toLocaleString()}</small>` : ''}
      </div>
      <div class="act">
        ${cur==='reviews' ? `<button class="ghost" data-a="approve" data-id="${r.id}">${r.approved?'Unapprove':'Approve'}</button>` : ''}
        ${c.readonly ? '' : `<button class="ghost" data-a="edit" data-id="${r.id}">Edit</button>`}
        <button class="del" data-a="del" data-id="${r.id}">Delete</button>
      </div>
    </div>`).join('');
}

/* ===== CREATE / UPDATE form ===== */
function openForm(row){
  editing = row || null;
  const c = CFG[cur];
  $('#frm').innerHTML = `<h3>${row?'Edit':'Add'} ${c.label.replace(/s$/,'')}</h3>` + c.fields.map(([k,l,t,req]) => {
    const v = row ? row[k] : '';
    if (t==='textarea') return `<div><label>${l}</label><textarea name="${k}">${esc(v)}</textarea></div>`;
    if (t==='array') return `<div><label>${l}</label><input name="${k}" value="${esc((v||[]).join(', '))}"></div>`;
    if (t==='number') return `<div><label>${l}</label><input type="number" name="${k}" value="${esc(v ?? (k==='stars'?5:0))}"></div>`;
    if (t==='checkbox') return `<label><input type="checkbox" name="${k}" ${v?'checked':''} style="width:auto"> ${l}</label>`;
    if (t==='image') return `<div><label>${l}</label>${v?`<img src="${esc(v)}" alt="" style="width:70px;border-radius:8px;display:block;margin-bottom:6px">`:''}<input type="file" name="${k}" accept="image/*"></div>`;
    return `<div><label>${l}${req?' *':''}</label><input name="${k}" value="${esc(v)}" ${req?'required':''}></div>`;
  }).join('') + `<div style="display:flex;gap:10px;justify-content:flex-end"><button type="button" class="ghost" id="cancel">Cancel</button><button type="submit">Save</button></div>`;
  $('#dlg').showModal();
}

async function uploadImage(file){
  const name = file.name.replace(/[^a-zA-Z0-9._-]/g,'_');
  const path = `${cur}/${Date.now()}-${name}`;
  const { error } = await db.storage.from('images').upload(path, file);
  if (error) throw error;
  return db.storage.from('images').getPublicUrl(path).data.publicUrl;
}

async function save(e){
  e.preventDefault();
  const c = CFG[cur], fd = new FormData($('#frm')), out = {};
  const btn = $('#frm button[type=submit]'); btn.disabled = true; btn.textContent = 'Saving...';
  try {
    for (const [k,,t] of c.fields) {
      if (t==='array') out[k] = (fd.get(k)||'').split(',').map(s=>s.trim()).filter(Boolean);
      else if (t==='number') out[k] = Number(fd.get(k)) || 0;
      else if (t==='checkbox') out[k] = fd.get(k) === 'on';
      else if (t==='image') { const f = fd.get(k); if (f && f.size) out[k] = await uploadImage(f); }
      else out[k] = (fd.get(k)||'').trim() || null;
    }
    if (cur==='reviews') out.stars = Math.min(5, Math.max(1, out.stars));
    const q = editing ? db.from(cur).update(out).eq('id', editing.id) : db.from(cur).insert(out);
    const { error } = await q;
    if (error) throw error;
    $('#dlg').close(); toast('Saved'); loadList();
  } catch (err) { alert(err.message); }
  btn.disabled = false; btn.textContent = 'Save';
}

/* ===== DELETE + Approve ===== */
async function removeRow(id){
  if (!confirm('Pakka delete karna hai?')) return;
  const { error } = await db.from(cur).delete().eq('id', id);
  if (error) return alert(error.message);
  toast('Deleted'); loadList();
}
async function toggleApprove(id){
  const r = rows.find(x=>x.id===id);
  const { error } = await db.from('reviews').update({ approved: !r.approved }).eq('id', id);
  if (error) return alert(error.message);
  loadList();
}

/* ===== Events ===== */
$('#loginBtn').onclick = login;
$('#password').addEventListener('keydown', e => e.key==='Enter' && login());
$('#logoutBtn').onclick = logout;
$('#addBtn').onclick = () => openForm(null);
$('#tabs').onclick = e => e.target.dataset.t && switchTab(e.target.dataset.t);
$('#frm').addEventListener('submit', save);
$('#frm').addEventListener('click', e => e.target.id==='cancel' && $('#dlg').close());
$('#list').onclick = e => {
  const b = e.target.closest('button[data-a]'); if (!b) return;
  const id = b.dataset.id, a = b.dataset.a;
  if (a==='edit') openForm(rows.find(r=>r.id===id));
  if (a==='del') removeRow(id);
  if (a==='approve') toggleApprove(id);
};
checkSession();
