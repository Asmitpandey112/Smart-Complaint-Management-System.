const API_BASE = '/api';
let activeMainTab = 'citizen';
let activeTicketId = null;
let cachedComplaints = [];

// DOM Ready
document.addEventListener('DOMContentLoaded', () => {
  initTheme();



// Toast Notifier
function showToast(message, isError = false) {
  const toast = document.getElementById('toast');
  const toastMsg = document.getElementById('toast-message');
  const toastIcon = document.getElementById('toast-icon');

  toastMsg.innerText = message;
  toastIcon.innerText = isError ? "⚠️" : "✅";
  toast.className = `fixed top-5 right-5 z-50 px-4 py-3 rounded-xl shadow-2xl flex items-center space-x-2 text-sm font-semibold toast-slide ${
    isError ? 'bg-rose-600 text-white' : 'bg-emerald-600 text-white'
  }`;

  toast.classList.remove('hidden');
  setTimeout(() => {
    toast.classList.add('hidden');
  }, 3000);
}

// Tab Switching Handler
function switchMainTab(tabName) {
  activeMainTab = tabName;

  const tabs = ['citizen', 'admin', 'kanban', 'map'];
  tabs.forEach(t => {
    const navBtn = document.getElementById(`nav-${t}`);
    const sec = document.getElementById(`tab-${t}`);
    if (navBtn && sec) {
      if (t === tabName) {
        navBtn.className = "px-3.5 py-1.5 rounded-lg transition-all duration-200 bg-blue-600 text-white shadow-sm flex items-center space-x-1.5";
        sec.classList.remove('hidden');
      } else {
        navBtn.className = "px-3.5 py-1.5 rounded-lg transition-all duration-200 text-[var(--muted-foreground)] hover:text-[var(--foreground)] flex items-center space-x-1.5";
        sec.classList.add('hidden');
      }
    }
  });

  if (tabName === 'citizen') fetchCitizenComplaints();
  if (tabName === 'admin') { fetchAnalytics(); fetchAdminTable(); }
  if (tabName === 'kanban') fetchKanbanBoard();
  if (tabName === 'map') renderGeoMapPins();
}

// Modal Control
function openModal(id) {
  document.getElementById(id).classList.remove('hidden');
}

function closeModal(id) {
  document.getElementById(id).classList.add('hidden');
}

// 1. Citizen Portal Complaints
async function fetchCitizenComplaints() {
  const filter = document.getElementById('c-filter-status').value;
  try {
    const res = await fetch(`${API_BASE}/complaints?status=${filter}`);
    const json = await res.json();
    if (!json.success) return;

    cachedComplaints = json.data;
    const listContainer = document.getElementById('citizen-list-container');
    const list = json.data;

    document.getElementById('c-stat-total').innerText = list.length;
    document.getElementById('c-stat-pending').innerText = list.filter(c => c.status === 'Pending').length;
    document.getElementById('c-stat-inprogress').innerText = list.filter(c => c.status === 'In Progress').length;
    document.getElementById('c-stat-resolved').innerText = list.filter(c => c.status === 'Resolved').length;

    if (list.length === 0) {
      listContainer.innerHTML = `<div class="text-center py-8 text-[var(--muted-foreground)] text-sm">No complaints registered under this status.</div>`;
      return;
    }

    listContainer.innerHTML = list.map(c => `
      <div onclick="openTicketDetail('${c.id}')" class="p-4 border border-[var(--border)] rounded-2xl hover:border-blue-500/50 hover:shadow-lg transition-all cursor-pointer bg-[var(--background)]/50 space-y-3">
        <div class="flex flex-wrap items-center justify-between gap-2">
          <div class="flex items-center space-x-2">
            <span class="font-mono font-bold text-xs bg-blue-500/10 text-blue-500 px-2.5 py-1 rounded-lg">${c.id}</span>
            ${getUrgencyBadge(c.urgency)}
          </div>
          <div>${getStatusBadge(c.status)}</div>
        </div>

        <h4 class="font-bold text-base text-[var(--foreground)]">${c.title}</h4>
        <p class="text-xs text-[var(--muted-foreground)] line-clamp-2">${c.description}</p>

        ${c.imageUrl ? `<img src="${c.imageUrl}" class="w-full h-32 object-cover rounded-xl border border-[var(--border)]">` : ''}

        <div class="flex flex-wrap items-center justify-between pt-2 border-t border-[var(--border)]/50 text-xs text-[var(--muted-foreground)]">
          <span>📍 ${c.location} • 🏢 ${c.category}</span>
          <span>📅 ${c.createdAt}</span>
        </div>
      </div>
    `).join('');
  } catch (err) {
    console.error(err);
    showToast("Server connection error", true);
  }
}

// 2. AI Live Preview
async function triggerAiPreview() {
  const title = document.getElementById('f-title').value;
  const desc = document.getElementById('f-desc').value;
  if (!title && !desc) return;

  try {
    const res = await fetch(`${API_BASE}/ai/analyze`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, description: desc })
    });
    const json = await res.json();
    if (json.success) {
      document.getElementById('ai-preview-dept').innerText = json.data.category;
      document.getElementById('ai-preview-urgency').innerText = `${json.data.urgency} (${json.data.score}/100)`;
    }
  } catch (err) {
    console.error(err);
  }
}

