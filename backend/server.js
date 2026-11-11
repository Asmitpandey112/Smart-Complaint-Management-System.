const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const DATA_FILE = path.join(__dirname, 'data', 'complaints.json');

app.use(cors());
app.use(express.json());

const distPath = path.join(__dirname, '..', 'frontend', 'dist');
if (fs.existsSync(distPath)) {
  app.use(express.static(distPath));
} else {
  app.use(express.static(path.join(__dirname, 'public')));
}

// Ensure data directory exists
if (!fs.existsSync(path.join(__dirname, 'data'))) {
  fs.mkdirSync(path.join(__dirname, 'data'), { recursive: true });
}

// Initial Seed Data with Geolocation & Ratings
const initialComplaints = [
  {
    id: "CMP-1001",
    title: "Major Pothole causing traffic block on Ring Road",
    description: "A deep 2-foot pothole has opened up near the main traffic junction. Multiple vehicles damaged today.",
    category: "Public Works",
    location: "Sector 4, Ring Road Junction",
    lat: 18.5204,
    lng: 73.8567,
    phone: "+91 9876543210",
    urgency: "High",
    score: 88,
    status: "In Progress",
    createdAt: "2026-10-06 09:30 AM",
    slaDueAt: new Date(Date.now() + 4 * 3600 * 1000).toISOString(),
    assignedStaff: "Officer V. Kumar",
    imageUrl: "https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?w=400&auto=format&fit=crop&q=60",
    keywords: ["#pothole", "#traffic_hazard", "#road_damage"],
    rating: null,
    feedback: null,
    timeline: [
      { time: "2026-10-06 09:30 AM", status: "Submitted", note: "Ticket filed by Citizen via Web App" },
      { time: "2026-10-06 09:32 AM", status: "AI Analysis", note: "Auto-categorized under Public Works (Priority Score: 88/100)" },
      { time: "2026-10-06 10:15 AM", status: "In Progress", note: "Dispatched repair team. Assigned to Officer V. Kumar" }
    ]
  },
  {
    id: "CMP-1002",
    title: "Exposed live electrical wire near Primary School",
    description: "Storm last night broke a transformer wire. Sparks visible near school entrance gate!",
    category: "Electrical",
    location: "Sector 12, Green Valley School Road",
    lat: 18.5312,
    lng: 73.8445,
    phone: "+91 9811223344",
    urgency: "Critical",
    score: 98,
    status: "Pending",
    createdAt: "2026-10-06 11:15 AM",
    slaDueAt: new Date(Date.now() + 1 * 3600 * 1000).toISOString(),
    assignedStaff: "Unassigned",
    imageUrl: "https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=400&auto=format&fit=crop&q=60",
    keywords: ["#electrical_hazard", "#critical_risk", "#live_wire"],
    rating: null,
    feedback: null,
    timeline: [
      { time: "2026-10-06 11:15 AM", status: "Submitted", note: "Ticket filed by Citizen" },
      { time: "2026-10-06 11:16 AM", status: "AI Escalation", note: "SLA set to 2 hours due to high life-risk keywords." }
    ]
  },
  {
    id: "CMP-1003",
    title: "Garbage overflow & uncollected trash for 4 days",
    description: "Community dumpsters overflowing causing foul odor and stray dog menace.",
    category: "Sanitation",
    location: "Sector 8, Market Complex Block C",
    lat: 18.5089,
    lng: 73.8621,
    phone: "+91 9988776655",
    urgency: "Medium",
    score: 55,
    status: "Resolved",
    createdAt: "2026-10-04 02:00 PM",
    slaDueAt: new Date(Date.now() - 10 * 3600 * 1000).toISOString(),
    assignedStaff: "Sanitation Crew #12",
    imageUrl: "https://images.unsplash.com/photo-1530587191325-3db32d826c18?w=400&auto=format&fit=crop&q=60",
    keywords: ["#waste_management", "#sanitation", "#odor"],
    rating: 5,
    feedback: "Dumpsters cleared promptly next morning. Excellent work!",
    timeline: [
      { time: "2026-10-04 02:00 PM", status: "Submitted", note: "Ticket filed" },
      { time: "2026-10-04 04:30 PM", status: "In Progress", note: "Truck dispatched" },
      { time: "2026-10-05 10:00 AM", status: "Resolved", note: "Dumpster emptied and area disinfected." }
    ]
  },
  {
    id: "CMP-1004",
    title: "Contaminated muddy water from municipal supply pipeline",
    description: "Tap water coming out brown and turbid in whole apartment complex since morning.",
    category: "Water Supply",
    location: "Sector 14, Sunrise Apartments Phase 2",
    lat: 18.5401,
    lng: 73.8712,
    phone: "+91 9123456789",
    urgency: "High",
    score: 82,
    status: "In Progress",
    createdAt: "2026-10-06 07:45 AM",
    slaDueAt: new Date(Date.now() + 6 * 3600 * 1000).toISOString(),
    assignedStaff: "Eng. M. Patel",
    imageUrl: null,
    keywords: ["#water_contamination", "#public_health"],
    rating: null,
    feedback: null,
    timeline: [
      { time: "2026-10-06 07:45 AM", status: "Submitted", note: "Ticket filed by Resident Assn" },
      { time: "2026-10-06 08:30 AM", status: "In Progress", note: "Pipeline testing started by Water Dept." }
    ]
  },
  {
    id: "CMP-1005",
    title: "Burst water main flooding residential street",
    description: "Water gushing out of broken underground pipe near Sector 14 hospital line.",
    category: "Water Supply",
    location: "Sector 14, Hospital Road",
    lat: 18.5415,
    lng: 73.8730,
    phone: "+91 9845098450",
    urgency: "Critical",
    score: 92,
    status: "Pending",
    createdAt: "2026-10-06 12:00 PM",
    slaDueAt: new Date(Date.now() + 2 * 3600 * 1000).toISOString(),
    assignedStaff: "Unassigned",
    imageUrl: null,
    keywords: ["#water_burst", "#flooding", "#sector14_cluster"],
    rating: null,
    feedback: null,
    timeline: [
      { time: "2026-10-06 12:00 PM", status: "Submitted", note: "Ticket filed by Area Worker" }
    ]
  }
];

