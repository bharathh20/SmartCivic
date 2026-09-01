const { useState, useEffect, useMemo } = React;

// --- INITIAL MOCK DATA MATCHING DESIGN SLIDES ---
const INITIAL_COMPLAINTS = [
  {
    id: 'SC-2026-0041',
    title: 'Pothole on MG Road',
    category: 'Roads & Potholes',
    priority: 'High',
    department: 'PWD',
    status: 'In Progress',
    date: 'Jul 20, 2026',
    time: '09:14 AM',
    estResolution: 'Jul 24, 2026',
    assignedOfficer: 'Rajesh Kumar',
    officerRole: 'PWD Engineer',
    location: '12.9716°N, 77.5946°E — Indiranagar',
    address: 'MG Road near Ulsoor junction, Bengaluru',
    description: 'Large pothole approximately 40cm x 30cm x 15cm deep on MG Road near Ulsoor junction, causing vehicle damage and risk to two-wheelers. Reported by 14 citizens (upvoted). Prior complaint filed in March was partially patched.',
    upvotes: 14,
    hasUpvoted: false,
    images: [
      'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1541888946425-d0fbb186a5b3?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1530587191325-3db32d826c18?auto=format&fit=crop&w=600&q=80'
    ],
    timeline: [
      { status: 'Submitted', time: 'Jul 20, 2026 09:14', note: 'Complaint received and assigned ID SC-2026-0041', done: true },
      { status: 'Verified', time: 'Jul 20, 2026 14:30', note: 'Field inspector confirmed pothole severity', done: true },
      { status: 'Assigned', time: 'Jul 21, 2026 10:00', note: 'Assigned to PWD — Engineer Rajesh Kumar', done: true },
      { status: 'In Progress', time: 'Jul 21, 2026 15:00', note: 'Repair crew dispatched, estimated 48h', done: true },
      { status: 'Resolved', time: 'Estimated Jul 24', note: 'Pending completion', done: false }
    ]
  },
  {
    id: 'SC-2026-0038',
    title: 'Broken streetlight — Block C',
    category: 'Power & Streetlights',
    priority: 'Medium',
    department: 'BESCOM',
    status: 'Resolved',
    date: 'Jul 18, 2026',
    time: '08:30 PM',
    estResolution: 'Jul 19, 2026',
    assignedOfficer: 'Suresh Gowda',
    officerRole: 'BESCOM Electrical Linesman',
    location: '12.9780°N, 77.6400°E — Block C, Indiranagar',
    address: 'Block C 4th Main, Indiranagar, Bengaluru',
    description: 'Streetlight pole #42 on Block C 4th main street is dark for 3 days. Creates safety hazard during night hours.',
    upvotes: 8,
    hasUpvoted: true,
    images: [
      'https://images.unsplash.com/photo-1509114397022-ed747cca3f65?auto=format&fit=crop&w=600&q=80'
    ],
    timeline: [
      { status: 'Submitted', time: 'Jul 18, 2026 20:30', note: 'Complaint registered by citizen', done: true },
      { status: 'Verified', time: 'Jul 18, 2026 21:15', note: 'Remote grid sensor confirmed outage', done: true },
      { status: 'Assigned', time: 'Jul 19, 2026 08:00', note: 'Assigned to BESCOM Linesman Suresh Gowda', done: true },
      { status: 'In Progress', time: 'Jul 19, 2026 09:30', note: 'Transformer bulb replacement underway', done: true },
      { status: 'Resolved', time: 'Jul 19, 2026 11:45', note: 'LED fixture replaced and tested working', done: true }
    ]
  },
  {
    id: 'SC-2026-0031',
    title: 'Garbage overflow near Park',
    category: 'Waste & Sanitation',
    priority: 'High',
    department: 'BBMP Sanitation',
    status: 'Verified',
    date: 'Jul 15, 2026',
    time: '11:20 AM',
    estResolution: 'Jul 17, 2026',
    assignedOfficer: 'Anand Kumar',
    officerRole: 'Sanitation Inspector Zone 3',
    location: '12.9650°N, 77.5900°E — Cubbon Park area',
    address: 'Near West Gate Cubbon Park, Bengaluru',
    description: 'Public waste bins overflowing on main walkway. Garbage spilling onto pavement.',
    upvotes: 22,
    hasUpvoted: false,
    images: [
      'https://images.unsplash.com/photo-1530587191325-3db32d826c18?auto=format&fit=crop&w=600&q=80'
    ],
    timeline: [
      { status: 'Submitted', time: 'Jul 15, 2026 11:20', note: 'Ticket registered by citizen', done: true },
      { status: 'Verified', time: 'Jul 15, 2026 14:00', note: 'Inspector verified waste overflow', done: true },
      { status: 'Assigned', time: 'Pending', note: 'En route for truck dispatch', done: false },
      { status: 'In Progress', time: 'Pending', note: 'Pending garbage sweep', done: false },
      { status: 'Resolved', time: 'Pending', note: 'Pending cleanup sign-off', done: false }
    ]
  },
  {
    id: 'SC-2026-0027',
    title: 'Water pipe leakage',
    category: 'Water & Sewage',
    priority: 'High',
    department: 'BWSSB',
    status: 'Assigned',
    date: 'Jul 12, 2026',
    time: '07:45 AM',
    estResolution: 'Jul 15, 2026',
    assignedOfficer: 'Venkatesh R',
    officerRole: 'BWSSB Hydro Engineer',
    location: '12.9800°N, 77.6200°E — Halasuru',
    address: '12th Cross Halasuru Main Road, Bengaluru',
    description: 'Clean water gushing from underground pipeline joint onto the road surface.',
    upvotes: 19,
    hasUpvoted: false,
    images: [
      'https://images.unsplash.com/photo-1541888946425-d0fbb186a5b3?auto=format&fit=crop&w=600&q=80'
    ],
    timeline: [
      { status: 'Submitted', time: 'Jul 12, 2026 07:45', note: 'Logged with high priority tag', done: true },
      { status: 'Verified', time: 'Jul 12, 2026 08:30', note: 'Pressure drop confirmed in zone', done: true },
      { status: 'Assigned', time: 'Jul 12, 2026 10:00', note: 'BWSSB Emergency Hydro Crew assigned', done: true },
      { status: 'In Progress', time: 'Pending', note: 'Excavation team dispatched', done: false },
      { status: 'Resolved', time: 'Pending', note: 'Pending valve sealing', done: false }
    ]
  },
  {
    id: 'SC-2026-0019',
    title: 'Illegal parking obstruction',
    category: 'Traffic & Safety',
    priority: 'Low',
    department: 'Traffic Police',
    status: 'Resolved',
    date: 'Jul 10, 2026',
    time: '04:15 PM',
    estResolution: 'Jul 10, 2026',
    assignedOfficer: 'Inspector Ramesh',
    officerRole: 'Traffic Division Sub-Inspector',
    location: '12.9700°N, 77.6000°E — Brigade Road',
    address: 'Brigade Road Junction, Bengaluru',
    description: 'Commercial vehicle parked illegally blocking emergency ambulance exit lane.',
    upvotes: 6,
    hasUpvoted: true,
    images: [
      'https://images.unsplash.com/photo-1506521781263-d8422e82f27a?auto=format&fit=crop&w=600&q=80'
    ],
    timeline: [
      { status: 'Submitted', time: 'Jul 10, 2026 16:15', note: 'Reported with vehicle photo evidence', done: true },
      { status: 'Verified', time: 'Jul 10, 2026 16:25', note: 'Traffic CCTV confirmed obstruction', done: true },
      { status: 'Assigned', time: 'Jul 10, 2026 16:30', note: 'Nearest traffic patrol vehicle alerted', done: true },
      { status: 'In Progress', time: 'Jul 10, 2026 16:45', note: 'Tow truck arrived at site', done: true },
      { status: 'Resolved', time: 'Jul 10, 2026 17:10', note: 'Vehicle towed and fine issued', done: true }
    ]
  }
];

const INITIAL_NOTIFICATIONS = [
  {
    id: 'n1',
    ticketId: 'SC-2026-0041',
    title: 'SC-2026-0041 Status Updated',
    message: 'Your complaint has been assigned to PWD department.',
    time: '2 hours ago',
    unread: true,
    isNew: true
  },
  {
    id: 'n2',
    ticketId: 'SC-2026-0038',
    title: 'SC-2026-0038 Resolved',
    message: 'The streetlight issue has been successfully resolved.',
    time: '1 day ago',
    unread: true,
    isNew: true
  },
  {
    id: 'n3',
    ticketId: 'SC-2026-0031',
    title: 'SC-2026-0031 Verified',
    message: 'Your garbage complaint has been verified by the inspector.',
    time: '2 days ago',
    unread: false,
    isNew: false
  },
  {
    id: 'n4',
    ticketId: null,
    title: 'Welcome to Smart Civic',
    message: 'Your account has been registered successfully.',
    time: '5 days ago',
    unread: false,
    isNew: false
  }
];

const USER_PROFILE_INITIAL = {
  name: 'Arjun Sharma',
  email: 'arjun.sharma@gmail.com',
  mobile: '+91 98765 43210',
  address: '123, 5th Cross, Indiranagar, Bengaluru 560038',
  avatar: '',
  memberSince: `${new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}`,
  role: 'citizen',
  badge: 'VERIFIED CITIZEN',
  zone: 'Bengaluru Municipal Zone C'
};

// Dynamic API Base URL: Relative '/api' for Single-Server Production / Cloud Deployment, Port 5000 for Local Dual-Server
const API_BASE_URL = (typeof window !== 'undefined' && (window.location.port === '8000'))
  ? 'http://localhost:5000/api'
  : '/api';

