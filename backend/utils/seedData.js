const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/User');
const Complaint = require('../models/Complaint');
const Notification = require('../models/Notification');
const connectDB = require('../config/db');

dotenv.config();

const INITIAL_COMPLAINTS_SEED = [
  {
    ticketId: 'SC-2026-0041',
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
    latitude: 12.9716,
    longitude: 77.5946,
    description: 'Large pothole approximately 40cm x 30cm x 15cm deep on MG Road near Ulsoor junction, causing vehicle damage and risk to two-wheelers. Reported by 14 citizens (upvoted). Prior complaint filed in March was partially patched.',
    upvotes: 14,
    upvotedBy: [],
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
    ],
    reportedBy: 'Arjun Sharma'
  },
  {
    ticketId: 'SC-2026-0038',
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
    latitude: 12.9780,
    longitude: 77.6400,
    description: 'Streetlight pole #42 on Block C 4th main street is dark for 3 days. Creates safety hazard during night hours.',
    upvotes: 8,
    upvotedBy: [],
    images: [
      'https://images.unsplash.com/photo-1509114397022-ed747cca3f65?auto=format&fit=crop&w=600&q=80'
    ],
    timeline: [
      { status: 'Submitted', time: 'Jul 18, 2026 20:30', note: 'Complaint registered by citizen', done: true },
      { status: 'Verified', time: 'Jul 18, 2026 21:15', note: 'Remote grid sensor confirmed outage', done: true },
      { status: 'Assigned', time: 'Jul 19, 2026 08:00', note: 'Assigned to BESCOM Linesman Suresh Gowda', done: true },
      { status: 'In Progress', time: 'Jul 19, 2026 09:30', note: 'Transformer bulb replacement underway', done: true },
      { status: 'Resolved', time: 'Jul 19, 2026 11:45', note: 'LED fixture replaced and tested working', done: true }
    ],
    reportedBy: 'Arjun Sharma'
  },
  {
    ticketId: 'SC-2026-0031',
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
    latitude: 12.9650,
    longitude: 77.5900,
    description: 'Public waste bins overflowing on main walkway. Garbage spilling onto pavement.',
    upvotes: 22,
    upvotedBy: [],
    images: [
      'https://images.unsplash.com/photo-1530587191325-3db32d826c18?auto=format&fit=crop&w=600&q=80'
    ],
    timeline: [
      { status: 'Submitted', time: 'Jul 15, 2026 11:20', note: 'Ticket registered by citizen', done: true },
      { status: 'Verified', time: 'Jul 15, 2026 14:00', note: 'Inspector verified waste overflow', done: true },
      { status: 'Assigned', time: 'Pending', note: 'En route for truck dispatch', done: false },
      { status: 'In Progress', time: 'Pending', note: 'Pending garbage sweep', done: false },
      { status: 'Resolved', time: 'Pending', note: 'Pending cleanup sign-off', done: false }
    ],
    reportedBy: 'Arjun Sharma'
  }
];

const seedDB = async () => {
  try {
    await connectDB();

    await User.deleteMany();
    await Complaint.deleteMany();
    await Notification.deleteMany();

    // Create Demo Citizen Users
    const citizen = await User.create({
      name: 'Arjun Sharma',
      email: 'arjun.sharma@gmail.com',
      password: 'password123',
      mobile: '+91 98765 43210',
      address: '123, 5th Cross, Indiranagar, Bengaluru 560038',
      role: 'citizen'
    });

    await User.create({
      name: 'Verified Citizen',
      email: 'citizen@example.gov.in',
      password: 'password123',
      mobile: '+91 98765 43210',
      address: '123, 5th Cross, Indiranagar, Bengaluru 560038',
      role: 'citizen'
    });

    // Create Default Department Officer User
    await User.create({
      name: 'Rajesh Kumar (PWD Officer)',
      email: 'officer.pwd@smartcivic.gov.in',
      password: 'officer123',
      mobile: '+91 98450 12345',
      address: 'PWD Sub-Division Office, Indiranagar',
      role: 'dept_officer',
      department: 'PWD',
      badge: 'CHIEF DISPATCH ENGINEER'
    });

    // Create Default Admin User
    const admin = await User.create({
      name: 'Municipal Admin',
      email: 'admin@smartcivic.gov.in',
      password: 'adminpassword123',
      mobile: '+91 99000 11223',
      address: 'BBMP Zone C Headquarters, Bengaluru',
      role: 'admin',
      badge: 'ZONAL COMMISSIONER'
    });

    // Link complaints to citizen
    const complaintsToInsert = INITIAL_COMPLAINTS_SEED.map(c => ({
      ...c,
      createdBy: citizen._id
    }));

    await Complaint.insertMany(complaintsToInsert);

    // Create Initial Notifications
    await Notification.create([
      {
        ticketId: 'SC-2026-0041',
        title: 'SC-2026-0041 Status Updated',
        message: 'Your complaint has been assigned to PWD department.',
        time: '2 hours ago',
        unread: true,
        isNew: true,
        user: citizen._id
      },
      {
        ticketId: 'SC-2026-0038',
        title: 'SC-2026-0038 Resolved',
        message: 'The streetlight issue has been successfully resolved.',
        time: '1 day ago',
        unread: true,
        isNew: true,
        user: citizen._id
      }
    ]);

    console.log('[Seed DB] Database seeded successfully!');
    console.log(`[Seed DB] Citizen Account: arjun.sharma@gmail.com / password123`);
    console.log(`[Seed DB] Admin Account: admin@smartcivic.gov.in / adminpassword123`);
    process.exit(0);
  } catch (error) {
    console.error(`[Seed Error] ${error.message}`);
    process.exit(1);
  }
};

if (require.main === module) {
  seedDB();
}

module.exports = seedDB;
