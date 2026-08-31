# 🚀 SmartCivic — Complete Render + MongoDB Atlas Cloud Deployment Guide

This guide explains step-by-step how to deploy your **SmartCivic** application to **Render** as **ONE unified public web application** with a live MongoDB Atlas cloud database.

---

## 🎯 Architecture of the Deployed Application

When deployed to Render:
```text
                  https://smartcivic-xxxx.onrender.com
                                   │
                      ┌────────────▼────────────┐
                      │    Express Web Server   │
                      │  (Port from env / 5000) │
                      └────────────┬────────────┘
                                   │
         ┌─────────────────────────┼─────────────────────────┐
         │                         │                         │
┌────────▼────────┐       ┌────────▼────────┐       ┌────────▼────────┐
│ Frontend Assets │       │  REST API Layer │       │ MongoDB Atlas   │
│  • index.html   │       │  • /api/users   │       │  • Users        │
│  • app.js       │       │  • /api/compl   │       │  • Complaints   │
│  • styles.css   │       │  • /api/admin   │       │  • Notifications│
│  • /uploads     │       │  • /api/notif   │       │  • SLA Metrics  │
└─────────────────┘       └─────────────────┘       └─────────────────┘
```

* **One Git Repository**: Everything in your project folder.
* **One Web Service on Render**: Runs `node backend/server.js`.
* **One Public URL**: Opening `https://smartcivic-xxxx.onrender.com` loads the complete Citizen, Department, and Admin portals.

---

## 📋 Prerequisites
1. A free account on [GitHub](https://github.com).
2. A free account on [Render](https://render.com).
3. A free account on [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).

---

## 🟢 STEP 1: Set Up Free MongoDB Atlas Cloud Database

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) and log in.
2. Click **Create Deployment** (or **Build a Database**) and select the **FREE M0 Shared Cluster** (AWS, choose closest region like Mumbai / Frankfurt / Oregon).
3. Under **Security Quickstart**:
   - **Username**: e.g., `smartcivic_admin`
   - **Password**: Click **Autogenerate Secure Password** or set one (e.g. `SmartCivic2026Pass!`). *Copy this password down!*
   - Click **Create User**.
4. Under **Network Access** (Where would you like to connect from?):
   - Choose **Allow Access from Anywhere** (`0.0.0.0/0`).
   - Click **Add Entry**.
5. Click **Finish and Close** ➔ **Go to Overview**.
6. On your cluster dashboard, click **Connect**:
   - Select **Drivers** (Node.js).
   - Copy the connection string. It looks like:
     ```text
     mongodb+srv://smartcivic_admin:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
     ```
   - Replace `<password>` with your actual database password and add database name `smartcivic` before the `?`:
     ```text
     mongodb+srv://smartcivic_admin:SmartCivic2026Pass!@cluster0.xxxxx.mongodb.net/smartcivic?retryWrites=true&w=majority
     ```

---

## 🟢 STEP 2: Push Project to GitHub

1. Open a terminal (PowerShell, Command Prompt, or VS Code terminal) in your project directory:
   ```bash
   cd "c:\Users\Bharath S\OneDrive\Desktop\smart civic"
   ```
2. Initialize git and commit:
   ```bash
   git init
   git add .
   git commit -m "Initial commit - Complete SmartCivic full-stack application"
   ```
3. Go to [GitHub](https://github.com/new) and create a **New Repository** (named `smartcivic`, public or private).
4. Link and push your repository:
   ```bash
   git remote add origin https://github.com/<YOUR_GITHUB_USERNAME>/smartcivic.git
   git branch -M main
   git push -u origin main
   ```

---

## 🟢 STEP 3: Deploy to Render (Single Web Service)

1. Go to [Render Dashboard](https://dashboard.render.com/) and click **New +** ➔ **Web Service**.
2. Select **Build and deploy from a Git repository** ➔ Click **Next**.
3. Connect your GitHub account and select your `smartcivic` repository.
4. Fill in the deployment settings:
   - **Name**: `smartcivic-app` *(or any unique name you choose)*
   - **Region**: Choose closest to you (e.g., *Singapore*, *Frankfurt*, *Oregon*)
   - **Branch**: `main`
   - **Root Directory**: *(Leave empty — defaults to root)*
   - **Runtime**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Instance Type**: `Free`
5. Scroll down to **Environment Variables** and click **Add Environment Variable**:

   | Key | Value | Note |
   | :--- | :--- | :--- |
   | `NODE_ENV` | `production` | Production mode |
   | `MONGODB_URI` | `mongodb+srv://smartcivic_admin:YourPassword@cluster0.xxxxx.mongodb.net/smartcivic?retryWrites=true&w=majority` | Your MongoDB Atlas connection string |
   | `JWT_SECRET` | `smartcivic_super_secret_jwt_key_2026` | Any secure random string |

6. Click **Deploy Web Service**!

---

## 🟢 STEP 4: Access Your Live Deployed SmartCivic URL

Render will build and start your application in ~1-2 minutes.
Once the status changes to **Live**, Render gives you your public HTTPS URL at the top left of the dashboard:

🌐 **`https://smartcivic-app.onrender.com`**

Opening that **ONE URL** in any browser (phone, tablet, laptop) will load your entire SmartCivic application!

---

## 🔑 Default Accounts (Auto-Seeded on First Launch)

When your MongoDB Atlas database connects for the first time, SmartCivic **automatically seeds** default accounts and sample complaints:

| Role | Portal | Email | Password |
| :--- | :--- | :--- | :--- |
| **Citizen** | Citizen Portal | `arjun.sharma@gmail.com` *(or `citizen@example.gov.in`)* | `password123` |
| **Department Officer** | Department Portal | `officer.pwd@smartcivic.gov.in` | `officer123` |
| **Municipal Admin** | Admin Portal | `admin@smartcivic.gov.in` | `adminpassword123` |

*You can also register brand-new citizen accounts directly on the live site!*

---

## 🧪 Testing Your Live URL Checklist

1. **Citizen Portal**:
   - Register a new account / Login as Citizen.
   - Submit a new complaint with an uploaded photo evidence.
   - Open **My Complaints** — verify only your tickets appear.
   - Update your profile name/mobile in **My Profile** — verify it persists.
2. **Department Portal**:
   - Click **Department Portal** on Login page.
   - Log in as `officer.pwd@smartcivic.gov.in` / `officer123`.
   - Update complaint status to **In Progress** / **Resolved** with official remarks.
3. **Admin Portal**:
   - Click **Admin Portal** on Login page.
   - Log in as `admin@smartcivic.gov.in` / `adminpassword123`.
   - View Central Command statistics and all city complaints.