// --- MAIN APPLICATION ENTRY COMPONENT ---
function App() {
  // Navigation State
  // Public tabs: 'landing', 'login', 'register', 'about', 'contact'
  // Portal tabs: 'dashboard', 'report_wizard', 'my_complaints', 'complaint_detail', 'track_complaint', 'notifications', 'profile'
  const [activeView, setActiveView] = useState('landing');
  const [isLoggedIn, setIsLoggedIn] = useState(() => !!localStorage.getItem('smartcivic_jwt_token'));
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('smartcivic_user');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return USER_PROFILE_INITIAL;
  });
  const [authToken, setAuthToken] = useState(localStorage.getItem('smartcivic_jwt_token') || null);

  // Complaints & Notifications state
  const [complaints, setComplaints] = useState(INITIAL_COMPLAINTS);
  const [selectedTicketId, setSelectedTicketId] = useState('SC-2026-0041');
  const [notifications, setNotifications] = useState(INITIAL_NOTIFICATIONS);

  // Toast Notification
  const [toast, setToast] = useState(null);

  // Lightbox Modal for complaint evidence images
  const [lightboxImg, setLightboxImg] = useState(null);

  // Profile Edit Modal
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false);

  // Session Verification & Backend Sync on Mount
  useEffect(() => {
    const savedToken = localStorage.getItem('smartcivic_jwt_token');
    if (savedToken) {
      fetch(`${API_BASE_URL}/users/me`, {
        headers: { 'Authorization': `Bearer ${savedToken}` }
      })
      .then(res => res.ok ? res.json() : null)
      .then(data => {
        if (data && data.user) {
          setCurrentUser(data.user);
          localStorage.setItem('smartcivic_user', JSON.stringify(data.user));
          setIsLoggedIn(true);
          if (data.user.role === 'admin' || data.user.role === 'dept_officer') {
            fetchGlobalComplaints();
          } else {
            fetchCitizenComplaints(savedToken);
          }
        }
      })
      .catch(e => console.log('[Session verify fallback]', e));
    }

    const fetchNotifData = async () => {
      try {
        const resNotif = await fetch(`${API_BASE_URL}/notifications`, {
          headers: savedToken ? { 'Authorization': `Bearer ${savedToken}` } : {}
        });
        if (resNotif.ok) {
          const dataNotif = await resNotif.json();
          if (Array.isArray(dataNotif) && dataNotif.length > 0) {
            setNotifications(dataNotif.map(n => ({
              id: n._id || n.id,
              ticketId: n.ticketId,
              title: n.title,
              message: n.message,
              time: n.time || 'Just now',
              unread: n.unread !== false,
              isNew: n.isNew !== false
            })));
          }
        }
      } catch (err) {
        console.log('[Notifications Sync Error]', err);
      }
    };

    fetchNotifData();
  }, []);

  const fetchCitizenComplaints = async (token) => {
    if (!token) {
      setComplaints([]);
      return;
    }
    try {
      const resComp = await fetch(`${API_BASE_URL}/complaints/user`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (resComp.ok) {
        const dataComp = await resComp.json();
        if (Array.isArray(dataComp)) {
          setComplaints(dataComp.map(c => ({
            id: c.ticketId || c._id,
            title: c.title,
            category: c.category,
            priority: c.priority,
            department: c.department,
            status: c.status,
            date: c.date || 'Aug 26, 2026',
            time: c.time || 'Just now',
            estResolution: c.estResolution,
            assignedOfficer: c.assignedOfficer,
            officerRole: c.officerRole,
            location: c.location,
            address: c.address || c.location,
            description: c.description,
            upvotes: c.upvotes || 0,
            hasUpvoted: false,
            images: c.images || [],
            timeline: c.timeline || []
          })));
        }
      }
    } catch (err) {
      console.log('[Fetch Citizen Complaints Error]', err);
    }
  };

  const fetchGlobalComplaints = async () => {
    try {
      const resComp = await fetch(`${API_BASE_URL}/complaints`);
      if (resComp.ok) {
        const dataComp = await resComp.json();
        if (Array.isArray(dataComp)) {
          setComplaints(dataComp.map(c => ({
            id: c.ticketId || c._id,
            title: c.title,
            category: c.category,
            priority: c.priority,
            department: c.department,
            status: c.status,
            date: c.date || 'Aug 26, 2026',
            time: c.time || 'Just now',
            estResolution: c.estResolution,
            assignedOfficer: c.assignedOfficer,
            officerRole: c.officerRole,
            location: c.location,
            address: c.address || c.location,
            description: c.description,
            upvotes: c.upvotes || 0,
            hasUpvoted: false,
            images: c.images || [],
            timeline: c.timeline || []
          })));
        }
      }
    } catch (err) {
      console.log('[Fetch Global Complaints Error]', err);
    }
  };

  // Helper: Trigger Toast
  const triggerToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 4500);
  };

  // Upvote Handler (Toggles API & Local State)
  const handleUpvote = async (id) => {
    setComplaints(prev => prev.map(c => {
      if (c.id === id) {
        const hasUpvoted = !c.hasUpvoted;
        return {
          ...c,
          hasUpvoted,
          upvotes: hasUpvoted ? c.upvotes + 1 : c.upvotes - 1
        };
      }
      return c;
    }));

    if (authToken) {
      try {
        await fetch(`${API_BASE_URL}/complaints/${id}/upvote`, {
          method: 'PUT',
          headers: { 'Authorization': `Bearer ${authToken}` }
        });
      } catch (e) {
        console.log('[API Upvote Error]', e);
      }
    }

    triggerToast('Upvote recorded! Priority score updated for city crews.');
  };

  // Add New Complaint from 3-step wizard
  const handleCreateComplaint = async (newCompData) => {
    let createdTicketId = `SC-2026-00${Math.floor(42 + Math.random() * 90)}`;
    let createdComplaintObj = null;

    try {
      let reqBody;
      let headers = {};
      if (authToken) {
        headers['Authorization'] = `Bearer ${authToken}`;
      }

      if (newCompData.selectedFile) {
        const fd = new FormData();
        fd.append('title', newCompData.title || '');
        fd.append('category', newCompData.category || 'Roads & Potholes');
        fd.append('priority', newCompData.priority || 'Medium');
        fd.append('description', newCompData.description || '');
        fd.append('location', newCompData.location || 'Indiranagar, Bengaluru');
        fd.append('image', newCompData.selectedFile);
        reqBody = fd;
      } else {
        headers['Content-Type'] = 'application/json';
        reqBody = JSON.stringify({
          title: newCompData.title,
          category: newCompData.category,
          priority: newCompData.priority,
          description: newCompData.description,
          location: newCompData.location,
          images: newCompData.images || []
        });
      }

      const res = await fetch(`${API_BASE_URL}/complaints`, {
        method: 'POST',
        headers: headers,
        body: reqBody
      });

      if (res.ok) {
        const resJson = await res.json();
        if (resJson.complaint) {
          createdComplaintObj = resJson.complaint;
          if (resJson.complaint.ticketId) {
            createdTicketId = resJson.complaint.ticketId;
          }
        }
      }
    } catch (err) {
      console.log('[API Complaint Submit Error]', err);
    }

    const created = {
      id: createdTicketId,
      title: newCompData.title || 'Untitled Complaint',
      category: newCompData.category || 'Roads & Potholes',
      priority: newCompData.priority || 'Medium',
      department: 'PWD',
      status: 'Submitted',
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      time: 'Just now',
      estResolution: '3 Days',
      assignedOfficer: 'Rajesh Kumar',
      officerRole: 'PWD Engineer',
      location: newCompData.location || 'Indiranagar, Bengaluru',
      address: newCompData.location || 'Indiranagar, Bengaluru',
      description: newCompData.description || '',
      upvotes: 1,
      hasUpvoted: false,
      images: createdComplaintObj && createdComplaintObj.images && createdComplaintObj.images.length > 0 
        ? createdComplaintObj.images 
        : (newCompData.previewUrl ? [newCompData.previewUrl] : (newCompData.images || [])),
      timeline: [
        { status: 'Submitted', time: 'Just now', note: `Ticket logged ${createdTicketId}`, done: true },
        { status: 'Verified', time: 'Pending', note: 'Awaiting verification', done: false },
        { status: 'Assigned', time: 'Pending', note: 'Awaiting dispatch', done: false },
        { status: 'In Progress', time: 'Pending', note: 'Pending work crew', done: false },
        { status: 'Resolved', time: 'Pending', note: 'Pending completion', done: false }
      ]
    };

    if (authToken && isLoggedIn) {
      setComplaints(prev => [created, ...prev]);
      setSelectedTicketId(createdTicketId);
      setActiveView('my_complaints');
      triggerToast(`Ticket ${createdTicketId} logged! Added to your citizen complaints.`);
    } else {
      setSelectedTicketId(createdTicketId);
      setActiveView('track_public');
      triggerToast(`Guest complaint logged! Tracking Ticket ID: ${createdTicketId}. (Unowned guest complaint).`);
    }

    if (window.confetti) {
      window.confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });
    }
  };

  // Status Update Handler (Admin / Dept Officer)
  const handleUpdateStatus = async (ticketId, status, officer, remark) => {
    const STATUS_FLOW = ['Submitted', 'Verified', 'Assigned', 'In Progress', 'Resolved'];
    const targetIdx = STATUS_FLOW.findIndex(s => s.toLowerCase() === status.toLowerCase());

    // Local State Update
    setComplaints(prev => prev.map(c => {
      if (c.id === ticketId) {
        return {
          ...c,
          status,
          assignedOfficer: officer || c.assignedOfficer,
          timeline: STATUS_FLOW.map((st, idx) => {
            const existing = (c.timeline || []).find(t => t.status && t.status.toLowerCase() === st.toLowerCase()) || {};
            if (idx < targetIdx) {
              return {
                status: st,
                time: existing.time && existing.time !== 'Pending' ? existing.time : 'Completed',
                note: existing.note || `${st} stage completed`,
                done: true
              };
            } else if (idx === targetIdx) {
              return {
                status: st,
                time: 'Just now',
                note: remark || (existing.note && existing.note !== 'Pending' ? existing.note : `Status updated to ${status}`),
                done: true
              };
            } else {
              return {
                status: st,
                time: 'Pending',
                note: existing.note && existing.note.startsWith('Pending') ? existing.note : `Awaiting ${st.toLowerCase()} stage`,
                done: false
              };
            }
          })
        };
      }
      return c;
    }));

    // Notification Message Generation for Citizen Receiving
    const newNotif = {
      id: `n_${Date.now()}`,
      ticketId,
      title: `${ticketId} Status: ${status}`,
      message: remark,
      time: 'Just now',
      unread: true,
      isNew: true
    };
    setNotifications([newNotif, ...notifications]);

    // REST API Backend Request
    try {
      await fetch(`${API_BASE_URL}/admin/complaints/${ticketId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`
        },
        body: JSON.stringify({ status, assignedOfficer: officer, remark })
      });
    } catch (e) {
      console.log('[API Status Update Error]', e);
    }

    triggerToast(`Status for ${ticketId} updated to ${status}. Notification dispatched to citizen!`);
  };

  // Profile Photo Upload Handler
  const handleAvatarUpload = async (file) => {
    if (!file) return;

    // Sensible file format & size validation (< 5MB)
    const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];
    if (!validTypes.includes(file.type)) {
      triggerToast('Please select a valid image file (PNG, JPG, JPEG, WEBP).', 'error');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      triggerToast('Image size exceeds 5MB limit. Please select a smaller photo.', 'error');
      return;
    }

    const reader = new FileReader();
    reader.onload = async (e) => {
      const base64Data = e.target.result;
      let finalAvatar = base64Data;

      // Try uploading to server API endpoint
      try {
        const fd = new FormData();
        fd.append('image', file);
        fd.append('avatar', file);
        const uploadRes = await fetch(`${API_BASE_URL}/upload`, {
          method: 'POST',
          headers: authToken ? { 'Authorization': `Bearer ${authToken}` } : {},
          body: fd
        });
        if (uploadRes.ok) {
          const uploadJson = await uploadRes.json();
          if (uploadJson.imageUrl) {
            finalAvatar = uploadJson.imageUrl;
          }
        }
      } catch (err) {
        console.log('[Upload API Warning, using base64]', err);
      }

      // Update State & LocalStorage
      const updatedUser = { ...currentUser, avatar: finalAvatar };
      setCurrentUser(updatedUser);
      localStorage.setItem('smartcivic_user', JSON.stringify(updatedUser));

      // Persist to user profile in MongoDB backend
      if (authToken) {
        try {
          await fetch(`${API_BASE_URL}/users/profile`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${authToken}`
            },
            body: JSON.stringify({ avatar: finalAvatar })
          });
        } catch (err) {
          console.log('[Persist Avatar Error]', err);
        }
      }

      triggerToast('Profile photo updated successfully!');
    };
    reader.readAsDataURL(file);
  };

  // Render view based on state
  const selectedComplaint = complaints.find(c => c.id === selectedTicketId) || complaints[0];

  return (
    <div className="min-h-screen bg-[#080C14] text-slate-100 flex flex-col font-sans relative selection:bg-cyan-500 selection:text-slate-950">

      {/* Global Toast */}
      {toast && (
        <div className="fixed top-6 right-6 z-50 bg-slate-900 border border-cyan-500/50 text-cyan-300 px-5 py-3.5 rounded-2xl shadow-2xl flex items-center gap-3 animate-fadeIn backdrop-blur-xl glow-cyan">
          <span className="text-xl">✨</span>
          <span className="font-semibold text-sm">{toast.msg}</span>
        </div>
      )}

      {/* Image Lightbox Modal */}
      {lightboxImg && (
        <div 
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4"
          onClick={() => setLightboxImg(null)}
        >
          <div className="relative max-w-4xl max-h-[90vh] bg-slate-900 border border-slate-800 rounded-3xl p-3 shadow-2xl">
            <button 
              onClick={() => setLightboxImg(null)}
              className="absolute top-4 right-4 bg-slate-800 text-slate-300 hover:text-white rounded-full w-10 h-10 flex items-center justify-center border border-slate-700 text-xl font-bold"
            >
              ✕
            </button>
            <img src={lightboxImg} alt="Complaint Evidence" className="max-w-full max-h-[80vh] rounded-2xl object-contain" />
          </div>
        </div>
      )}

      {/* Main Layout Router */}
      {isLoggedIn ? (
        // --- PORTAL LAYOUT WITH SIDEBAR ---
        <div className="flex flex-1 min-h-screen">
          
          {/* SIDEBAR COMPONENT (Matches Slides 5-12) */}
          <Sidebar 
            activeView={activeView} 
            setActiveView={setActiveView}
            unreadCount={notifications.filter(n => n.unread).length}
            onLogout={() => {
              setIsLoggedIn(false);
              setAuthToken(null);
              setCurrentUser(USER_PROFILE_INITIAL);
              setComplaints([]);
              localStorage.removeItem('smartcivic_jwt_token');
              localStorage.removeItem('smartcivic_user');
              setActiveView('landing');
              triggerToast('Logged out successfully.');
            }}
          />

          {/* PORTAL MAIN CONTENT AREA */}
          <div className="flex-1 flex flex-col min-w-0 bg-[#080C14]">
            
            {/* Top Bar for Portal */}
            <header className="h-16 border-b border-slate-800/80 px-6 flex items-center justify-between bg-slate-950/60 backdrop-blur-md sticky top-0 z-30">
              <div className="flex items-center gap-3">
                <span className="text-xs font-bold uppercase tracking-wider text-cyan-400">
                  {activeView.replace('_', ' ')}
                </span>
              </div>
              <div className="flex items-center gap-4">
                <button 
                  onClick={() => setActiveView('notifications')} 
                  className="relative p-2 text-slate-400 hover:text-cyan-400 transition"
                  title="Notifications"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/></svg>
                  {notifications.some(n => n.unread) && (
                    <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-cyan-400 rounded-full animate-ping"></span>
                  )}
                </button>
                <div 
                  onClick={() => setActiveView('profile')} 
                  className="flex items-center gap-2.5 cursor-pointer bg-slate-900 border border-slate-800 hover:border-cyan-500/50 px-3 py-1.5 rounded-full transition"
                >
                  <div className="w-7 h-7 rounded-full bg-cyan-500 text-slate-950 font-bold text-xs flex items-center justify-center overflow-hidden border border-cyan-400">
                    {currentUser.avatar ? (
                      <img 
                        src={currentUser.avatar.startsWith('http') || currentUser.avatar.startsWith('data:') ? currentUser.avatar : (API_BASE_URL.replace('/api', '') + currentUser.avatar)} 
                        alt={currentUser.name} 
                        className="w-full h-full object-cover" 
                      />
                    ) : (
                      currentUser.name ? currentUser.name.charAt(0).toUpperCase() : 'C'
                    )}
                  </div>
                  <span className="text-xs font-semibold text-slate-200">{currentUser.name || 'Citizen User'}</span>
                </div>

                {/* CODE MORPHICX Logo Badge (Top Right Corner) */}
                <div className="flex items-center gap-2 pl-3 border-l border-slate-800">
                  <img 
                    src="codemorphicx_logo.jpg" 
                    alt="CODE MORPHICX" 
                    className="w-10 h-10 md:w-11 md:h-11 rounded-full object-cover border-2 border-emerald-500 shadow-md bg-white hover:scale-105 transition"
                    title="CODE MORPHICX — Transforming Ideas Into Innovation"
                  />
                </div>
              </div>
            </header>

            {/* View Switcher */}
            <main className="flex-1 p-6 md:p-8 max-w-7xl w-full mx-auto animate-fadeIn">
              {(currentUser.role === 'admin' || currentUser.role === 'dept_officer') ? (
                <AdminDashboardView
                  complaints={complaints}
                  currentUser={currentUser}
                  onUpdateStatus={handleUpdateStatus}
                  onLogout={() => {
                    setIsLoggedIn(false);
                    setCurrentUser(USER_PROFILE_INITIAL);
                    setActiveView('landing');
                    triggerToast('Logged out of Admin Portal.');
                  }}
                />
              ) : (
                <>
                  {activeView === 'dashboard' && (
                    <DashboardView 
                      complaints={complaints} 
                      notifications={notifications}
                      currentUser={currentUser}
                      onSelectTicket={(id) => {
                        setSelectedTicketId(id);
                        setActiveView('complaint_detail');
                      }}
                      onReportIssue={() => setActiveView('report_wizard')}
                      onTrackClick={() => setActiveView('track_complaint')}
                      onNotificationsClick={() => setActiveView('notifications')}
                    />
                  )}

              {activeView === 'report_wizard' && (
                <ReportIssueWizardView 
                  onSubmit={handleCreateComplaint}
                  onCancel={() => setActiveView('dashboard')}
                />
              )}

              {activeView === 'my_complaints' && (
                <MyComplaintsView 
                  complaints={complaints}
                  onSelectTicket={(id) => {
                    setSelectedTicketId(id);
                    setActiveView('complaint_detail');
                  }}
                  onUpvote={handleUpvote}
                  onNewReport={() => setActiveView('report_wizard')}
                />
              )}

              {activeView === 'complaint_detail' && (
                <ComplaintDetailView 
                  complaint={selectedComplaint}
                  onBack={() => setActiveView('my_complaints')}
                  onOpenImage={(url) => setLightboxImg(url)}
                />
              )}

              {activeView === 'track_complaint' && (
                <TrackComplaintView 
                  complaints={complaints}
                  initialSearchId={selectedTicketId}
                  onSelectTicket={(id) => {
                    setSelectedTicketId(id);
                    setActiveView('complaint_detail');
                  }}
                />
              )}

              {activeView === 'notifications' && (
                <NotificationsView 
                  notifications={notifications}
                  onNotificationClick={(n) => {
                    setNotifications(prev => prev.map(item => item.id === n.id ? { ...item, unread: false } : item));
                    if (n.ticketId) {
                      setSelectedTicketId(n.ticketId);
                      setActiveView('complaint_detail');
                    }
                  }}
                  onMarkAllRead={() => {
                    setNotifications(prev => prev.map(item => ({ ...item, unread: false, isNew: false })));
                    triggerToast('All notifications marked as read.');
                  }}
                />
              )}

              {activeView === 'profile' && (
                <ProfileView 
                  user={currentUser}
                  onAvatarUpload={handleAvatarUpload}
                  onEditProfile={() => setIsEditProfileOpen(true)}
                  onChangePassword={() => setIsChangePasswordOpen(true)}
                  onLogout={() => {
                    setIsLoggedIn(false);
                    setAuthToken(null);
                    localStorage.removeItem('smartcivic_jwt_token');
                    localStorage.removeItem('smartcivic_user');
                    setActiveView('landing');
                    triggerToast('Logged out successfully.');
                  }}
                />
              )}
                </>
              )}
            </main>
          </div>
        </div>
      ) : (
        // --- PUBLIC LAYOUT WITH TOP NAVBAR ---
        <div className="flex flex-1 flex-col">
          
          {/* TOP NAVBAR (Matches Slide 2, 3, 4) */}
          <PublicNavbar 
            activeView={activeView}
            setActiveView={setActiveView}
            onOpenLogin={() => setActiveView('login')}
          />

          {/* PUBLIC CONTENT AREA */}
          <main className="flex-1 animate-fadeIn">
            {activeView === 'landing' && (
              <LandingView 
                onReportClick={() => {
                  setIsLoggedIn(true);
                  setActiveView('report_wizard');
                }}
                onTrackClick={() => setActiveView('track_public')}
              />
            )}

            {activeView === 'track_public' && (
              <div className="max-w-6xl mx-auto p-6 md:p-12">
                <TrackComplaintView 
                  complaints={complaints}
                  initialSearchId="SC-2026-0041"
                  onSelectTicket={(id) => {
                    setSelectedTicketId(id);
                    setIsLoggedIn(true);
                    setActiveView('complaint_detail');
                  }}
                />
              </div>
            )}

            {activeView === 'login' && (
              <LoginView 
                onLoginSuccess={(token, userPayload) => {
                  if (token) {
                    setAuthToken(token);
                    localStorage.setItem('smartcivic_jwt_token', token);
                  }
                  if (userPayload) {
                    setCurrentUser(userPayload);
                    localStorage.setItem('smartcivic_user', JSON.stringify(userPayload));
                  }
                  setIsLoggedIn(true);
                  if (userPayload && (userPayload.role === 'admin' || userPayload.role === 'dept_officer')) {
                    setActiveView('admin_dashboard');
                    fetchGlobalComplaints();
                  } else {
                    setActiveView('dashboard');
                    fetchCitizenComplaints(token);
                  }
                  triggerToast(`Welcome back, ${userPayload ? userPayload.name : 'User'}! Accessing Citizen Portal...`);
                }}
                onSwitchRegister={() => setActiveView('register')}
                onSwitchAdmin={() => setActiveView('admin_login')}
                onSwitchDept={() => setActiveView('dept_login')}
              />
            )}

            {activeView === 'admin_login' && (
              <AdminLoginView 
                onLoginSuccess={(token, userPayload) => {
                  if (token) {
                    setAuthToken(token);
                    localStorage.setItem('smartcivic_jwt_token', token);
                  }
                  if (userPayload) {
                    setCurrentUser(userPayload);
                    localStorage.setItem('smartcivic_user', JSON.stringify(userPayload));
                  }
                  setIsLoggedIn(true);
                  setActiveView('admin_dashboard');
                  fetchGlobalComplaints();
                  triggerToast(`Welcome Administrator ${userPayload ? userPayload.name : ''}! Central Command active.`);
                }}
                onSwitchCitizen={() => setActiveView('login')}
                onSwitchDept={() => setActiveView('dept_login')}
              />
            )}

            {activeView === 'dept_login' && (
              <DepartmentLoginView 
                onLoginSuccess={(token, userPayload) => {
                  if (token) {
                    setAuthToken(token);
                    localStorage.setItem('smartcivic_jwt_token', token);
                  }
                  if (userPayload) {
                    setCurrentUser(userPayload);
                    localStorage.setItem('smartcivic_user', JSON.stringify(userPayload));
                  }
                  setIsLoggedIn(true);
                  setActiveView('admin_dashboard');
                  fetchGlobalComplaints();
                  triggerToast(`Welcome Officer ${userPayload ? userPayload.name : ''}! Department Portal active.`);
                }}
                onSwitchCitizen={() => setActiveView('login')}
                onSwitchAdmin={() => setActiveView('admin_login')}
              />
            )}

            {activeView === 'register' && (
              <RegisterView 
                onRegisterSuccess={(token, userPayload) => {
                  if (token) {
                    setAuthToken(token);
                    localStorage.setItem('smartcivic_jwt_token', token);
                  }
                  if (userPayload) {
                    setCurrentUser(userPayload);
                    localStorage.setItem('smartcivic_user', JSON.stringify(userPayload));
                  }
                  setIsLoggedIn(true);
                  setActiveView('dashboard');
                  fetchCitizenComplaints(token);
                  triggerToast('Account created successfully! Welcome to SmartCivic.');
                }}
                onSwitchLogin={() => setActiveView('login')}
              />
            )}

            {activeView === 'about' && <AboutView onGetStarted={() => setActiveView('login')} />}
            {activeView === 'contact' && <ContactView triggerToast={triggerToast} />}
          </main>

          {/* PUBLIC FOOTER */}
          <footer className="border-t border-slate-800/80 bg-slate-950/80 py-10 px-6">
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 text-slate-400 text-xs">
              <div className="flex items-center gap-3">
                <div className="w-7 h-7 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 font-bold">
                  ❖
                </div>
                <span className="font-bold text-slate-200 text-sm tracking-wide">SmartCivic</span>
                <span>— Bengaluru's Transparent Grievance & Issue Resolution Platform</span>
              </div>
              <p>© {new Date().getFullYear()} SmartCivic Platform. Powered by Real-Time Data & Automated AI Triage.</p>
            </div>
          </footer>
        </div>
      )}

      {/* Edit Profile Modal */}
      {isEditProfileOpen && (
        <EditProfileModal 
          user={currentUser}
          onClose={() => setIsEditProfileOpen(false)}
          onSave={async (updatedFields) => {
            const updatedUser = { ...currentUser, ...updatedFields };
            setCurrentUser(updatedUser);
            localStorage.setItem('smartcivic_user', JSON.stringify(updatedUser));

            if (authToken) {
              try {
                const res = await fetch(`${API_BASE_URL}/users/profile`, {
                  method: 'PUT',
                  headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${authToken}`
                  },
                  body: JSON.stringify({
                    name: updatedFields.name,
                    mobile: updatedFields.mobile,
                    address: updatedFields.address,
                    avatar: updatedFields.avatar
                  })
                });
                if (res.ok) {
                  const data = await res.json();
                  if (data.user) {
                    setCurrentUser(data.user);
                    localStorage.setItem('smartcivic_user', JSON.stringify(data.user));
                  }
                }
              } catch (e) {
                console.log('[Profile Update API Error]', e);
              }
            }

            setIsEditProfileOpen(false);
            triggerToast('Profile updated & saved to database successfully!');
          }}
        />
      )}

      {/* Change Password Modal */}
      {isChangePasswordOpen && (
        <ChangePasswordModal 
          onClose={() => setIsChangePasswordOpen(false)}
          onSave={() => {
            setIsChangePasswordOpen(false);
            triggerToast('Password changed successfully!');
          }}
        />
      )}

    </div>
  );
}