function readDatabase() {
  if (!fs.existsSync(DATA_FILE)) {
    fs.writeFileSync(DATA_FILE, JSON.stringify(initialComplaints, null, 2));
    return initialComplaints;
  }
  try {
    const raw = fs.readFileSync(DATA_FILE, 'utf8');
    return JSON.parse(raw);
  } catch (err) {
    return initialComplaints;
  }
}

function writeDatabase(data) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
}

// AI Engine
function analyzeComplaintText(title, description) {
  const text = (title + " " + description).toLowerCase();
  let category = "Public Works";
  let urgency = "Medium";
  let score = 50;
  let keywords = ["#general_report"];

  if (text.includes("wire") || text.includes("transformer") || text.includes("electric") || text.includes("light") || text.includes("spark") || text.includes("power")) {
    category = "Electrical";
    keywords.push("#electrical");
  } else if (text.includes("water") || text.includes("leak") || text.includes("sewage") || text.includes("drain") || text.includes("pipe") || text.includes("tap") || text.includes("flood")) {
    category = "Water Supply";
    keywords.push("#water_supply");
  } else if (text.includes("garbage") || text.includes("trash") || text.includes("waste") || text.includes("smell") || text.includes("dump") || text.includes("clean")) {
    category = "Sanitation";
    keywords.push("#sanitation");
  } else {
    category = "Public Works";
    keywords.push("#public_works");
  }

  if (text.includes("fire") || text.includes("spark") || text.includes("danger") || text.includes("hazard") || text.includes("live wire") || text.includes("explosion") || text.includes("flood")) {
    urgency = "Critical";
    score = 95;
    keywords.push("#critical_hazard");
  } else if (text.includes("leak") || text.includes("block") || text.includes("burst") || text.includes("urgent") || text.includes("broken") || text.includes("pothole")) {
    urgency = "High";
    score = 80;
    keywords.push("#high_priority");
  } else if (text.length > 5) {
    urgency = "Medium";
    score = 50;
  }

  return { category, urgency, score, keywords };
}

// API ROUTES

// 1. GET /api/complaints
app.get('/api/complaints', (req, res) => {
  let list = readDatabase();
  const { search, status, category, priority } = req.query;

  if (search) {
    const q = search.toLowerCase();
    list = list.filter(c => c.title.toLowerCase().includes(q) || c.id.toLowerCase().includes(q) || c.location.toLowerCase().includes(q));
  }
  if (status && status !== 'ALL') {
    list = list.filter(c => c.status === status);
  }
  if (category && category !== 'ALL') {
    list = list.filter(c => c.category === category);
  }
  if (priority && priority !== 'ALL') {
    list = list.filter(c => c.urgency === priority);
  }

  res.json({ success: true, count: list.length, data: list });
});

// 2. GET /api/complaints/:id
app.get('/api/complaints/:id', (req, res) => {
  const list = readDatabase();
  const ticket = list.find(c => c.id === req.params.id);
  if (!ticket) return res.status(404).json({ success: false, message: "Ticket not found" });
  res.json({ success: true, data: ticket });
});