// Preset Images & GPS
function presetImage(type) {
  const input = document.getElementById('f-imgurl');
  if (type === 'pothole') input.value = "https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?w=400&auto=format&fit=crop&q=60";
  if (type === 'electrical') input.value = "https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=400&auto=format&fit=crop&q=60";
  if (type === 'trash') input.value = "https://images.unsplash.com/photo-1530587191325-3db32d826c18?w=400&auto=format&fit=crop&q=60";
}

function autoFillGpsLocation() {
  document.getElementById('f-location').value = "Sector 14, Central Zone (GPS: 18.5204° N, 73.8567° E)";
  showToast("GPS coordinates acquired!");
}

// 3. Submit New Complaint
async function submitNewComplaint(e) {
  e.preventDefault();
  const title = document.getElementById('f-title').value;
  const desc = document.getElementById('f-desc').value;
  const categoryOverride = document.getElementById('f-dept').value;
  const location = document.getElementById('f-location').value;
  const imageUrl = document.getElementById('f-imgurl').value;
  const phone = document.getElementById('f-phone').value;

  try {
    const res = await fetch(`${API_BASE}/complaints`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, description: desc, categoryOverride, location, imageUrl, phone })
    });
    const json = await res.json();
    if (json.success) {
      showToast(`Complaint #${json.data.id} registered!`);
      closeModal('new-modal');
      document.getElementById('new-form').reset();
      fetchCitizenComplaints();
      fetchAnalytics();
      fetchAdminTable();
    } else {
      showToast(json.message || "Failed to submit", true);
    }
  } catch (err) {
    showToast("Error connecting to REST API", true);
  }
}

// 4. Admin Table
async function fetchAdminTable() {
  const search = document.getElementById('a-search').value;
  const dept = document.getElementById('a-filter-dept').value;
  const priority = document.getElementById('a-filter-priority').value;

  try {
    const res = await fetch(`${API_BASE}/complaints?search=${encodeURIComponent(search)}&category=${dept}&priority=${priority}`);
    const json = await res.json();
    if (!json.success) return;

    const tbody = document.getElementById('admin-table-body');
    tbody.innerHTML = json.data.map(c => `
      <tr class="hover:bg-[var(--background)]/50 transition-colors">
        <td class="py-3 px-3 font-mono font-bold text-xs text-blue-500">${c.id}</td>
        <td class="py-3 px-3">
          <div class="font-semibold text-[var(--foreground)]">${c.title}</div>
          <div class="text-xs text-[var(--muted-foreground)]">${c.category} • Staff: ${c.assignedStaff}</div>
        </td>
        <td class="py-3 px-3 text-xs text-[var(--muted-foreground)]">${c.location}</td>
        <td class="py-3 px-3">
          ${getUrgencyBadge(c.urgency)}
          <div class="text-[11px] font-mono text-[var(--muted-foreground)] mt-0.5">Score: ${c.score}/100</div>
        </td>
        <td class="py-3 px-3">${getStatusBadge(c.status)}</td>
        <td class="py-3 px-3 text-right">
          <button onclick="openTicketDetail('${c.id}')" class="px-3 py-1 bg-blue-600/10 hover:bg-blue-600/20 text-blue-600 font-semibold rounded-lg text-xs transition-all">
            Inspect & Act
          </button>
        </td>
      </tr>
    `).join('');
  } catch (err) {
    console.error(err);
  }
}