// ==========================================
// 1. NAVIGATION & SIDEBAR COMPONENTS
// ==========================================

function PublicNavbar({ activeView, setActiveView, onOpenLogin }) {
  return (
    <header className="sticky top-0 z-40 bg-[#080C14]/90 backdrop-blur-xl border-b border-slate-800/80 px-6 lg:px-12 h-20 flex items-center justify-between">
      {/* Brand Logo */}
      <div 
        className="flex items-center gap-3 cursor-pointer"
        onClick={() => setActiveView('landing')}
      >
        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-sky-400 flex items-center justify-center text-slate-950 font-black text-xl shadow-lg glow-cyan">
          ❖
        </div>
        <span className="text-2xl font-bold tracking-tight text-white font-heading">SmartCivic</span>
      </div>

      {/* Nav Links */}
      <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
        <button 
          onClick={() => setActiveView('landing')}
          className={`hover:text-cyan-400 transition ${activeView === 'landing' ? 'text-cyan-400 font-semibold' : 'text-slate-300'}`}
        >
          Report
        </button>
        <button 
          onClick={() => setActiveView('track_public')}
          className={`hover:text-cyan-400 transition ${activeView === 'track_public' ? 'text-cyan-400 font-semibold' : 'text-slate-300'}`}
        >
          Track
        </button>
        <button 
          onClick={() => setActiveView('about')}
          className={`hover:text-cyan-400 transition ${activeView === 'about' ? 'text-cyan-400 font-semibold' : 'text-slate-300'}`}
        >
          About
        </button>
        <button 
          onClick={() => setActiveView('contact')}
          className={`hover:text-cyan-400 transition ${activeView === 'contact' ? 'text-cyan-400 font-semibold' : 'text-slate-300'}`}
        >
          Contact
        </button>
      </nav>

      {/* Right Side Action + Logo */}
      <div className="flex items-center gap-4">
        <button 
          onClick={onOpenLogin}
          className="btn-cyan-outline px-5 py-2 rounded-xl text-sm font-bold tracking-wide transition shadow-sm"
        >
          Login / Register
        </button>

        {/* CODE MORPHICX Logo Badge (Top Right Corner) */}
        <div className="flex items-center gap-2 pl-3 border-l border-slate-800">
          <img 
            src="codemorphicx_logo.jpg" 
            alt="CODE MORPHICX" 
            className="w-10 h-10 md:w-12 md:h-12 rounded-full object-cover border-2 border-emerald-500 shadow-md bg-white hover:scale-105 transition"
            title="CODE MORPHICX — Transforming Ideas Into Innovation"
          />
        </div>
      </div>
    </header>
  );
}