// 3. POST /api/complaints
app.post('/api/complaints', (req, res) => {
  const { title, description, location, lat, lng, phone, categoryOverride, imageUrl } = req.body;
  if (!title || !description || !location) {
    return res.status(400).json({ success: false, message: "Title, description, and location are required." });
  }

  const list = readDatabase();
  const aiResult = analyzeComplaintText(title, description);

  const category = categoryOverride || aiResult.category;
  const newId = `CMP-${Date.now().toString().slice(-6)}-${list.length + 1}`;
  const nowStr = new Date().toLocaleString([], { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' });

  let slaHours = 24;
  if (aiResult.urgency === 'Critical') slaHours = 2;
  else if (aiResult.urgency === 'High') slaHours = 12;
  else if (aiResult.urgency === 'Medium') slaHours = 24;

  const slaDueAt = new Date(Date.now() + slaHours * 3600 * 1000).toISOString();

  const newTicket = {
    id: newId,
    title,
    description,
    category,
    location,
    lat: lat || (18.52 + (Math.random() - 0.5) * 0.05),
    lng: lng || (73.85 + (Math.random() - 0.5) * 0.05),
    phone: phone || "Not Provided",
    urgency: aiResult.urgency,
    score: aiResult.score,
    status: "Pending",
    createdAt: nowStr,
    slaDueAt,
    assignedStaff: "Unassigned (Auto-Routing)",
    imageUrl: imageUrl || null,
    keywords: aiResult.keywords,
    rating: null,
    feedback: null,
    timeline: [
      { time: nowStr, status: "Submitted", note: "Ticket submitted via Citizen Portal." },
      { time: nowStr, status: "AI Analysis", note: `Auto-assigned to ${category} Dept. Urgency: ${aiResult.urgency} (Score: ${aiResult.score}/100)` }
    ]
  };

  list.unshift(newTicket);
  writeDatabase(list);

  res.status(201).json({ success: true, message: "Complaint created successfully", data: newTicket });
});

// 4. PATCH /api/complaints/:id
app.patch('/api/complaints/:id', (req, res) => {
  const list = readDatabase();
  const ticket = list.find(c => c.id === req.params.id);
  if (!ticket) return res.status(404).json({ success: false, message: "Ticket not found" });

  const { status, assignedStaff, note } = req.body;
  const nowStr = new Date().toLocaleString([], { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' });

  if (status) ticket.status = status;
  if (assignedStaff) ticket.assignedStaff = assignedStaff;

  ticket.timeline.push({
    time: nowStr,
    status: status || ticket.status,
    note: note ? note : `Status updated to ${status || ticket.status} by Staff`
  });

  writeDatabase(list);
  res.json({ success: true, message: "Ticket updated successfully", data: ticket });
});

// 5. POST /api/complaints/:id/feedback (Submit Rating & Review)
app.post('/api/complaints/:id/feedback', (req, res) => {
  const list = readDatabase();
  const ticket = list.find(c => c.id === req.params.id);
  if (!ticket) return res.status(404).json({ success: false, message: "Ticket not found" });

  const { rating, feedback } = req.body;
  ticket.rating = rating || 5;
  ticket.feedback = feedback || "";

  writeDatabase(list);
  res.json({ success: true, message: "Feedback submitted successfully", data: ticket });
});

// 6. POST /api/ai/analyze
app.post('/api/ai/analyze', (req, res) => {
  const { title, description } = req.body;
  const result = analyzeComplaintText(title || "", description || "");
  res.json({ success: true, data: result });
});

// 7. GET /api/analytics
app.get('/api/analytics', (req, res) => {
  const list = readDatabase();
  const total = list.length;
  const pending = list.filter(c => c.status === 'Pending').length;
  const inProgress = list.filter(c => c.status === 'In Progress').length;
  const resolved = list.filter(c => c.status === 'Resolved').length;
  const escalated = list.filter(c => c.status === 'Escalated').length;

  const critical = list.filter(c => c.urgency === 'Critical').length;
  const high = list.filter(c => c.urgency === 'High').length;
  const medium = list.filter(c => c.urgency === 'Medium').length;

  const deptCounts = {
    "Public Works": list.filter(c => c.category === "Public Works").length,
    "Sanitation": list.filter(c => c.category === "Sanitation").length,
    "Electrical": list.filter(c => c.category === "Electrical").length,
    "Water Supply": list.filter(c => c.category === "Water Supply").length
  };

  const ratingsWithValues = list.filter(c => c.rating !== null);
  const avgRating = ratingsWithValues.length > 0
    ? (ratingsWithValues.reduce((sum, c) => sum + c.rating, 0) / ratingsWithValues.length).toFixed(1)
    : 4.8;

  res.json({
    success: true,
    data: {
      total,
      pending,
      inProgress,
      resolved,
      escalated,
      critical,
      high,
      medium,
      deptCounts,
      avgResolutionHours: 14.2,
      csatScore: avgRating
    }
  });
});

// 8. GET /api/export (Export CSV)
app.get('/api/export', (req, res) => {
  const list = readDatabase();
  let csv = "Ticket ID,Title,Category,Location,Urgency,Status,Created At,Assigned Staff\n";
  list.forEach(c => {
    csv += `"${c.id}","${c.title.replace(/"/g, '""')}","${c.category}","${c.location.replace(/"/g, '""')}","${c.urgency}","${c.status}","${c.createdAt}","${c.assignedStaff}"\n`;
  });

  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', 'attachment; filename="complaints_export.csv"');
  res.send(csv);
});

// SPA Fallback for React Router
app.get('*', (req, res) => {
  if (req.path.startsWith('/api')) {
    return res.status(404).json({ success: false, message: "API route not found" });
  }
  const distIndex = path.join(__dirname, '..', 'frontend', 'dist', 'index.html');
  if (fs.existsSync(distIndex)) {
    return res.sendFile(distIndex);
  }
  res.sendFile(path.join(__dirname, 'public', 'dashboard.html'));
});

app.listen(PORT, () => {
  console.log(`⚡ Smart Complaint Management System running at http://localhost:${PORT}`);
});