// 5. Analytics
async function fetchAnalytics() {
  try {
    const res = await fetch(`${API_BASE}/analytics`);
    const json = await res.json();
    if (!json.success) return;

    const d = json.data;
    document.getElementById('a-stat-total').innerText = d.total;
    document.getElementById('a-stat-critical').innerText = d.critical;
    document.getElementById('a-stat-csat').innerText = `${d.csatScore} / 5.0`;

    const chartContainer = document.getElementById('dept-chart-container');
    const total = d.total || 1;
    chartContainer.innerHTML = Object.entries(d.deptCounts).map(([dept, count]) => {
      const pct = Math.round((count / total) * 100);
      return `
        <div>
          <div class="flex justify-between text-xs font-semibold mb-1">
            <span>${dept}</span>
            <span>${pct}% (${count} tickets)</span>
          </div>
          <div class="w-full bg-[var(--background)] rounded-full h-3 border border-[var(--border)] overflow-hidden">
            <div class="bg-gradient-to-r from-blue-600 to-indigo-600 h-3 rounded-full transition-all duration-500" style="width: ${pct}%"></div>
          </div>
        </div>
      `;
    }).join('');
  } catch (err) {
    console.error(err);
  }
}

// 6. Interactive Kanban Board
async function fetchKanbanBoard() {
  try {
    const res = await fetch(`${API_BASE}/complaints`);
    const json = await res.json();
    if (!json.success) return;

    const list = json.data;

    const pList = list.filter(c => c.status === 'Pending');
    const iList = list.filter(c => c.status === 'In Progress');
    const eList = list.filter(c => c.status === 'Escalated');
    const rList = list.filter(c => c.status === 'Resolved');

    document.getElementById('k-count-pending').innerText = pList.length;
    document.getElementById('k-count-inprogress').innerText = iList.length;
    document.getElementById('k-count-escalated').innerText = eList.length;
    document.getElementById('k-count-resolved').innerText = rList.length;

    renderKanbanColumn('k-col-pending', pList, 'In Progress');
    renderKanbanColumn('k-col-inprogress', iList, 'Resolved');
    renderKanbanColumn('k-col-escalated', eList, 'In Progress');
    renderKanbanColumn('k-col-resolved', rList, null);

  } catch (err) {
    console.error(err);
  }
}