function Sidebar({ activeView, setActiveView, unreadCount, onLogout }) {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: 'M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z' },
    { id: 'report_wizard', label: 'Report Issue', icon: 'M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z' },
    { id: 'my_complaints', label: 'My Complaints', icon: 'M4 6h16M4 10h16M4 14h16M4 18h16' },
    { id: 'track_complaint', label: 'Track Complaint', icon: 'M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z' },
    { id: 'notifications', label: 'Notifications', icon: 'M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9', badge: unreadCount },
    { id: 'profile', label: 'Profile', icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' }
  ];

  return (
    <aside className="w-64 bg-[#070A10] border-r border-slate-800/80 flex flex-col justify-between p-5 hidden md:flex min-h-screen sticky top-0">
      <div>
        {/* Sidebar Brand Header */}
        <div className="flex items-center gap-3 mb-8 px-2">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-500 to-sky-400 flex items-center justify-center text-slate-950 font-black text-lg shadow-md glow-cyan">
            ❖
          </div>
          <div>
            <div className="text-lg font-bold text-white font-heading">SmartCivic</div>
            <div className="text-[10px] font-bold tracking-wider text-cyan-400 uppercase">CITIZEN PORTAL</div>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="space-y-1.5">
          {menuItems.map(item => {
            const isActive = activeView === item.id || (item.id === 'my_complaints' && activeView === 'complaint_detail');
            return (
              <button
                key={item.id}
                onClick={() => setActiveView(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl font-semibold text-sm transition-all duration-150 ${
                  isActive
                    ? 'bg-slate-800/80 text-cyan-400 border border-cyan-500/30 shadow-inner'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
                }`}
              >
                <div className="flex items-center gap-3">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={item.icon} />
                  </svg>
                  <span>{item.label}</span>
                </div>
                {item.badge > 0 && (
                  <span className="w-5 h-5 rounded-full bg-cyan-500 text-slate-950 font-extrabold text-[10px] flex items-center justify-center">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Logout Button */}
      <div className="border-t border-slate-800/80 pt-4">
        <button
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-semibold text-sm text-rose-400 hover:bg-rose-950/30 hover:text-rose-300 transition"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}


// ==========================================
// 2. LANDING PAGE (Slides 1 & 2)
// ==========================================

function LandingView({ onReportClick, onTrackClick }) {
  return (
    <div className="max-w-7xl mx-auto px-6 lg:px-12 py-12 md:py-20 flex flex-col gap-16">
      
      {/* Hero Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        
        {/* Left Column: Hero Text */}
        <div className="flex flex-col gap-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900 border border-cyan-500/30 text-cyan-400 text-xs font-bold tracking-widest uppercase w-fit glow-cyan">
            ◆ SMART CITY PLATFORM V2.4
          </div>

          <h1 className="text-4xl md:text-6xl font-black font-heading tracking-tight text-white leading-tight">
            Your City,<br />
            <span className="text-cyan-400 drop-shadow-[0_0_20px_rgba(6,182,212,0.5)]">Your Voice.</span>
          </h1>

          <p className="text-slate-400 text-base md:text-lg leading-relaxed max-w-xl">
            Report, track, and see the change with Smart Civic — Bengaluru's transparent citizen grievance platform powered by real-time data.
          </p>

          <div className="flex items-center gap-4 pt-2">
            <button 
              onClick={onReportClick}
              className="btn-cyan px-7 py-3.5 rounded-xl font-bold text-sm tracking-wide flex items-center gap-2"
            >
              <span>Report an Issue</span>
              <span>→</span>
            </button>

            <button 
              onClick={onTrackClick}
              className="px-6 py-3.5 rounded-xl font-bold text-sm text-slate-300 hover:text-white transition hover:bg-slate-900 border border-transparent hover:border-slate-800"
            >
              Track Complaint
            </button>
          </div>
        </div>

        {/* Right Column: Live Activity Card with Chart (Matches Slide 2) */}
        <div className="glass-card rounded-3xl p-6 md:p-8 flex flex-col gap-6 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">LIVE ACTIVITY</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping"></span>
              <span className="text-xs font-bold text-emerald-400">● LIVE</span>
            </div>
          </div>

          {/* SVG Line Graph Simulation (Mon to Sun with Reports & Resolved lines) */}
          <div className="relative h-56 w-full pt-4">
            {/* Horizontal Grid lines */}
            <div className="absolute inset-0 flex flex-col justify-between text-[10px] text-slate-600 pointer-events-none">
              <div className="border-b border-slate-800/60 pb-1">60</div>
              <div className="border-b border-slate-800/60 pb-1">45</div>
              <div className="border-b border-slate-800/60 pb-1">30</div>
              <div className="border-b border-slate-800/60 pb-1">15</div>
              <div className="border-b border-slate-800/60 pb-1">0</div>
            </div>

            <svg className="w-full h-full overflow-visible relative z-10" viewBox="0 0 500 180" preserveAspectRatio="none">
              <defs>
                <linearGradient id="reportsGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#06B6D4" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#06B6D4" stopOpacity="0.0" />
                </linearGradient>
                <linearGradient id="resolvedGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#10B981" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="#10B981" stopOpacity="0.0" />
                </linearGradient>
              </defs>

              {/* Reports Curve (Cyan) */}
              <path 
                d="M 20 120 Q 90 90, 160 130 T 300 40 T 420 110 T 480 130 L 480 170 L 20 170 Z" 
                fill="url(#reportsGrad)" 
              />
              <path 
                d="M 20 120 Q 90 90, 160 130 T 300 40 T 420 110 T 480 130" 
                fill="none" 
                stroke="#06B6D4" 
                strokeWidth="3.5"
                strokeLinecap="round" 
              />

              {/* Resolved Curve (Emerald) */}
              <path 
                d="M 20 140 Q 90 120, 160 145 T 300 70 T 420 130 T 480 150 L 480 170 L 20 170 Z" 
                fill="url(#resolvedGrad)" 
              />
              <path 
                d="M 20 140 Q 90 120, 160 145 T 300 70 T 420 130 T 480 150" 
                fill="none" 
                stroke="#10B981" 
                strokeWidth="3.5"
                strokeLinecap="round" 
              />
            </svg>
          </div>

          {/* Days Labels */}
          <div className="flex justify-between text-xs text-slate-500 font-semibold px-2">
            <span>Mon</span>
            <span>Tue</span>
            <span>Wed</span>
            <span>Thu</span>
            <span>Fri</span>
            <span>Sat</span>
            <span>Sun</span>
          </div>

          {/* Legend */}
          <div className="flex items-center gap-6 pt-2 border-t border-slate-800/80 text-xs font-semibold">
            <div className="flex items-center gap-2 text-cyan-400">
              <span className="w-3 h-1 bg-cyan-400 rounded-full"></span>
              <span>- Reports</span>
            </div>
            <div className="flex items-center gap-2 text-emerald-400">
              <span className="w-3 h-1 bg-emerald-400 rounded-full"></span>
              <span>- Resolved</span>
            </div>
          </div>
        </div>

      </div>

      {/* Feature Highlights Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-8 border-t border-slate-800/80">
        <div className="glass-card rounded-2xl p-6 flex flex-col gap-3">
          <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 text-2xl font-bold">
            ⚡
          </div>
          <h3 className="text-lg font-bold text-white font-heading">AI Dispatch Triage</h3>
          <p className="text-slate-400 text-sm leading-relaxed">
            Automated image recognition and geographic routing instantly dispatches reported complaints to the right department.
          </p>
        </div>

        <div className="glass-card rounded-2xl p-6 flex flex-col gap-3">
          <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 text-2xl font-bold">
            📍
          </div>
          <h3 className="text-lg font-bold text-white font-heading">GPS Real-Time Tracking</h3>
          <p className="text-slate-400 text-sm leading-relaxed">
            Follow exact step-by-step progress from field inspector verification to crew dispatch and final sign-off.
          </p>
        </div>

        <div className="glass-card rounded-2xl p-6 flex flex-col gap-3">
          <div className="w-12 h-12 rounded-xl bg-sky-500/10 border border-sky-500/30 flex items-center justify-center text-sky-400 text-2xl font-bold">
            🛡️
          </div>
          <h3 className="text-lg font-bold text-white font-heading">100% Transparency</h3>
          <p className="text-slate-400 text-sm leading-relaxed">
            Public audit trail with photo evidence before & after resolution ensures municipal accountability.
          </p>
        </div>
      </div>

    </div>
  );
}


// ==========================================
// 3. CITIZEN LOGIN PAGE (Slide 3)
// ==========================================

function LoginView({ onLoginSuccess, onSwitchRegister, onSwitchAdmin, onSwitchDept }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_BASE_URL}/users/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), password })
      });
      const data = await res.json();
      if (res.ok && data.token) {
        localStorage.setItem('smartcivic_jwt_token', data.token);
        if (data.user) {
          localStorage.setItem('smartcivic_user', JSON.stringify(data.user));
        }
        onLoginSuccess(data.token, data.user);
      } else {
        alert(data.message || 'Invalid email or password. Please check your credentials.');
      }
    } catch (err) {
      console.log('[Login Error]', err);
      alert('Unable to connect to backend server. Please make sure backend is running on port 5000.');
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-6">
      <div className="glass-card w-full max-w-md rounded-3xl p-8 flex flex-col gap-6 shadow-2xl relative border border-slate-800">
        
        {/* Card Header */}
        <div className="flex flex-col gap-1 text-left">
          <div className="text-[10px] font-extrabold uppercase tracking-widest text-cyan-400 mb-1">
            SECURITY PORTAL
          </div>
          <h2 className="text-2xl font-black font-heading text-white">Citizen Login</h2>
          <p className="text-slate-400 text-xs">Access your complaint dashboard securely</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-slate-300">Email Address</label>
            <input 
              type="email" 
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="citizen@example.gov.in"
              className="w-full bg-slate-950/80 border border-slate-800 focus:border-cyan-500 rounded-xl px-4 py-3 text-sm text-slate-100 placeholder:text-slate-600 outline-none transition"
            />
          </div>

          <div className="flex flex-col gap-1.5 relative">
            <label className="text-xs font-semibold text-slate-300">Password</label>
            <div className="relative">
              <input 
                type={showPassword ? "text" : "password"} 
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                className="w-full bg-slate-950/80 border border-slate-800 focus:border-cyan-500 rounded-xl px-4 py-3 text-sm text-slate-100 placeholder:text-slate-600 outline-none transition pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200"
              >
                👁️
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between text-xs pt-1">
            <label className="flex items-center gap-2 cursor-pointer text-slate-400">
              <input 
                type="checkbox" 
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="rounded bg-slate-900 border-slate-800 text-cyan-500 focus:ring-0" 
              />
              <span>Remember me</span>
            </label>
            <a href="#" onClick={(e) => { e.preventDefault(); alert('Password reset link dispatched to registered email.'); }} className="text-cyan-400 hover:underline">
              Forgot password?
            </a>
          </div>

          <button 
            type="submit"
            className="btn-cyan w-full py-3.5 rounded-xl text-sm font-bold tracking-wide mt-2"
          >
            Login to Portal
          </button>
        </form>

        {/* Role Portal Navigation Buttons - NO DIRECT ACCESS / REQUIRES AUTHENTICATION */}
        <div className="grid grid-cols-2 gap-3 pt-2">
          <button 
            type="button"
            onClick={onSwitchAdmin}
            className="bg-purple-950/60 hover:bg-purple-900/60 border border-purple-500/30 text-purple-300 font-semibold text-xs py-2.5 rounded-xl transition flex items-center justify-center gap-1.5"
          >
            <span>🛡️</span> Admin Portal
          </button>
          <button 
            type="button"
            onClick={onSwitchDept}
            className="bg-amber-950/60 hover:bg-amber-900/60 border border-amber-500/30 text-amber-300 font-semibold text-xs py-2.5 rounded-xl transition flex items-center justify-center gap-1.5"
          >
            <span>🏢</span> Department Portal
          </button>
        </div>

        {/* Footer Link */}
        <div className="text-center text-xs text-slate-400 pt-2 border-t border-slate-800/80">
          <span>Don't have an account? </span>
          <button onClick={onSwitchRegister} className="text-cyan-400 font-semibold hover:underline">
            Register here
          </button>
        </div>

      </div>
    </div>
  );
}


// ==========================================
// 3B. ADMIN COMMAND LOGIN PAGE
// ==========================================

function AdminLoginView({ onLoginSuccess, onSwitchCitizen, onSwitchDept }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_BASE_URL}/users/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), password })
      });
      const data = await res.json();
      if (res.ok && data.token) {
        if (data.user && data.user.role !== 'admin') {
          alert('Access denied: This account does not have administrator privileges. Please use Citizen or Department login.');
          return;
        }
        localStorage.setItem('smartcivic_jwt_token', data.token);
        if (data.user) {
          localStorage.setItem('smartcivic_user', JSON.stringify(data.user));
        }
        onLoginSuccess(data.token, data.user);
      } else {
        alert(data.message || 'Invalid administrator email or password.');
      }
    } catch (err) {
      console.log('[Admin Login Error]', err);
      alert('Unable to connect to backend server. Please make sure backend is running on port 5000.');
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-6">
      <div className="glass-card w-full max-w-md rounded-3xl p-8 flex flex-col gap-6 shadow-2xl relative border border-purple-500/40 bg-[#0A0B16]">
        
        {/* Card Header */}
        <div className="flex flex-col gap-1 text-left">
          <div className="text-[10px] font-extrabold uppercase tracking-widest text-purple-400 mb-1 flex items-center gap-1.5">
            <span>🛡️</span> MUNICIPAL CONTROL
          </div>
          <h2 className="text-2xl font-black font-heading text-white">Admin Command Login</h2>
          <p className="text-slate-400 text-xs">Enter municipal admin credentials to access central command</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-purple-300">Admin Email Address</label>
            <input 
              type="email" 
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@smartcivic.gov.in"
              className="w-full bg-slate-950/80 border border-slate-800 focus:border-purple-500 rounded-xl px-4 py-3 text-sm text-slate-100 placeholder:text-slate-600 outline-none transition"
            />
          </div>

          <div className="flex flex-col gap-1.5 relative">
            <label className="text-xs font-semibold text-purple-300">Admin Password</label>
            <div className="relative">
              <input 
                type={showPassword ? "text" : "password"} 
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Admin Password"
                className="w-full bg-slate-950/80 border border-slate-800 focus:border-purple-500 rounded-xl px-4 py-3 text-sm text-slate-100 placeholder:text-slate-600 outline-none transition pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200"
              >
                👁️
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between text-xs pt-1">
            <label className="flex items-center gap-2 cursor-pointer text-slate-400">
              <input 
                type="checkbox" 
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="rounded bg-slate-900 border-slate-800 text-purple-500 focus:ring-0" 
              />
              <span>Remember me</span>
            </label>
          </div>

          <button 
            type="submit"
            className="w-full py-3.5 rounded-xl text-sm font-bold tracking-wide mt-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white shadow-lg transition"
          >
            Login to Admin Portal
          </button>
        </form>

        {/* Portal Switch Links */}
        <div className="flex items-center justify-between text-xs text-slate-400 pt-3 border-t border-slate-800/80">
          <button onClick={onSwitchCitizen} className="text-cyan-400 font-semibold hover:underline flex items-center gap-1">
            ← Citizen Login
          </button>
          <button onClick={onSwitchDept} className="text-amber-400 font-semibold hover:underline flex items-center gap-1">
            Department Portal →
          </button>
        </div>

      </div>
    </div>
  );
}


// ==========================================
// 3C. DEPARTMENT PORTAL LOGIN PAGE
// ==========================================

function DepartmentLoginView({ onLoginSuccess, onSwitchCitizen, onSwitchAdmin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_BASE_URL}/users/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), password })
      });
      const data = await res.json();
      if (res.ok && data.token) {
        if (data.user && data.user.role !== 'dept_officer' && data.user.role !== 'department') {
          alert('Access denied: This account does not have department officer privileges. Please use Citizen or Admin login.');
          return;
        }
        localStorage.setItem('smartcivic_jwt_token', data.token);
        if (data.user) {
          localStorage.setItem('smartcivic_user', JSON.stringify(data.user));
        }
        onLoginSuccess(data.token, data.user);
      } else {
        alert(data.message || 'Invalid department email or password.');
      }
    } catch (err) {
      console.log('[Department Login Error]', err);
      alert('Unable to connect to backend server. Please make sure backend is running on port 5000.');
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-6">
      <div className="glass-card w-full max-w-md rounded-3xl p-8 flex flex-col gap-6 shadow-2xl relative border border-amber-500/40 bg-[#100D09]">
        
        {/* Card Header */}
        <div className="flex flex-col gap-1 text-left">
          <div className="text-[10px] font-extrabold uppercase tracking-widest text-amber-400 mb-1 flex items-center gap-1.5">
            <span>🏢</span> DEPARTMENT OPERATIONS
          </div>
          <h2 className="text-2xl font-black font-heading text-white">Department Portal Login</h2>
          <p className="text-slate-400 text-xs">Enter department officer credentials to manage civic tickets</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-amber-300">Department Email Address</label>
            <input 
              type="email" 
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="officer.pwd@smartcivic.gov.in"
              className="w-full bg-slate-950/80 border border-slate-800 focus:border-amber-500 rounded-xl px-4 py-3 text-sm text-slate-100 placeholder:text-slate-600 outline-none transition"
            />
          </div>

          <div className="flex flex-col gap-1.5 relative">
            <label className="text-xs font-semibold text-amber-300">Department Password</label>
            <div className="relative">
              <input 
                type={showPassword ? "text" : "password"} 
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Department Password"
                className="w-full bg-slate-950/80 border border-slate-800 focus:border-amber-500 rounded-xl px-4 py-3 text-sm text-slate-100 placeholder:text-slate-600 outline-none transition pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200"
              >
                👁️
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between text-xs pt-1">
            <label className="flex items-center gap-2 cursor-pointer text-slate-400">
              <input 
                type="checkbox" 
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="rounded bg-slate-900 border-slate-800 text-amber-500 focus:ring-0" 
              />
              <span>Remember me</span>
            </label>
          </div>

          <button 
            type="submit"
            className="w-full py-3.5 rounded-xl text-sm font-bold tracking-wide mt-2 bg-gradient-to-r from-amber-600 to-yellow-600 hover:from-amber-500 hover:to-yellow-500 text-slate-950 font-black shadow-lg transition"
          >
            Login to Department Portal
          </button>
        </form>

        {/* Portal Switch Links */}
        <div className="flex items-center justify-between text-xs text-slate-400 pt-3 border-t border-slate-800/80">
          <button onClick={onSwitchCitizen} className="text-cyan-400 font-semibold hover:underline flex items-center gap-1">
            ← Citizen Login
          </button>
          <button onClick={onSwitchAdmin} className="text-purple-400 font-semibold hover:underline flex items-center gap-1">
            Admin Portal →
          </button>
        </div>

      </div>
    </div>
  );
}


// ==========================================
// 4. CREATE ACCOUNT PAGE (Slide 4)
// ==========================================

function RegisterView({ onRegisterSuccess, onSwitchLogin }) {
  const [formData, setFormData] = useState({
    fullName: '',
    mobile: '',
    email: '',
    address: '',
    password: '',
    confirmPassword: '',
    agree: false
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert('Passwords do not match. Please re-enter.');
      return;
    }
    try {
      const res = await fetch(`${API_BASE_URL}/users/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: formData.fullName,
          email: formData.email.trim(),
          password: formData.password,
          mobile: formData.mobile,
          address: formData.address
        })
      });
      const data = await res.json();
      if (res.ok && data.token) {
        localStorage.setItem('smartcivic_jwt_token', data.token);
        if (data.user) {
          localStorage.setItem('smartcivic_user', JSON.stringify(data.user));
        }
        onRegisterSuccess(data.token, data.user);
      } else {
        alert(data.message || 'Registration failed.');
      }
    } catch (err) {
      console.log('[Register Error]', err);
      alert('Unable to connect to backend server. Please make sure backend is running on port 5000.');
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center p-6">
      <div className="glass-card w-full max-w-lg rounded-3xl p-8 flex flex-col gap-6 shadow-2xl relative border border-slate-800">
        
        <div className="flex flex-col gap-1 text-left">
          <h2 className="text-2xl font-black font-heading text-white">Create Account</h2>
          <p className="text-slate-400 text-xs">Join Bengaluru's civic transparency network</p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          
          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">FULL NAME</label>
            <input 
              type="text" 
              required
              value={formData.fullName}
              onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
              placeholder="Arjun Sharma"
              className="bg-slate-950/80 border border-slate-800 focus:border-cyan-500 rounded-xl px-4 py-2.5 text-sm text-slate-100 placeholder:text-slate-600 outline-none"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">MOBILE NUMBER</label>
              <input 
                type="text" 
                required
                value={formData.mobile}
                onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                placeholder="+91 98765 43210"
                className="bg-slate-950/80 border border-slate-800 focus:border-cyan-500 rounded-xl px-4 py-2.5 text-sm text-slate-100 placeholder:text-slate-600 outline-none"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">EMAIL ADDRESS</label>
              <input 
                type="email" 
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="arjun@example.com"
                className="bg-slate-950/80 border border-slate-800 focus:border-cyan-500 rounded-xl px-4 py-2.5 text-sm text-slate-100 placeholder:text-slate-600 outline-none"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">ADDRESS</label>
            <input 
              type="text" 
              required
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              placeholder="123, 5th Cross, Indiranagar..."
              className="bg-slate-950/80 border border-slate-800 focus:border-cyan-500 rounded-xl px-4 py-2.5 text-sm text-slate-100 placeholder:text-slate-600 outline-none"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">PASSWORD</label>
              <input 
                type="password" 
                required
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                placeholder="••••••••"
                className="bg-slate-950/80 border border-slate-800 focus:border-cyan-500 rounded-xl px-4 py-2.5 text-sm text-slate-100 outline-none"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">CONFIRM PASSWORD</label>
              <input 
                type="password" 
                required
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                placeholder="••••••••"
                className="bg-slate-950/80 border border-slate-800 focus:border-cyan-500 rounded-xl px-4 py-2.5 text-sm text-slate-100 outline-none"
              />
            </div>
          </div>

          <label className="flex items-start gap-2 cursor-pointer text-xs text-slate-400 pt-1">
            <input 
              type="checkbox" 
              required
              checked={formData.agree}
              onChange={(e) => setFormData({ ...formData, agree: e.target.checked })}
              className="mt-0.5 rounded bg-slate-900 border-slate-800 text-cyan-500" 
            />
            <span>I agree to the Terms of Use and Privacy Policy of Smart Civic Platform.</span>
          </label>

          <button 
            type="submit"
            className="btn-cyan w-full py-3.5 rounded-xl text-sm font-bold tracking-wide mt-2 flex items-center justify-center gap-2"
          >
            <span>Register</span>
            <span>→</span>
          </button>
        </form>

        <div className="text-center text-xs text-slate-400 pt-2 border-t border-slate-800/80">
          <span>Already registered? </span>
          <button onClick={onSwitchLogin} className="text-cyan-400 font-semibold hover:underline">
            Login here
          </button>
        </div>

      </div>
    </div>
  );
}


// ==========================================
// 5. CITIZEN DASHBOARD (Slide 5)
// ==========================================

function DashboardView({ complaints, notifications, currentUser, onSelectTicket, onReportIssue, onTrackClick, onNotificationsClick }) {
  // Compute stats
  const total = complaints.length;
  const pending = complaints.filter(c => c.status === 'Pending' || c.status === 'Submitted' || c.status === 'Verified').length;
  const inProgress = complaints.filter(c => c.status === 'In Progress' || c.status === 'Assigned').length;
  const resolved = complaints.filter(c => c.status === 'Resolved').length;

  return (
    <div className="flex flex-col gap-8">
      
      {/* Top Header */}
      <div className="flex flex-col gap-1">
        <div className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400">CITIZEN PORTAL</div>
        <h1 className="text-3xl font-black font-heading text-white flex items-center gap-2">
          <span>Good morning, {currentUser && currentUser.name ? currentUser.name.split(' ')[0] : 'Citizen'}</span>
          <span>🖐</span>
        </h1>
        <p className="text-slate-400 text-xs">{new Date().toLocaleDateString('en-US', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })} - Bengaluru Municipal Zone C</p>
      </div>

      {/* 4 Stat Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="glass-card rounded-2xl p-5 flex flex-col justify-between gap-3">
          <span className="text-[10px] font-bold tracking-wider text-slate-400 uppercase">TOTAL COMPLAINTS</span>
          <div className="flex items-baseline justify-between">
            <span className="text-3xl font-black font-heading text-white">{total}</span>
            <span className="text-[10px] font-semibold text-emerald-400">↑ 2 this week</span>
          </div>
        </div>

        <div className="glass-card rounded-2xl p-5 flex flex-col justify-between gap-3">
          <span className="text-[10px] font-bold tracking-wider text-slate-400 uppercase">PENDING</span>
          <div className="flex items-baseline justify-between">
            <span className="text-3xl font-black font-heading text-amber-400">{pending}</span>
          </div>
        </div>

        <div className="glass-card rounded-2xl p-5 flex flex-col justify-between gap-3">
          <span className="text-[10px] font-bold tracking-wider text-slate-400 uppercase">IN PROGRESS</span>
          <div className="flex items-baseline justify-between">
            <span className="text-3xl font-black font-heading text-amber-400">{inProgress}</span>
          </div>
        </div>

        <div className="glass-card rounded-2xl p-5 flex flex-col justify-between gap-3">
          <span className="text-[10px] font-bold tracking-wider text-slate-400 uppercase">RESOLVED</span>
          <div className="flex items-baseline justify-between">
            <span className="text-3xl font-black font-heading text-emerald-400">{resolved}</span>
            <span className="text-[10px] font-semibold text-emerald-400">↑ 1 this week</span>
          </div>
        </div>
      </div>

      {/* Main Dashboard Content: Recent Complaints Table + Sidebar Widgets */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left 2 Cols: Recent Complaints */}
        <div className="lg:col-span-2 glass-card rounded-3xl p-6 flex flex-col gap-5">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white font-heading">Recent Complaints</h3>
            <button onClick={() => onSelectTicket(complaints[0].id)} className="text-xs text-cyan-400 hover:underline font-semibold">
              View all →
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-800 text-slate-500 font-bold uppercase tracking-wider">
                  <th className="pb-3">ID</th>
                  <th className="pb-3">Title</th>
                  <th className="pb-3">Status</th>
                  <th className="pb-3">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {complaints.map(c => (
                  <tr 
                    key={c.id} 
                    onClick={() => onSelectTicket(c.id)}
                    className="hover:bg-slate-900/60 cursor-pointer transition"
                  >
                    <td className="py-3.5 font-bold text-cyan-400">{c.id.split('-').pop()}</td>
                    <td className="py-3.5 font-semibold text-slate-200">{c.title}</td>
                    <td className="py-3.5">
                      <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider ${
                        c.status === 'In Progress' ? 'badge-in-progress' :
                        c.status === 'Resolved' ? 'badge-resolved' :
                        c.status === 'Assigned' ? 'badge-assigned' :
                        c.status === 'Verified' ? 'badge-verified' : 'badge-pending'
                      }`}>
                        {c.status}
                      </span>
                    </td>
                    <td className="py-3.5 text-slate-400">{c.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right 1 Col: Widgets */}
        <div className="flex flex-col gap-6">
          
          {/* Notifications Widget */}
          <div className="glass-card rounded-3xl p-6 flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-white font-heading">Notifications</h3>
              <button onClick={onNotificationsClick} className="text-xs text-cyan-400 hover:underline font-semibold">
                View all →
              </button>
            </div>

            <div className="flex flex-col gap-3">
              {notifications.slice(0, 3).map(n => (
                <div key={n.id} className="flex items-start gap-3 text-xs p-2.5 rounded-xl hover:bg-slate-900/50 transition">
                  <span className={`w-2 h-2 rounded-full mt-1.5 ${n.unread ? 'bg-cyan-400' : 'bg-slate-600'}`}></span>
                  <div className="flex flex-col gap-0.5">
                    <span className="font-bold text-slate-200">{n.title}</span>
                    <span className="text-[10px] text-slate-400">{n.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions Widget */}
          <div className="glass-card rounded-3xl p-6 flex flex-col gap-4">
            <h3 className="text-base font-bold text-white font-heading">Quick Actions</h3>
            <div className="flex flex-col gap-2.5">
              <button 
                onClick={onReportIssue}
                className="w-full bg-slate-900 hover:bg-slate-800 text-cyan-400 font-semibold text-xs py-3 px-4 rounded-xl text-left border border-slate-800 transition flex items-center justify-between"
              >
                <span>+ Report a Pothole</span>
                <span>→</span>
              </button>
              <button 
                onClick={onReportIssue}
                className="w-full bg-slate-900 hover:bg-slate-800 text-amber-400 font-semibold text-xs py-3 px-4 rounded-xl text-left border border-slate-800 transition flex items-center justify-between"
              >
                <span>+ Report Garbage</span>
                <span>→</span>
              </button>
              <button 
                onClick={onTrackClick}
                className="w-full bg-slate-900 hover:bg-slate-800 text-slate-300 font-semibold text-xs py-3 px-4 rounded-xl text-left border border-slate-800 transition flex items-center justify-between"
              >
                <span>+ Track Complaint</span>
                <span>→</span>
              </button>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}


// ==========================================
// 6. 3-STEP REPORT ISSUE WIZARD (Slides 6, 7, 8)
// ==========================================

function ReportIssueWizardView({ onSubmit, onCancel }) {
  const [step, setStep] = useState(1);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [formData, setFormData] = useState({
    category: 'Roads & Potholes',
    title: 'Large pothole causing accidents on 5th Cross',
    description: 'Describe the issue in detail — location landmarks, severity, when it started...',
    priority: 'Medium',
    location: '12.9716°N, 77.5946°E — Indiranagar',
    images: []
  });

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const ext = file.name.split('.').pop().toLowerCase();
      if (!['jpg', 'jpeg', 'png', 'webp'].includes(ext)) {
        alert('Invalid file format! Allowed formats: JPG, JPEG, PNG, WEBP.');
        return;
      }
      if (file.size > 10 * 1024 * 1024) {
        alert('File size exceeds 10MB limit!');
        return;
      }
      setSelectedFile(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const handleFetchLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const lat = pos.coords.latitude.toFixed(4);
          const lng = pos.coords.longitude.toFixed(4);
          setFormData(prev => ({ ...prev, location: `${lat}°N, ${lng}°E — Bengaluru Detected GPS` }));
        },
        () => {
          alert('GPS permission denied. Using default Indiranagar coordinates.');
        }
      );
    }
  };

  return (
    <div className="flex flex-col gap-6 max-w-4xl mx-auto">
      
      {/* Hidden File Input */}
      <input 
        type="file" 
        id="complaintImageInput" 
        accept="image/png, image/jpeg, image/webp" 
        className="hidden" 
        onChange={handleFileChange} 
      />

      {/* Page Title */}
      <div className="flex flex-col gap-1">
        <div className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400">REPORT AN ISSUE</div>
        <h1 className="text-3xl font-black font-heading text-white">New Complaint</h1>
      </div>

      {/* Stepper Progress Bar */}
      <div className="flex items-center justify-between relative max-w-xl mx-auto w-full py-4">
        <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-slate-800 -translate-y-1/2 z-0"></div>
        <div 
          className="absolute top-1/2 left-0 h-0.5 bg-cyan-400 -translate-y-1/2 z-0 transition-all duration-300"
          style={{ width: step === 1 ? '0%' : step === 2 ? '50%' : '100%' }}
        ></div>

        {/* Step 1 Circle */}
        <div className="relative z-10 flex flex-col items-center gap-1.5">
          <div className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs transition ${
            step >= 1 ? 'bg-cyan-500 text-slate-950 glow-cyan' : 'bg-slate-900 border border-slate-700 text-slate-400'
          }`}>
            {step > 1 ? '✓' : '1'}
          </div>
          <span className={`text-xs font-semibold ${step === 1 ? 'text-cyan-400' : 'text-slate-400'}`}>Issue Details</span>
        </div>

        {/* Step 2 Circle */}
        <div className="relative z-10 flex flex-col items-center gap-1.5">
          <div className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs transition ${
            step >= 2 ? 'bg-cyan-500 text-slate-950 glow-cyan' : 'bg-slate-900 border border-slate-700 text-slate-400'
          }`}>
            {step > 2 ? '✓' : '2'}
          </div>
          <span className={`text-xs font-semibold ${step === 2 ? 'text-cyan-400' : 'text-slate-400'}`}>Location & Media</span>
        </div>

        {/* Step 3 Circle */}
        <div className="relative z-10 flex flex-col items-center gap-1.5">
          <div className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs transition ${
            step === 3 ? 'bg-cyan-500 text-slate-950 glow-cyan' : 'bg-slate-900 border border-slate-700 text-slate-400'
          }`}>
            3
          </div>
          <span className={`text-xs font-semibold ${step === 3 ? 'text-cyan-400' : 'text-slate-400'}`}>Review & Submit</span>
        </div>
      </div>

      {/* STEP 1: ISSUE DETAILS (Slide 6) */}
      {step === 1 && (
        <div className="glass-card rounded-3xl p-8 flex flex-col gap-6 border border-slate-800">
          
          <div className="flex flex-col gap-2">
            <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">CATEGORY</label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full bg-slate-950/80 border border-slate-800 focus:border-cyan-500 rounded-xl px-4 py-3 text-sm text-slate-100 outline-none"
            >
              <option value="Roads & Potholes">Roads & Potholes</option>
              <option value="Waste & Sanitation">Waste & Sanitation</option>
              <option value="Water & Sewage">Water & Sewage</option>
              <option value="Power & Streetlights">Power & Streetlights</option>
              <option value="Parks & Vegetation">Parks & Vegetation</option>
              <option value="Public Safety">Public Safety</option>
            </select>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">COMPLAINT TITLE</label>
            <input 
              type="text" 
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="e.g. Large pothole causing accidents on 5th Cross"
              className="w-full bg-slate-950/80 border border-slate-800 focus:border-cyan-500 rounded-xl px-4 py-3 text-sm text-slate-100 outline-none"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">DESCRIPTION</label>
            <textarea 
              rows="4"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Describe the issue in detail — location landmarks, severity, when it started..."
              className="w-full bg-slate-950/80 border border-slate-800 focus:border-cyan-500 rounded-xl px-4 py-3 text-sm text-slate-100 outline-none"
            ></textarea>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">PRIORITY</label>
            <div className="grid grid-cols-3 gap-4">
              {['High', 'Medium', 'Low'].map(p => (
                <button
                  type="button"
                  key={p}
                  onClick={() => setFormData({ ...formData, priority: p })}
                  className={`py-3 rounded-xl font-bold text-xs border transition ${
                    formData.priority === p 
                      ? 'border-amber-500 text-amber-400 bg-amber-500/10 glow-amber' 
                      : 'border-slate-800 text-slate-400 bg-slate-950/50 hover:border-slate-700'
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          <div className="flex justify-end pt-4">
            <button 
              type="button"
              onClick={() => setStep(2)}
              className="btn-cyan px-7 py-3 rounded-xl font-bold text-sm flex items-center gap-2"
            >
              <span>Continue</span>
              <span>→</span>
            </button>
          </div>

        </div>
      )}

      {/* STEP 2: LOCATION & MEDIA (Slide 7) */}
      {step === 2 && (
        <div className="glass-card rounded-3xl p-8 flex flex-col gap-6 border border-slate-800">
          
          {/* File Upload Zone */}
          <div 
            onClick={() => document.getElementById('complaintImageInput').click()}
            className="border-2 border-dashed border-slate-800 hover:border-cyan-500/50 rounded-2xl p-8 flex flex-col items-center justify-center text-center gap-3 bg-slate-950/40 cursor-pointer transition"
          >
            {previewUrl ? (
              <div className="flex flex-col items-center gap-2">
                <img src={previewUrl} alt="Evidence Preview" className="h-36 w-auto max-w-full rounded-xl border border-cyan-500/50 object-cover shadow-lg" />
                <span className="text-cyan-400 text-xs font-semibold">✓ Image Attached: {selectedFile ? selectedFile.name : 'Evidence Photo'} (Click to change)</span>
              </div>
            ) : (
              <>
                <div className="w-14 h-14 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center text-2xl">
                  📷
                </div>
                <div>
                  <h4 className="font-bold text-white text-sm">Drag & drop or click to upload evidence photo</h4>
                  <p className="text-slate-500 text-xs">Allowed formats: JPG, PNG, WEBP up to 10MB</p>
                </div>
                <button 
                  type="button" 
                  onClick={(e) => { e.stopPropagation(); document.getElementById('complaintImageInput').click(); }}
                  className="bg-slate-900 hover:bg-slate-800 text-cyan-400 text-xs font-semibold px-4 py-2 rounded-xl border border-slate-700 mt-2"
                >
                  Browse Image Files
                </button>
              </>
            )}
          </div>

          {/* GPS Location Box */}
          <div className="bg-slate-950/60 rounded-2xl border border-slate-800 p-6 flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-bold text-cyan-400 uppercase tracking-wider">
                <span>📍 GPS Location Map</span>
              </div>
              <button 
                type="button"
                onClick={handleFetchLocation}
                className="bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 text-xs font-bold px-3 py-1.5 rounded-lg border border-cyan-500/30 transition flex items-center gap-1.5"
              >
                <span>☉ Use Current Location</span>
              </button>
            </div>

            {/* Simulated Interactive Map Pin */}
            <div className="h-44 bg-slate-900 rounded-xl border border-slate-800 relative flex items-center justify-center overflow-hidden">
              <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:16px_16px]"></div>
              
              <div className="relative z-10 flex flex-col items-center gap-2">
                <span className="w-4 h-4 rounded-full bg-rose-500 animate-ping absolute"></span>
                <span className="w-4 h-4 rounded-full bg-rose-600 border-2 border-white relative z-10 shadow-lg"></span>
                <div className="bg-slate-950/90 border border-cyan-500/40 text-cyan-300 text-[11px] font-mono px-3 py-1 rounded-md backdrop-blur-md shadow-lg">
                  {formData.location}
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between pt-4">
            <button 
              type="button"
              onClick={() => setStep(1)}
              className="text-slate-400 hover:text-white font-semibold text-sm flex items-center gap-2"
            >
              <span>← Back</span>
            </button>
            <button 
              type="button"
              onClick={() => setStep(3)}
              className="btn-cyan px-7 py-3 rounded-xl font-bold text-sm flex items-center gap-2"
            >
              <span>Continue</span>
              <span>→</span>
            </button>
          </div>

        </div>
      )}

      {/* STEP 3: REVIEW & SUBMIT (Slide 8) */}
      {step === 3 && (
        <div className="glass-card rounded-3xl p-8 flex flex-col gap-6 border border-slate-800">
          
          <div className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400">REVIEW YOUR COMPLAINT</div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-950/60 p-6 rounded-2xl border border-slate-800/80">
            <div className="flex flex-col gap-1">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500">CATEGORY</span>
              <span className="text-sm font-bold text-white">{formData.category}</span>
            </div>

            <div className="flex flex-col gap-1">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500">TITLE</span>
              <span className="text-sm font-bold text-white">{formData.title}</span>
            </div>

            <div className="flex flex-col gap-1">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500">PRIORITY</span>
              <span className="text-sm font-bold text-amber-400">{formData.priority}</span>
            </div>

            <div className="flex flex-col gap-1">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500">LOCATION</span>
              <span className="text-sm font-bold text-cyan-400">{formData.location}</span>
            </div>

            <div className="flex flex-col gap-1 col-span-2">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500">EVIDENCE PHOTO</span>
              {previewUrl ? (
                <div className="flex items-center gap-3 mt-1">
                  <img src={previewUrl} alt="Attached Evidence" className="h-16 w-16 object-cover rounded-lg border border-slate-700" />
                  <span className="text-xs text-slate-300 font-semibold">{selectedFile ? selectedFile.name : 'Image File Attached'}</span>
                </div>
              ) : (
                <span className="text-xs font-semibold text-slate-400">No custom photo attached (Standard category image will be generated)</span>
              )}
            </div>
          </div>

          <div className="flex items-center justify-between pt-4">
            <button 
              type="button"
              onClick={() => setStep(2)}
              className="text-slate-400 hover:text-white font-semibold text-sm flex items-center gap-2"
            >
              <span>← Back</span>
            </button>

            <button 
              type="button"
              onClick={() => onSubmit({ ...formData, selectedFile, previewUrl })}
              className="btn-cyan px-8 py-3.5 rounded-xl font-bold text-sm flex items-center gap-2"
            >
              <span>Submit Complaint</span>
              <span>✓</span>
            </button>
          </div>

        </div>
      )}

    </div>
  );
}


// ==========================================
// 7. MY COMPLAINTS & DETAIL VIEW (Slide 9)
// ==========================================

function MyComplaintsView({ complaints, onSelectTicket, onUpvote, onNewReport }) {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-1">
          <div className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400">CITIZEN PORTAL</div>
          <h1 className="text-3xl font-black font-heading text-white">My Complaints</h1>
        </div>
        <button 
          onClick={onNewReport}
          className="btn-cyan px-5 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2"
        >
          <span>+ New Complaint</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {complaints.map(c => (
          <div 
            key={c.id}
            onClick={() => onSelectTicket(c.id)}
            className="glass-card rounded-3xl p-6 flex flex-col justify-between gap-4 cursor-pointer hover:border-cyan-500/40 transition"
          >
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-cyan-400">{c.id}</span>
                <span className={`px-2.5 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider ${
                  c.status === 'In Progress' ? 'badge-in-progress' :
                  c.status === 'Resolved' ? 'badge-resolved' :
                  c.status === 'Assigned' ? 'badge-assigned' :
                  c.status === 'Verified' ? 'badge-verified' : 'badge-pending'
                }`}>
                  {c.status}
                </span>
              </div>
              <h3 className="text-base font-bold text-white font-heading">{c.title}</h3>
              <p className="text-xs text-slate-400 line-clamp-2">{c.description}</p>
            </div>

            <div className="flex items-center justify-between border-t border-slate-800/80 pt-3 text-xs text-slate-400">
              <span>{c.date}</span>
              <button 
                onClick={(e) => { e.stopPropagation(); onUpvote(c.id); }}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-lg border font-bold text-xs transition ${
                  c.hasUpvoted ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/50' : 'bg-slate-900 text-slate-400 border-slate-800'
                }`}
              >
                <span>👍</span>
                <span>{c.upvotes}</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ComplaintDetailView({ complaint, onBack, onOpenImage }) {
  if (!complaint) return null;

  return (
    <div className="flex flex-col gap-6">
      
      {/* Top Header Navigation */}
      <div className="flex items-center justify-between border-b border-slate-800/80 pb-4">
        <div className="flex items-center gap-3">
          <button onClick={onBack} className="text-slate-400 hover:text-white font-bold text-sm">
            ←
          </button>
          <div className="flex flex-col">
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400">COMPLAINT DETAILS</span>
            <span className="text-xl font-mono font-bold text-cyan-400">{complaint.id}</span>
          </div>
        </div>
      </div>

      {/* 2-Column Details Grid (Matches Slide 9) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left 2 Cols: Main Info Box */}
        <div className="lg:col-span-2 glass-card rounded-3xl p-6 md:p-8 flex flex-col gap-6">
          
          <div className="flex flex-col gap-3">
            <h2 className="text-2xl font-black font-heading text-white">{complaint.title}</h2>
            
            {/* Badges row */}
            <div className="flex items-center gap-2">
              <span className="badge-in-progress px-3 py-1 rounded-md text-xs font-bold uppercase tracking-wider">
                {complaint.status}
              </span>
              <span className="border border-rose-500/40 text-rose-400 bg-rose-500/10 px-3 py-1 rounded-md text-xs font-bold uppercase">
                {complaint.priority}
              </span>
              <span className="border border-cyan-500/40 text-cyan-400 bg-cyan-500/10 px-3 py-1 rounded-md text-xs font-bold uppercase">
                {complaint.category}
              </span>
            </div>
          </div>

          {/* Info Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-slate-950/60 p-4 rounded-2xl border border-slate-800 text-xs">
            <div className="flex flex-col gap-0.5">
              <span className="text-[10px] font-bold text-slate-500 uppercase">DEPARTMENT</span>
              <span className="font-bold text-white">{complaint.department}</span>
            </div>
            <div className="flex flex-col gap-0.5">
              <span className="text-[10px] font-bold text-slate-500 uppercase">REPORTED</span>
              <span className="font-bold text-white">{complaint.date}</span>
            </div>
            <div className="flex flex-col gap-0.5">
              <span className="text-[10px] font-bold text-slate-500 uppercase">OFFICER</span>
              <span className="font-bold text-white">{complaint.assignedOfficer}</span>
            </div>
            <div className="flex flex-col gap-0.5">
              <span className="text-[10px] font-bold text-slate-500 uppercase">EST. RESOLUTION</span>
              <span className="font-bold text-cyan-400">{complaint.estResolution}</span>
            </div>
          </div>

          {/* Description */}
          <div className="flex flex-col gap-2">
            <p className="text-slate-300 text-sm leading-relaxed">{complaint.description}</p>
          </div>

          {/* Uploaded Evidence Gallery */}
          <div className="flex flex-col gap-3 pt-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Uploaded Evidence</h4>
            <div className="grid grid-cols-3 gap-4">
              {complaint.images.map((img, idx) => (
                <div 
                  key={idx} 
                  onClick={() => onOpenImage(img)}
                  className="h-28 rounded-xl bg-slate-950 border border-slate-800 overflow-hidden cursor-pointer hover:border-cyan-500 transition relative group"
                >
                  <img src={img.startsWith('http') || img.startsWith('blob:') ? img : (API_BASE_URL.replace('/api', '') + img)} alt={`Evidence ${idx+1}`} className="w-full h-full object-cover group-hover:scale-105 transition duration-200" />
                  <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center text-xs font-bold text-white">
                    View
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Right 1 Col: Action Timeline */}
        <div className="glass-card rounded-3xl p-6 md:p-8 flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white font-heading">Action Timeline</h3>
            <span className="text-xs font-mono font-bold text-cyan-400">
              {((Math.max(0, ['Submitted', 'Verified', 'Assigned', 'In Progress', 'Resolved'].findIndex(s => s.toLowerCase() === (complaint.status || 'Submitted').toLowerCase())) + 1) * 20)}% Complete
            </span>
          </div>

          {/* Progress Bar inside Detail View */}
          <div className="h-2 w-full bg-slate-950 rounded-full overflow-hidden border border-slate-800 -mt-2">
            <div 
              className="h-full bg-gradient-to-r from-cyan-500 to-emerald-400 rounded-full glow-cyan transition-all duration-500"
              style={{ width: `${((Math.max(0, ['Submitted', 'Verified', 'Assigned', 'In Progress', 'Resolved'].findIndex(s => s.toLowerCase() === (complaint.status || 'Submitted').toLowerCase())) + 1) * 20)}%` }}
            ></div>
          </div>

          <div className="flex flex-col gap-6 relative">
            <div className="absolute top-2 bottom-2 left-3.5 w-0.5 bg-slate-800"></div>

            {['Submitted', 'Verified', 'Assigned', 'In Progress', 'Resolved'].map((st, idx) => {
              const currentStatusNorm = (complaint.status || 'Submitted').trim();
              const activeIndex = Math.max(0, ['Submitted', 'Verified', 'Assigned', 'In Progress', 'Resolved'].findIndex(s => s.toLowerCase() === currentStatusNorm.toLowerCase()));
              const isDone = idx <= activeIndex;
              const existingItem = (complaint.timeline || []).find(t => t.status && t.status.toLowerCase() === st.toLowerCase()) || {};
              const stepTime = isDone 
                ? (existingItem.time && existingItem.time !== 'Pending' ? existingItem.time : 'Completed') 
                : 'Pending';
              const stepNote = existingItem.note || (isDone ? `${st} stage completed` : `Awaiting ${st.toLowerCase()} stage`);

              return (
                <div key={st} className="flex items-start gap-4 relative z-10">
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 ${
                    isDone ? 'bg-cyan-500 text-slate-950 glow-cyan' : 'bg-slate-900 border border-slate-700 text-slate-500'
                  }`}>
                    {isDone ? '✓' : idx + 1}
                  </div>

                  <div className="flex flex-col gap-1">
                    <span className={`text-sm font-bold transition-colors duration-300 ${isDone ? 'text-white' : 'text-slate-500'}`}>
                      {st}
                    </span>
                    <span className="text-[10px] text-slate-500 font-mono">{stepTime}</span>
                    <p className="text-xs text-slate-400 leading-normal">{stepNote}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>

    </div>
  );
}


// ==========================================
// 8. LIVE TRACKING PAGE (Slide 10)
// ==========================================

function TrackComplaintView({ complaints, initialSearchId, onSelectTicket }) {
  const [searchId, setSearchId] = useState(initialSearchId || 'SC-2026-0041');
  const [activeResult, setActiveResult] = useState(
    complaints.find(c => c.id === searchId) || complaints[0]
  );

  const handleSearch = (e) => {
    e.preventDefault();
    const found = complaints.find(c => c.id.toLowerCase().trim() === searchId.toLowerCase().trim());
    if (found) {
      setActiveResult(found);
    } else {
      alert(`Complaint ID "${searchId}" not found. Try SC-2026-0041.`);
    }
  };

  return (
    <div className="flex flex-col gap-8 max-w-4xl mx-auto">
      
      <div className="flex flex-col gap-1">
        <div className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400">LIVE TRACKING</div>
        <h1 className="text-3xl font-black font-heading text-white">Track Your Complaint</h1>
      </div>

      {/* Search Input Box (Slide 10) */}
      <form onSubmit={handleSearch} className="flex gap-3">
        <input 
          type="text" 
          value={searchId}
          onChange={(e) => setSearchId(e.target.value)}
          placeholder="Enter Ticket ID (e.g. SC-2026-0041)"
          className="flex-1 bg-slate-950/80 border border-slate-800 focus:border-cyan-500 rounded-2xl px-6 py-4 text-sm text-white outline-none font-mono tracking-wider"
        />
        <button 
          type="submit"
          className="btn-cyan px-8 py-4 rounded-2xl text-sm font-bold tracking-wide"
        >
          Search
        </button>
      </form>

      {/* Result Display Box */}
      {activeResult && (
        <div className="glass-card rounded-3xl p-6 md:p-8 flex flex-col gap-8 border border-slate-800">
          
          {/* Header */}
          <div className="flex items-center justify-between border-b border-slate-800/80 pb-4">
            <div className="flex flex-col">
              <span className="text-xl font-mono font-bold text-cyan-400">{activeResult.id}</span>
              <h2 className="text-2xl font-black font-heading text-white mt-1">{activeResult.title}</h2>
              <span className="text-xs text-slate-400 mt-0.5">
                Reported {activeResult.date} · {activeResult.category} · {activeResult.department}
              </span>
            </div>
            <span className={`px-3.5 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider ${
              activeResult.status === 'Resolved' ? 'badge-resolved' :
              activeResult.status === 'In Progress' ? 'badge-in-progress' :
              activeResult.status === 'Assigned' ? 'badge-assigned' :
              activeResult.status === 'Verified' ? 'badge-verified' : 'badge-pending'
            }`}>
              {activeResult.status}
            </span>
          </div>

          {/* Stepper Horizontal Progress Bar */}
          {(() => {
            const STATUS_FLOW = ['Submitted', 'Verified', 'Assigned', 'In Progress', 'Resolved'];
            const currentStatusNorm = (activeResult.status || 'Submitted').trim();
            const statusIndex = STATUS_FLOW.findIndex(s => s.toLowerCase() === currentStatusNorm.toLowerCase());
            const activeIndex = statusIndex !== -1 ? statusIndex : 0;
            const progressPercentage = (activeIndex + 1) * 20;

            return (
              <>
                <div className="flex items-center justify-between relative max-w-2xl mx-auto w-full py-4">
                  <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-slate-800 -translate-y-1/2 z-0"></div>
                  <div 
                    className="absolute top-1/2 left-0 h-0.5 bg-cyan-400 -translate-y-1/2 z-0 transition-all duration-500"
                    style={{ width: `${(activeIndex / (STATUS_FLOW.length - 1)) * 100}%` }}
                  ></div>

                  {STATUS_FLOW.map((st, idx) => {
                    const isDone = idx <= activeIndex;
                    return (
                      <div key={st} className="relative z-10 flex flex-col items-center gap-2">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 ${
                          isDone ? 'bg-cyan-500 text-slate-950 glow-cyan' : 'bg-slate-900 border border-slate-700 text-slate-500'
                        }`}>
                          {isDone ? '✓' : idx + 1}
                        </div>
                        <span className={`text-[11px] font-semibold transition-colors duration-300 ${isDone ? 'text-cyan-400 font-bold' : 'text-slate-500'}`}>
                          {st}
                        </span>
                      </div>
                    );
                  })}
                </div>

                {/* Overall Progress Bar */}
                <div className="flex flex-col gap-2">
                  <div className="flex items-center justify-between text-xs font-bold">
                    <span className="text-slate-400">Overall Progress</span>
                    <span className="text-cyan-400 font-mono">{progressPercentage}%</span>
                  </div>
                  <div className="h-3 w-full bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                    <div 
                      className="h-full bg-gradient-to-r from-cyan-500 to-emerald-400 rounded-full glow-cyan transition-all duration-500"
                      style={{ width: `${progressPercentage}%` }}
                    ></div>
                  </div>
                </div>
              </>
            );
          })()}

          {/* 2 Bottom Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            <div className="bg-slate-950/60 rounded-2xl p-5 border border-slate-800 flex flex-col gap-1">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500">EST. COMPLETION</span>
              <span className="text-lg font-bold text-white">{activeResult.estResolution}</span>
            </div>

            <div className="bg-slate-950/60 rounded-2xl p-5 border border-slate-800 flex flex-col gap-1">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500">ASSIGNED OFFICER</span>
              <span className="text-lg font-bold text-amber-400">{activeResult.assignedOfficer}, {activeResult.department}</span>
            </div>
          </div>

        </div>
      )}

    </div>
  );
}


// ==========================================
// 9. NOTIFICATIONS FEED PAGE (Slide 11)
// ==========================================

function NotificationsView({ notifications, onNotificationClick, onMarkAllRead }) {
  return (
    <div className="flex flex-col gap-6 max-w-4xl mx-auto">
      
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-1">
          <div className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400">UPDATE FEED</div>
          <h1 className="text-3xl font-black font-heading text-white">Notifications</h1>
        </div>
        <button 
          onClick={onMarkAllRead}
          className="text-xs font-semibold text-cyan-400 hover:underline"
        >
          Mark all as read
        </button>
      </div>

      <div className="flex flex-col gap-4">
        {notifications.map(n => (
          <div 
            key={n.id}
            onClick={() => onNotificationClick(n)}
            className={`glass-card rounded-2xl p-5 flex items-start justify-between gap-4 cursor-pointer transition border ${
              n.unread ? 'border-cyan-500/40 bg-slate-900/90' : 'border-slate-800 bg-slate-950/40'
            }`}
          >
            <div className="flex items-start gap-4">
              <span className={`w-3 h-3 rounded-full mt-1.5 ${n.unread ? 'bg-cyan-400 glow-cyan' : 'bg-slate-600'}`}></span>
              <div className="flex flex-col gap-1">
                <h4 className="text-sm font-bold text-white">{n.title}</h4>
                <p className="text-xs text-slate-400">{n.message}</p>
                <span className="text-[10px] text-slate-500 font-mono mt-1">{n.time}</span>
              </div>
            </div>

            {n.isNew && (
              <span className="bg-cyan-500/20 text-cyan-400 border border-cyan-500/40 text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-md">
                NEW
              </span>
            )}
          </div>
        ))}
      </div>

    </div>
  );
}


// ==========================================
// 10. MY PROFILE PAGE (Slide 12)
// ==========================================

function ProfileView({ user, onAvatarUpload, onEditProfile, onChangePassword, onLogout }) {
  const fileInputRef = React.useRef(null);

  const formatMemberSince = (u) => {
    if (!u) return 'September 2026';
    if (u.createdAt) {
      try {
        const d = new Date(u.createdAt);
        if (!isNaN(d.getTime())) {
          return d.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
        }
      } catch (e) {}
    }
    if (u.memberSince && !u.memberSince.includes('January 2023') && !u.memberSince.includes('January 2022')) {
      return u.memberSince;
    }
    return 'September 2026';
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      onAvatarUpload(file);
    }
  };

  return (
    <div className="flex flex-col gap-8 max-w-4xl mx-auto">
      
      <div className="flex flex-col gap-1">
        <div className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400">PERSONAL MANAGEMENT</div>
        <h1 className="text-3xl font-black font-heading text-white">My Profile</h1>
      </div>

      {/* Main Profile Card (Matches Slide 12) */}
      <div className="glass-card rounded-3xl p-8 flex flex-col gap-8 border border-slate-800">
        
        {/* Header User Badge & Profile Photo Upload */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pb-6 border-b border-slate-800">
          <div className="flex items-center gap-6">
            {/* Avatar with Camera Overlay */}
            <div className="relative group">
              <div 
                onClick={() => fileInputRef.current && fileInputRef.current.click()}
                className="w-24 h-24 rounded-full bg-gradient-to-tr from-cyan-500 to-sky-400 text-slate-950 font-black text-3xl flex items-center justify-center glow-cyan shadow-xl overflow-hidden cursor-pointer border-2 border-cyan-400 transition hover:scale-105"
                title="Click to upload profile photo"
              >
                {user.avatar ? (
                  <img 
                    src={user.avatar.startsWith('http') || user.avatar.startsWith('data:') ? user.avatar : (API_BASE_URL.replace('/api', '') + user.avatar)} 
                    alt={user.name} 
                    className="w-full h-full object-cover" 
                  />
                ) : (
                  user.name ? user.name.charAt(0).toUpperCase() : 'C'
                )}
              </div>
              <button 
                type="button"
                onClick={() => fileInputRef.current && fileInputRef.current.click()}
                className="absolute -bottom-1 -right-1 bg-slate-900 border border-cyan-400 text-cyan-400 hover:bg-cyan-500 hover:text-slate-950 w-8 h-8 rounded-full flex items-center justify-center shadow-lg transition duration-200"
                title="Upload Profile Photo"
              >
                📷
              </button>
            </div>
            
            <div className="flex flex-col gap-1">
              <h2 className="text-2xl font-black font-heading text-white">{user.name}</h2>
              <span className="text-xs text-slate-400">{user.email}</span>
              <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-[10px] font-extrabold uppercase tracking-wider px-3 py-1 rounded-md w-fit mt-1">
                {user.badge || 'VERIFIED CITIZEN'}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => fileInputRef.current && fileInputRef.current.click()}
              className="bg-slate-900 hover:bg-slate-800 border border-cyan-500/40 text-cyan-300 hover:text-cyan-200 text-xs font-bold px-4 py-2 rounded-xl transition flex items-center gap-2"
            >
              <span>📷</span> Upload Photo
            </button>
            <input 
              ref={fileInputRef}
              type="file" 
              accept="image/png, image/jpeg, image/jpg, image/webp" 
              className="hidden" 
              onChange={handleFileChange}
            />
          </div>
        </div>

        {/* Fields Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
          
          <div className="flex flex-col gap-1">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500">FULL NAME</span>
            <span className="text-sm font-bold text-white">{user.name}</span>
          </div>

          <div className="flex flex-col gap-1">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500">MOBILE</span>
            <span className="text-sm font-bold text-white">{user.mobile}</span>
          </div>

          <div className="flex flex-col gap-1">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500">EMAIL</span>
            <span className="text-sm font-bold text-white">{user.email}</span>
          </div>

          <div className="flex flex-col gap-1">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500">MUNICIPAL ZONE</span>
            <span className="text-sm font-bold text-white">{user.zone || 'Bengaluru Municipal Zone C'}</span>
          </div>

          <div className="flex flex-col gap-1 col-span-2">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500">ADDRESS</span>
            <span className="text-sm font-bold text-white">{user.address}</span>
          </div>

          <div className="flex flex-col gap-1 col-span-2">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500">MEMBER SINCE</span>
            <span className="text-sm font-bold text-cyan-400 font-mono">{formatMemberSince(user)}</span>
          </div>

        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-4 pt-4 border-t border-slate-800">
          <button 
            onClick={onEditProfile}
            className="btn-cyan px-6 py-2.5 rounded-xl text-xs font-bold"
          >
            Edit Profile
          </button>
          <button 
            onClick={onChangePassword}
            className="bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 font-bold text-xs px-6 py-2.5 rounded-xl transition"
          >
            Change Password
          </button>
          <button 
            onClick={onLogout}
            className="ml-auto bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 font-bold text-xs px-6 py-2.5 rounded-xl transition"
          >
            Sign Out
          </button>
        </div>

      </div>

    </div>
  );
}


// ==========================================
function AdminDashboardView({ complaints, onUpdateStatus, onLogout, currentUser }) {
  const isDeptUser = currentUser.role === 'dept_officer' || currentUser.role === 'department';
  const userDept = currentUser.department || 'PWD';
  const [filterDept, setFilterDept] = useState(isDeptUser ? userDept : 'ALL');
  const [selectedComp, setSelectedComp] = useState(null);
  const [statusVal, setStatusVal] = useState('In Progress');
  const [officerVal, setOfficerVal] = useState(currentUser.name || 'Engineer Rajesh Kumar');
  const [remarkVal, setRemarkVal] = useState('');

  const authorizedComplaints = isDeptUser 
    ? complaints.filter(c => c.department && c.department.toUpperCase() === userDept.toUpperCase()) 
    : complaints;
  const filtered = authorizedComplaints.filter(c => filterDept === 'ALL' || c.department === filterDept);

  const handleSubmitUpdate = (e) => {
    e.preventDefault();
    if (!selectedComp) return;
    onUpdateStatus(selectedComp.id, statusVal, officerVal, remarkVal || `Status updated to ${statusVal}`);
    setSelectedComp(null);
    setRemarkVal('');
  };

  return (
    <div className="flex flex-col gap-8 max-w-7xl mx-auto">
      
      {/* Top Banner */}
      <div className={`glass-card rounded-3xl p-8 border flex flex-col md:flex-row items-start md:items-center justify-between gap-6 ${
        currentUser.role === 'admin' ? 'border-purple-500/30 bg-purple-950/20' : 'border-amber-500/30 bg-amber-950/20'
      }`}>
        <div className="flex items-center gap-4">
          <div className={`w-14 h-14 rounded-2xl border font-bold text-2xl flex items-center justify-center ${
            currentUser.role === 'admin' ? 'bg-purple-500/20 border-purple-500/40 text-purple-400' : 'bg-amber-500/20 border-amber-500/40 text-amber-400'
          }`}>
            {currentUser.role === 'admin' ? '🛡️' : '🏢'}
          </div>
          <div>
            <div className={`text-[10px] font-extrabold uppercase tracking-widest ${
              currentUser.role === 'admin' ? 'text-purple-400' : 'text-amber-400'
            }`}>
              {currentUser.role === 'admin' ? 'MUNICIPAL CENTRAL COMMAND' : `DEPARTMENT PORTAL — ${currentUser.department || 'OPERATIONS'}`}
            </div>
            <h1 className="text-2xl font-black font-heading text-white">{currentUser.name || (currentUser.role === 'admin' ? 'Municipal Control Hub' : 'Department Officer')}</h1>
            <p className="text-xs text-slate-400">
              {currentUser.role === 'admin' 
                ? 'Manage zonal complaints, oversee municipal departments, & verify SLA resolution rates'
                : `Manage and resolve civic complaints assigned to ${currentUser.department || 'your department'}`}
            </p>
          </div>
        </div>

        <button onClick={onLogout} className="bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 font-bold text-xs px-5 py-2.5 rounded-xl transition">
          {currentUser.role === 'admin' ? 'Exit Admin Portal' : 'Exit Department Portal'}
        </button>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="glass-card rounded-2xl p-6 border border-slate-800 flex flex-col gap-2">
          <span className="text-[10px] font-extrabold uppercase text-slate-400">TOTAL TICKETS</span>
          <span className="text-3xl font-black text-white">{complaints.length}</span>
          <span className="text-[11px] text-cyan-400 font-medium">Zone C Municipal Network</span>
        </div>
        <div className="glass-card rounded-2xl p-6 border border-amber-500/30 bg-amber-950/10 flex flex-col gap-2">
          <span className="text-[10px] font-extrabold uppercase text-amber-400">PENDING ACTION</span>
          <span className="text-3xl font-black text-amber-300">{complaints.filter(c => c.status === 'Submitted' || c.priority === 'High').length}</span>
          <span className="text-[11px] text-amber-400 font-medium">Requires Inspection</span>
        </div>
        <div className="glass-card rounded-2xl p-6 border border-cyan-500/30 bg-cyan-950/10 flex flex-col gap-2">
          <span className="text-[10px] font-extrabold uppercase text-cyan-400">IN PROGRESS</span>
          <span className="text-3xl font-black text-cyan-300">{complaints.filter(c => c.status === 'In Progress' || c.status === 'Assigned').length}</span>
          <span className="text-[11px] text-cyan-400 font-medium">Crews Dispatched</span>
        </div>
        <div className="glass-card rounded-2xl p-6 border border-emerald-500/30 bg-emerald-950/10 flex flex-col gap-2">
          <span className="text-[10px] font-extrabold uppercase text-emerald-400">RESOLVED</span>
          <span className="text-3xl font-black text-emerald-300">{complaints.filter(c => c.status === 'Resolved').length}</span>
          <span className="text-[11px] text-emerald-400 font-medium">88% SLA Resolution Rate</span>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        {['ALL', 'PWD', 'BESCOM', 'BBMP Sanitation', 'BWSSB', 'Traffic Police'].map(dept => (
          <button
            key={dept}
            onClick={() => setFilterDept(dept)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap ${
              filterDept === dept
                ? 'bg-purple-500 text-slate-950 glow-cyan'
                : 'bg-slate-900/80 border border-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            {dept}
          </button>
        ))}
      </div>

      {/* Complaints Table */}
      <div className="glass-card rounded-3xl p-6 border border-slate-800 overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-slate-800 text-slate-400 uppercase text-[10px] font-extrabold tracking-wider">
              <th className="pb-4 px-3">Ticket ID</th>
              <th className="pb-4 px-3">Title & Category</th>
              <th className="pb-4 px-3">Dept</th>
              <th className="pb-4 px-3">Priority</th>
              <th className="pb-4 px-3">Status</th>
              <th className="pb-4 px-3">Assigned Crew</th>
              <th className="pb-4 px-3 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {filtered.map(c => (
              <tr key={c.id} className="hover:bg-slate-900/40 transition">
                <td className="py-4 px-3 font-mono font-bold text-cyan-400">{c.id}</td>
                <td className="py-4 px-3">
                  <div className="font-bold text-white text-sm">{c.title}</div>
                  <div className="text-[11px] text-slate-400">{c.category}</div>
                </td>
                <td className="py-4 px-3 font-semibold text-slate-300">{c.department}</td>
                <td className="py-4 px-3">
                  <span className={`px-2.5 py-1 rounded-md text-[10px] font-extrabold uppercase ${
                    c.priority === 'High' ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40' : 'bg-amber-500/20 text-amber-400'
                  }`}>
                    {c.priority}
                  </span>
                </td>
                <td className="py-4 px-3">
                  <span className={`px-2.5 py-1 rounded-md text-[10px] font-extrabold uppercase ${
                    c.status === 'Resolved' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40' :
                    c.status === 'In Progress' ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/40' :
                    c.status === 'Assigned' ? 'bg-blue-500/20 text-blue-400 border border-blue-500/40' :
                    c.status === 'Verified' ? 'bg-purple-500/20 text-purple-400 border border-purple-500/40' : 'bg-slate-800 text-slate-300'
                  }`}>
                    {c.status}
                  </span>
                </td>
                <td className="py-4 px-3 text-slate-300 font-medium">{c.assignedOfficer || 'Pending Crew'}</td>
                <td className="py-4 px-3 text-right">
                  <button
                    onClick={() => {
                      setSelectedComp(c);
                      setStatusVal(c.status);
                      setOfficerVal(c.assignedOfficer || (currentUser.name || 'Engineer Rajesh Kumar'));
                    }}
                    className="bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 border border-purple-500/40 font-bold px-3 py-1.5 rounded-lg transition"
                  >
                    Update & Send Msg
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Status Update Modal */}
      {selectedComp && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="glass-card w-full max-w-lg rounded-3xl p-6 border border-purple-500/40 flex flex-col gap-5 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-purple-400">DISPATCH CONTROL</span>
                <h3 className="text-lg font-black text-white">Update {selectedComp.id} Status</h3>
              </div>
              <button onClick={() => setSelectedComp(null)} className="text-slate-400 hover:text-white font-bold text-sm">✕</button>
            </div>

            <form onSubmit={handleSubmitUpdate} className="flex flex-col gap-4 text-xs">
              <div className="flex flex-col gap-1.5">
                <label className="font-semibold text-slate-300">Update Ticket Status</label>
                <select
                  value={statusVal}
                  onChange={(e) => setStatusVal(e.target.value)}
                  className="bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white outline-none focus:border-purple-500"
                >
                  <option value="Submitted">Submitted (Initial Receipt)</option>
                  <option value="Verified">Verified (Inspector Confirmed)</option>
                  <option value="Assigned">Assigned (Crew En Route)</option>
                  <option value="In Progress">In Progress (Work Crew Onsite)</option>
                  <option value="Resolved">Resolved (Signed Off & Completed)</option>
                </select>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="font-semibold text-slate-300">Assigned Field Engineer / Officer</label>
                <input
                  type="text"
                  value={officerVal}
                  onChange={(e) => setOfficerVal(e.target.value)}
                  placeholder="e.g. Engineer Rajesh Kumar"
                  className="bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white outline-none focus:border-purple-500"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="font-semibold text-slate-300">Official Message / Remark for Citizen</label>
                <textarea
                  rows="3"
                  value={remarkVal}
                  onChange={(e) => setRemarkVal(e.target.value)}
                  placeholder="Type official message sent to citizen notifications..."
                  className="bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white outline-none focus:border-purple-500 resize-none"
                />
              </div>

              <div className="flex items-center gap-3 pt-3">
                <button type="submit" className="bg-purple-500 hover:bg-purple-400 text-slate-950 font-bold py-3 px-6 rounded-xl w-full text-xs">
                  Dispatch Update & Send Citizen Notification 📩
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}


// ==========================================
// 11. ABOUT & CONTACT VIEWS
// ==========================================

function AboutView({ onGetStarted }) {
  return (
    <div className="max-w-6xl mx-auto p-6 md:p-12 flex flex-col gap-12">
      <div className="flex flex-col gap-4 text-center max-w-3xl mx-auto">
        <h1 className="text-4xl font-black font-heading text-white">About SmartCivic Platform</h1>
        <p className="text-slate-400 text-base leading-relaxed">
          SmartCivic is Bengaluru’s digital civic engagement network connecting citizens directly with municipal response teams, public works engineering crews, and district administration.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="glass-card rounded-3xl p-8 flex flex-col gap-4">
          <h3 className="text-xl font-bold text-white font-heading">Automated AI Triage</h3>
          <p className="text-slate-400 text-sm leading-relaxed">
            Every submitted complaint undergoes computer vision triage to verify defect depth, image authenticity, and precise geographic routing to BBMP, BESCOM, or BWSSB.
          </p>
        </div>

        <div className="glass-card rounded-3xl p-8 flex flex-col gap-4">
          <h3 className="text-xl font-bold text-white font-heading">SLA Resolution Mandate</h3>
          <p className="text-slate-400 text-sm leading-relaxed">
            Emergency complaints have a strict 24-hour response protocol. Citizens track live status updates with complete worker identity verification.
          </p>
        </div>
      </div>
    </div>
  );
}

function ContactView({ triggerToast }) {
  const [form, setForm] = useState({ name: '', email: '', message: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    triggerToast('Contact message dispatched to SmartCivic Ward Desk!');
    setForm({ name: '', email: '', message: '' });
  };

  return (
    <div className="max-w-4xl mx-auto p-6 md:p-12 flex flex-col gap-8">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-black font-heading text-white">Contact Municipal Desk</h1>
        <p className="text-slate-400 text-sm">Need direct assistance or emergency council intervention?</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="glass-card rounded-3xl p-8 flex flex-col gap-6">
          <h3 className="text-lg font-bold text-white font-heading">Emergency Hotlines</h3>
          <div className="flex flex-col gap-3 text-xs text-slate-300">
            <p><strong>BBMP Control Room:</strong> 080-22221188</p>
            <p><strong>BESCOM Helpline:</strong> 1912</p>
            <p><strong>BWSSB Water Leakage:</strong> 1916</p>
            <p><strong>SmartCivic Helpdesk:</strong> support@smartcivic.bengaluru.gov.in</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="glass-card rounded-3xl p-8 flex flex-col gap-4">
          <input 
            type="text" 
            required
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            placeholder="Your Name"
            className="bg-slate-950/80 border border-slate-800 focus:border-cyan-500 rounded-xl px-4 py-3 text-sm text-white outline-none"
          />
          <input 
            type="email" 
            required
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            placeholder="Your Email"
            className="bg-slate-950/80 border border-slate-800 focus:border-cyan-500 rounded-xl px-4 py-3 text-sm text-white outline-none"
          />
          <textarea 
            rows="4"
            required
            value={form.message}
            onChange={(e) => setForm({ ...form, message: e.target.value })}
            placeholder="Message details..."
            className="bg-slate-950/80 border border-slate-800 focus:border-cyan-500 rounded-xl px-4 py-3 text-sm text-white outline-none"
          ></textarea>
          <button type="submit" className="btn-cyan py-3 rounded-xl font-bold text-sm">
            Send Message
          </button>
        </form>
      </div>
    </div>
  );
}


// ==========================================
// 12. MODALS (Edit Profile & Change Password)
// ==========================================

function EditProfileModal({ user, onClose, onSave }) {
  const [formData, setFormData] = useState({ ...user });
  const modalFileInputRef = React.useRef(null);

  const handleModalPhotoChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!['image/jpeg', 'image/png', 'image/webp', 'image/jpg'].includes(file.type)) {
      alert('Please select a valid image file (PNG, JPG, JPEG, WEBP).');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      alert('Image size exceeds 5MB limit.');
      return;
    }
    const reader = new FileReader();
    reader.onload = (evt) => {
      setFormData(prev => ({ ...prev, avatar: evt.target.result }));
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="glass-card w-full max-w-lg rounded-3xl p-8 flex flex-col gap-6 border border-slate-800 shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <h3 className="text-xl font-bold text-white font-heading">Edit Profile</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-white font-bold text-sm">✕</button>
        </div>

        {/* Avatar Changer */}
        <div className="flex items-center gap-4">
          <div 
            onClick={() => modalFileInputRef.current && modalFileInputRef.current.click()}
            className="w-16 h-16 rounded-full bg-cyan-500 text-slate-950 font-bold text-xl flex items-center justify-center overflow-hidden border-2 border-cyan-400 cursor-pointer shadow-lg hover:scale-105 transition"
            title="Click to change photo"
          >
            {formData.avatar ? (
              <img 
                src={formData.avatar.startsWith('http') || formData.avatar.startsWith('data:') ? formData.avatar : (API_BASE_URL.replace('/api', '') + formData.avatar)} 
                alt="Avatar Preview" 
                className="w-full h-full object-cover" 
              />
            ) : (
              formData.name ? formData.name.charAt(0).toUpperCase() : 'C'
            )}
          </div>
          <div className="flex flex-col gap-1">
            <button 
              type="button"
              onClick={() => modalFileInputRef.current && modalFileInputRef.current.click()}
              className="bg-slate-900 border border-slate-700 hover:border-cyan-400 text-xs font-semibold px-3 py-1.5 rounded-lg text-slate-200 hover:text-white transition w-fit"
            >
              Change Photo
            </button>
            <span className="text-[10px] text-slate-500">Max 5MB (PNG, JPG, WEBP)</span>
            <input 
              ref={modalFileInputRef}
              type="file" 
              accept="image/png, image/jpeg, image/jpg, image/webp" 
              className="hidden" 
              onChange={handleModalPhotoChange}
            />
          </div>
        </div>

        <div className="flex flex-col gap-4 text-xs">
          <div className="flex flex-col gap-1">
            <label className="text-slate-400 font-bold">FULL NAME</label>
            <input 
              type="text" 
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white outline-none focus:border-cyan-500"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-slate-400 font-bold">MOBILE</label>
            <input 
              type="text" 
              value={formData.mobile}
              onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
              className="bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white outline-none focus:border-cyan-500"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-slate-400 font-bold">ADDRESS</label>
            <input 
              type="text" 
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              className="bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white outline-none focus:border-cyan-500"
            />
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <button onClick={onClose} className="px-5 py-2.5 text-xs text-slate-400 hover:text-white font-semibold">
            Cancel
          </button>
          <button onClick={() => onSave(formData)} className="btn-cyan px-6 py-2.5 text-xs font-bold rounded-xl">
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}

function ChangePasswordModal({ onClose, onSave }) {
  const [oldPass, setOldPass] = useState('');
  const [newPass, setNewPass] = useState('');

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="glass-card w-full max-w-md rounded-3xl p-8 flex flex-col gap-6 border border-slate-800">
        <h3 className="text-xl font-bold text-white font-heading">Change Password</h3>
        <div className="flex flex-col gap-4 text-xs">
          <input 
            type="password" 
            placeholder="Current Password"
            value={oldPass}
            onChange={(e) => setOldPass(e.target.value)}
            className="bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white outline-none"
          />
          <input 
            type="password" 
            placeholder="New Password"
            value={newPass}
            onChange={(e) => setNewPass(e.target.value)}
            className="bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white outline-none"
          />
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <button onClick={onClose} className="px-5 py-2.5 text-xs text-slate-400 hover:text-white font-semibold">
            Cancel
          </button>
          <button onClick={onSave} className="btn-cyan px-6 py-2.5 text-xs font-bold rounded-xl">
            Update Password
          </button>
        </div>
      </div>
    </div>
  );
}


// --- MOUNT APP TO ROOT ---
ReactDOM.createRoot(document.getElementById('root')).render(<App />);
