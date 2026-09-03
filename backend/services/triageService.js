// Automated AI Triage Service for Department Routing & SLA Calculation

const CATEGORY_DEPARTMENT_MAP = {
  'Roads & Potholes': { department: 'PWD', officer: 'Rajesh Kumar', role: 'PWD Chief Engineer' },
  'Power & Streetlights': { department: 'BESCOM', officer: 'Suresh Gowda', role: 'BESCOM Electrical Linesman' },
  'Waste & Sanitation': { department: 'BBMP Sanitation', officer: 'Anand Kumar', role: 'Sanitation Inspector Zone 3' },
  'Water & Sewage': { department: 'BWSSB', officer: 'Venkatesh R', role: 'BWSSB Hydro Engineer' },
  'Traffic & Safety': { department: 'Traffic Police', officer: 'Inspector Ramesh', role: 'Traffic Division Sub-Inspector' },
  'Parks & Vegetation': { department: 'BBMP Sanitation', officer: 'Anand Kumar', role: 'Sanitation Inspector Zone 3' },
  'Public Safety': { department: 'Traffic Police', officer: 'Inspector Ramesh', role: 'Traffic Division Sub-Inspector' }
};

const calculateEstResolution = (priority) => {
  const targetDate = new Date();
  if (priority === 'High') {
    targetDate.setDate(targetDate.getDate() + 2);
  } else if (priority === 'Medium') {
    targetDate.setDate(targetDate.getDate() + 3);
  } else {
    targetDate.setDate(targetDate.getDate() + 5);
  }
  return targetDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};

const generateInitialTimeline = (ticketId, todayStr) => {
  return [
    { status: 'Submitted', time: `${todayStr} Just now`, note: `Complaint received and assigned ticket ID ${ticketId}`, done: true },
    { status: 'Verified', time: 'Pending', note: 'AI Triage & Inspector verification in progress', done: false },
    { status: 'Assigned', time: 'Pending', note: 'Awaiting department crew dispatch', done: false },
    { status: 'In Progress', time: 'Pending', note: 'Work crew scheduled', done: false },
    { status: 'Resolved', time: 'Pending', note: 'Pending final sign-off', done: false }
  ];
};

const triageComplaint = (category, priority, ticketId, dateStr) => {
  const deptInfo = CATEGORY_DEPARTMENT_MAP[category] || { department: 'PWD', officer: 'Rajesh Kumar', role: 'PWD Engineer' };
  const estResolution = calculateEstResolution(priority);
  const timeline = generateInitialTimeline(ticketId, dateStr);

  return {
    department: deptInfo.department,
    assignedOfficer: deptInfo.officer,
    officerRole: deptInfo.role,
    estResolution,
    timeline
  };
};

module.exports = {
  triageComplaint,
  CATEGORY_DEPARTMENT_MAP,
  calculateEstResolution
};