function renderKanbanColumn(elementId, items, nextStatus) {
  const col = document.getElementById(elementId);
  if (items.length === 0) {
    col.innerHTML = `<div class="text-center py-8 text-xs text-[var(--muted-foreground)]">No tickets</div>`;
    return;
  }

  // Make column a drop zone
  col.addEventListener('dragover', e => {
    e.preventDefault();
    col.classList.add('bg-blue-100/20'); // highlight
  });
  col.addEventListener('dragleave', () => {
    col.classList.remove('bg-blue-100/20');
  });
  col.addEventListener('drop', async e => {
    e.preventDefault();
    col.classList.remove('bg-blue-100/20');
    const ticketId = e.dataTransfer.getData('text/plain');
    // Determine target status based on column id
    const statusMap = {
      'k-col-pending': 'Pending',
      'k-col-inprogress': 'In Progress',
      'k-col-escalated': 'Escalated',
      'k-col-resolved': 'Resolved'
    };
    const newStatus = statusMap[elementId];
    if (!newStatus) return;
    // Optimistically update UI then sync with server
    try {
      const res = await fetch(`${API_BASE}/complaints/${ticketId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus, note: `Moved via drag‑and‑drop to ${newStatus}` })
      });
      const json = await res.json();
      if (json.success) {
        showToast(`Ticket #${ticketId} moved to ${newStatus}`);
        fetchKanbanBoard();
        fetchAnalytics();
      } else {
        showToast(json.message || 'Failed to move ticket', true);
      }
    } catch (err) {
      showToast('Error moving ticket', true);
    }
  });

  col.innerHTML = items.map(c => `
    <div draggable="true" ondragstart="handleDragStart(event, '${c.id}')" class="bg-[var(--card)] border border-[var(--border)] p-3 rounded-xl shadow-sm hover:shadow-md transition-all space-y-2 cursor-grab">
      <div class="flex items-center justify-between">
        <span class="font-mono text-[11px] font-bold text-blue-500">${c.id}</span>
        ${getUrgencyBadge(c.urgency)}
      </div>
      <h5 onclick="openTicketDetail('${c.id}')" class="font-bold text-xs hover:text-blue-500 cursor-pointer line-clamp-2">${c.title}</h5>
      <div class="text-[11px] text-[var(--muted-foreground)]">📍 ${c.location}</div>
      ${nextStatus ? `
        <button onclick="quickMoveKanban('${c.id}', '${nextStatus}')" class="w-full text-center bg-blue-500/10 hover:bg-blue-500/20 text-blue-600 font-semibold text-[11px] py-1 rounded-lg transition-all">
          Move → ${nextStatus}
        </button>
      ` : ''}
    </div>
  `).join('');
}

  const col = document.getElementById(elementId);
  if (items.length === 0) {
    col.innerHTML = `<div class="text-center py-8 text-xs text-[var(--muted-foreground)]">No tickets</div>`;
    return;
  }

  col.innerHTML = items.map(c => `
    <div class="bg-[var(--card)] border border-[var(--border)] p-3 rounded-xl shadow-sm hover:shadow-md transition-all space-y-2">
      <div class="flex items-center justify-between">
        <span class="font-mono text-[11px] font-bold text-blue-500">${c.id}</span>
        ${getUrgencyBadge(c.urgency)}
      </div>
      <h5 onclick="openTicketDetail('${c.id}')" class="font-bold text-xs hover:text-blue-500 cursor-pointer line-clamp-2">${c.title}</h5>
      <div class="text-[11px] text-[var(--muted-foreground)]">📍 ${c.location}</div>
      ${nextStatus ? `
        <button onclick="quickMoveKanban('${c.id}', '${nextStatus}')" class="w-full text-center bg-blue-500/10 hover:bg-blue-500/20 text-blue-600 font-semibold text-[11px] py-1 rounded-lg transition-all">
          Move → ${nextStatus}
        </button>
      ` : ''}
    </div>
  `).join('');
}

async function handleDragStart(e, ticketId) {
  e.dataTransfer.setData('text/plain', ticketId);
  e.dataTransfer.effectAllowed = 'move';
}

  try {
    const res = await fetch(`${API_BASE}/complaints/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status, note: `Kanban quick move to ${status}` })
    });
    const json = await res.json();
    if (json.success) {
      showToast(`Ticket #${id} moved to ${status}`);
      fetchKanbanBoard();
      fetchAnalytics();
    }
  } catch (err) {
    showToast("Failed to move ticket", true);
  }
}

