const mongoose = require('mongoose');
const Complaint = require('../models/Complaint');
const User = require('../models/User');

const CANONICAL_OFFICERS = [
  {
    email: 'officer.pwd@smartcivic.gov.in',
    name: 'Rajesh Kumar (PWD Officer)',
    department: 'PWD',
    role: 'dept_officer',
    badge: 'CHIEF DISPATCH ENGINEER',
    address: 'PWD Sub-Division Office, Indiranagar'
  },
  {
    email: 'officer.bescom@smartcivic.gov.in',
    name: 'Suresh Gowda (BESCOM Officer)',
    department: 'BESCOM',
    role: 'dept_officer',
    badge: 'BESCOM CHIEF ENGINEER',
    address: 'BESCOM Sub-Station, Indiranagar'
  },
  {
    email: 'officer.sanitation@smartcivic.gov.in',
    name: 'Anand Kumar (Sanitation Officer)',
    department: 'BBMP Sanitation',
    role: 'dept_officer',
    badge: 'CHIEF SANITATION INSPECTOR',
    address: 'BBMP Solid Waste Management Division, Bengaluru'
  },
  {
    email: 'officer.bwssb@smartcivic.gov.in',
    name: 'Venkatesh R (BWSSB Officer)',
    department: 'BWSSB',
    role: 'dept_officer',
    badge: 'CHIEF HYDRO ENGINEER',
    address: 'BWSSB Water Supply & Sewerage Board, Bengaluru'
  },
  {
    email: 'officer.traffic@smartcivic.gov.in',
    name: 'Inspector Ramesh (Traffic Police)',
    department: 'Traffic Police',
    role: 'dept_officer',
    badge: 'TRAFFIC DIVISION COMMAND',
    address: 'Traffic Police Control Station, Bengaluru'
  }
];

const runSafeMigration = async () => {
  try {
    console.log('[Safe Migration] Running safe data migration for canonical departments...');

    const res1 = await Complaint.updateMany(
      { department: 'BBMP Parks & Horticulture' },
      { $set: { department: 'BBMP Sanitation' } }
    );
    const res2 = await Complaint.updateMany(
      { department: 'City Patrol Command' },
      { $set: { department: 'Traffic Police' } }
    );

    if (res1.modifiedCount > 0 || res2.modifiedCount > 0) {
      console.log(`[Safe Migration] Updated ${res1.modifiedCount} complaints to BBMP Sanitation, ${res2.modifiedCount} to Traffic Police`);
    }

    for (const off of CANONICAL_OFFICERS) {
      const existing = await User.findOne({ email: off.email });
      if (existing) {
        if (!existing.department || existing.department !== off.department || existing.role !== 'dept_officer') {
          existing.department = off.department;
          existing.role = 'dept_officer';
          await existing.save();
          console.log(`[Safe Migration] Synced department for ${off.email}`);
        }
      } else {
        await User.create({
          ...off,
          password: 'officer123',
          mobile: '+91 98450 12345'
        });
        console.log(`[Safe Migration] Created canonical officer account for ${off.department} (${off.email})`);
      }
    }

    console.log('[Safe Migration] Migration completed successfully.');
  } catch (error) {
    console.error('[Safe Migration Error]', error.message);
  }
};

module.exports = runSafeMigration;
