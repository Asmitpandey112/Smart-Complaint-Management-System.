(function(){
  // ---------- Config ----------
  const API = 'http://localhost:3000/api';
  const root = document.body;
  root.style.margin = '0';
  root.style.fontFamily = 'system-ui, sans-serif';
  root.style.background = '#f3f4f6';
  // ---------- Helper ----------
  const el = (tag, opts = {}, ...children) => {
    const element = document.createElement(tag);
    Object.entries(opts).forEach(([k,v])=>{
      if(k==='class') element.className=v;
      else if(k==='style') Object.assign(element.style,v);
      else if(k.startsWith('on')) element.addEventListener(k.slice(2), v);
      else element.setAttribute(k,v);
    });
    children.flat().forEach(c=>{
      if(typeof c==='string') element.appendChild(document.createTextNode(c));
      else if(c) element.appendChild(c);
    });
    return element;
  };
  // ---------- Theme ----------
  const toggleTheme = () => {
    document.documentElement.classList.toggle('dark');
    const isDark = document.documentElement.classList.contains('dark');
    localStorage.setItem('theme', isDark? 'dark':'light');
    btnTheme.textContent = isDark? '☀️':'🌙';
  };
  const savedTheme = localStorage.getItem('theme');
  if(savedTheme==='dark') document.documentElement.classList.add('dark');
  // ---------- Header ----------
  const header = el('header', {class:'flex justify-between items-center p-4 bg-white shadow'},
    el('h1',{class:'text-xl font-bold'},'Smart Resolve AI'),
    btnTheme = el('button',{class:'px-3 py-1 rounded bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200',onclick:toggleTheme},'🌙')
  );
  root.appendChild(header);
  // ---------- KPI ----------
  const kpiContainer = el('section',{class:'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 p-4'});
  const makeKpi = (label,id)=>el('div',{class:'bg-white p-4 rounded-xl shadow'},
    el('p',{class:'text-xs text-gray-500 uppercase'},label),
    el('p',{class:'text-2xl font-bold',id},'0')
  );
  const kTotal = makeKpi('Total Tickets','kTotal');
  const kPending = makeKpi('Pending','kPending');
  const kProgress = makeKpi('In‑Progress','kProgress');
  const kResolved = makeKpi('Resolved','kResolved');
  kpiContainer.append(kTotal,kPending,kProgress,kResolved);
  root.appendChild(kpiContainer);
  // ---------- Kanban ----------
  const cols = ['Pending','In Progress','Escalated','Resolved'];
  const colMap = {'Pending':'pending','"In Progress"':'inprogress','Escalated':'escalated','Resolved':'resolved'};
  const kanbanSec = el('section',{class:'grid grid-cols-1 md:grid-cols-4 gap-4 p-4'});
  const colElements = {};
  cols.forEach(status=>{
    const colId = status.toLowerCase().replace(/ /g,'');
    const container = el('div',{class:'bg-gray-100 p-3 rounded-xl min-h-[300px]'});
    const title = el('h2',{class:'font-semibold text-sm mb-2'}, status);
    const inner = el('div',{id:`kanban-${colId}`,class:'space-y-2'});
    container.append(title,inner);
    colElements[status]=inner;
    kanbanSec.appendChild(container);
    // drop handlers
    container.addEventListener('dragover',e=>{e.preventDefault();container.classList.add('bg-blue-100');});
    container.addEventListener('dragleave',()=>container.classList.remove('bg-blue-100'));
    container.addEventListener('drop',async e=>{
      e.preventDefault();container.classList.remove('bg-blue-100');
      const id = e.dataTransfer.getData('text/plain');
      const res = await fetch(`${API}/complaints/${id}`,{method:'PATCH',headers:{'Content-Type':'application/json'},body:JSON.stringify({status, note:`Moved via UI to ${status}`} )});
      const json = await res.json();
      if(json.success) loadTickets();
    });
  });
  root.appendChild(kanbanSec);
  // ---------- New complaint form ----------
  const formSec = el('section',{class:'bg-white p-4 rounded-xl shadow m-4'});
  const form = el('form',{id:'newForm'} ,
    el('h2',{class:'text-lg font-semibold mb-2'},'File New Complaint'),
    el('input',{type:'text',placeholder:'Title',required:true,class:'border rounded w-full p-1 mb-2',id:'fTitle'}),
    el('textarea',{placeholder:'Description',required:true,class:'border rounded w-full p-1 mb-2',id:'fDesc'}),
    el('input',{type:'text',placeholder:'Location',required:true,class:'border rounded w-full p-1 mb-2',id:'fLocation'}),
    el('button',{type:'submit',class:'bg-blue-600 text-white py-1 px-3 rounded'},'Submit')
  );
  formSec.appendChild(form);
  root.appendChild(formSec);
  // ---------- Load tickets ----------
  async function loadTickets(){
    const res = await fetch(`${API}/complaints`);
    const data = await res.json();
    if(!data.success){return;}
    const tickets = data.data;
    // update KPIs
    document.getElementById('kTotal').innerText = tickets.length;
    document.getElementById('kPending').innerText = tickets.filter(t=>t.status==='Pending').length;
    document.getElementById('kProgress').innerText = tickets.filter(t=>t.status==='In Progress').length;
    document.getElementById('kResolved').innerText = tickets.filter(t=>t.status==='Resolved').length;
    // clear cols
    Object.values(colElements).forEach(c=>c.innerHTML='');
    tickets.forEach(t=>{
      const card = el('div',{class:'bg-white p-2 rounded border shadow-sm cursor-grab',draggable:true, 'data-id':t.id});
      card.addEventListener('dragstart',e=>e.dataTransfer.setData('text/plain',t.id));
      card.innerHTML = `<strong>${t.title}</strong><br/><small class='text-gray-500'>${t.location}</small>`;
      const target = colElements[t.status];
      if(target) target.appendChild(card);
    });
  }
  // ---------- Form submit ----------
  form.addEventListener('submit',async e=>{
    e.preventDefault();
    const payload = {
      title: document.getElementById('fTitle').value,
      description: document.getElementById('fDesc').value,
      location: document.getElementById('fLocation').value,
      categoryOverride:'', imageUrl:'', phone:''
    };
    const res = await fetch(`${API}/complaints`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(payload)});
    const json = await res.json();
    if(json.success){alert('Created'); form.reset(); loadTickets();} else {alert('Error:'+ (json.message||'Failed'));}
  });
  // initial load
  loadTickets();
})();