// 7. Geo Spatial Risk Heatmap
async function renderGeoMapPins() {
  const container = document.getElementById('map-pins-container');
  try {
    const res = await fetch(`${API_BASE}/complaints`);
    const json = await res.json();
    if (!json.success) return;

    const list = json.data;

    // Simulated coordinate boundaries inside canvas
    // lat: 18.50 - 18.55, lng: 73.84 - 73.88
    container.innerHTML = list.map(c => {
      const topPct = Math.min(90, Math.max(10, ((18.55 - c.lat) / 0.05) * 100));
      const leftPct = Math.min(90, Math.max(10, ((c.lng - 73.84) / 0.04) * 100));

      let pinBg = "bg-blue-500";
      if (c.urgency === 'Critical') pinBg = "bg-rose-600 animate-ping";
      else if (c.urgency === 'High') pinBg = "bg-amber-500";

      return `
        <div onclick="openTicketDetail('${c.id}')" style="top: ${topPct}%; left: ${leftPct}%;" class="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer group z-10">
          <div class="w-6 h-6 rounded-full ${pinBg} text-white flex items-center justify-center font-bold text-[10px] shadow-lg border-2 border-white">
            📍
          </div>
          <!-- Tooltip hover -->
          <div class="hidden group-hover:block absolute bottom-8 left-1/2 transform -translate-x-1/2 bg-slate-900 text-white text-xs p-2.5 rounded-xl shadow-2xl w-48 border border-slate-700 z-30">
            <div class="font-bold">${c.id}: ${c.title}</div>
            <div class="text-[10px] text-slate-400 mt-1">${c.location} • ${c.urgency}</div>
          </div>
        </div>
      `;
    }).join('');
  } catch (err) {
    console.error(err);
  }
}

// 8. Open Ticket Detail Modal
async function openTicketDetail(id) {
  activeTicketId = id;
  try {
    const res = await fetch(`${API_BASE}/complaints/${id}`);
    const json = await res.json();
    if (!json.success) return;

    const t = json.data;
    document.getElementById('m-id').innerText = t.id;
    document.getElementById('m-title').innerText = t.title;
    document.getElementById('m-loc').innerText = t.location;
    document.getElementById('m-dept').innerText = t.category;
    document.getElementById('m-date').innerText = t.createdAt;
    document.getElementById('m-desc').innerText = t.description;
    document.getElementById('m-urgency').innerHTML = getUrgencyBadge(t.urgency);

    // Image view
    const imgContainer = document.getElementById('m-img-container');
    const imgEl = document.getElementById('m-img');
    if (t.imageUrl) {
      imgEl.src = t.imageUrl;
      imgContainer.classList.remove('hidden');
    } else {
      imgContainer.classList.add('hidden');
    }

    // Keywords
    document.getElementById('m-keywords').innerHTML = t.keywords.map(k => `
      <span class="bg-indigo-500/20 text-indigo-400 px-2 py-0.5 rounded text-[11px] font-medium">${k}</span>
    `).join('');

    // Ratings View
    const ratingContent = document.getElementById('m-rating-content');
    if (t.rating) {
      ratingContent.innerHTML = `<span class="text-amber-500 font-bold">${'⭐'.repeat(t.rating)}</span> <span class="font-medium text-[var(--foreground)]">${t.feedback || ''}</span>`;
    } else {
      ratingContent.innerText = "No feedback submitted yet.";
    }

    // Timeline
    document.getElementById('m-timeline').innerHTML = t.timeline.map(item => `
      <div class="relative pl-2">
        <div class="flex items-center justify-between text-[11px] font-bold text-[var(--foreground)]">
          <span>${item.status}</span>
          <span class="text-[var(--muted-foreground)] font-normal">${item.time}</span>
        </div>
        <p class="text-[var(--muted-foreground)] mt-0.5">${item.note}</p>
      </div>
    `).join('');

    // Admin Box vs Citizen Feedback Form
    const adminBox = document.getElementById('admin-actions-box');
    const feedbackForm = document.getElementById('citizen-feedback-form');

    if (activeMainTab === 'admin') {
      adminBox.classList.remove('hidden');
      feedbackForm.classList.add('hidden');
      document.getElementById('u-status').value = t.status;
      document.getElementById('u-staff').value = t.assignedStaff === "Unassigned (Auto-Routing)" ? "" : t.assignedStaff;
      document.getElementById('u-note').value = "";
    } else {
      adminBox.classList.add('hidden');
      if (t.status === 'Resolved' && !t.rating) {
        feedbackForm.classList.remove('hidden');
      } else {
        feedbackForm.classList.add('hidden');
      }
    }

    openModal('detail-modal');
  } catch (err) {
    showToast("Failed to fetch details", true);
  }
}

// 9. Admin Status Update
async function submitAdminUpdate() {
  if (!activeTicketId) return;
  const status = document.getElementById('u-status').value;
  const assignedStaff = document.getElementById('u-staff').value;
  const note = document.getElementById('u-note').value;

  try {
    const res = await fetch(`${API_BASE}/complaints/${activeTicketId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status, assignedStaff, note })
    });
    const json = await res.json();
    if (json.success) {
      showToast(`Ticket #${activeTicketId} updated to ${status}`);
      closeModal('detail-modal');
      fetchCitizenComplaints();
      fetchAdminTable();
      fetchAnalytics();
      fetchKanbanBoard();
      renderGeoMapPins();
    }
  } catch (err) {
    showToast("Error updating ticket via REST API", true);
  }
}

// 10. Auto Generate AI Response
function autoGenerateAiResponse() {
  const dept = document.getElementById('m-dept').innerText;
  const noteInput = document.getElementById('u-note');

  if (dept === 'Electrical') {
    noteInput.value = "Technicians dispatched with transformer repair kit. Power grid isolation in progress.";
  } else if (dept === 'Water Supply') {
    noteInput.value = "Water pipeline maintenance team sent. Pressure testing and pipe replacement initiated.";
  } else if (dept === 'Sanitation') {
    noteInput.value = "Waste collection truck assigned to route. Area disinfection scheduled post-pickup.";
  } else {
    noteInput.value = "Public works inspection team dispatched to site. Materials allocated.";
  }
}

// 11. Citizen Rating Feedback Submission
async function submitCitizenFeedback() {
  if (!activeTicketId) return;
  const rating = parseInt(document.getElementById('fb-rating').value, 10);
  const feedback = document.getElementById('fb-comment').value;

  try {
    const res = await fetch(`${API_BASE}/complaints/${activeTicketId}/feedback`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ rating, feedback })
    });
    const json = await res.json();
    if (json.success) {
      showToast("Thank you for your feedback!");
      closeModal('detail-modal');
      fetchCitizenComplaints();
      fetchAnalytics();
    }
  } catch (err) {
    showToast("Failed to submit feedback", true);
  }
}

// Badges
function getStatusBadge(status) {
  if (status === 'Resolved') {
    return `<span class="bg-emerald-500/10 border border-emerald-500/30 text-emerald-500 font-bold px-2.5 py-0.5 rounded-full text-xs">✅ Resolved</span>`;
  } else if (status === 'In Progress') {
    return `<span class="bg-amber-500/10 border border-amber-500/30 text-amber-500 font-bold px-2.5 py-0.5 rounded-full text-xs">⏳ In Progress</span>`;
  } else if (status === 'Escalated') {
    return `<span class="bg-rose-500/10 border border-rose-500/30 text-rose-500 font-bold px-2.5 py-0.5 rounded-full text-xs">🚨 Escalated</span>`;
  }
  return `<span class="bg-blue-500/10 border border-blue-500/30 text-blue-500 font-bold px-2.5 py-0.5 rounded-full text-xs">📋 Pending</span>`;
}

function getUrgencyBadge(urgency) {
  if (urgency === 'Critical') {
    return `<span class="bg-rose-600 text-white font-bold px-2 py-0.5 rounded text-[10px] uppercase tracking-wide">Critical</span>`;
  } else if (urgency === 'High') {
    return `<span class="bg-amber-600 text-white font-bold px-2 py-0.5 rounded text-[10px] uppercase tracking-wide">High Priority</span>`;
  }
  return `<span class="bg-blue-600 text-white font-bold px-2 py-0.5 rounded text-[10px] uppercase tracking-wide">Medium</span>`;
}
