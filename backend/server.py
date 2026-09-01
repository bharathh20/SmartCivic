# SmartCivic Express-Compatible Python REST API Server
# Fallback runner allowing immediate execution with Python 3.12 without npm dependencies

import http.server
import socketserver
import json
import re
import base64
import time
import os

PORT = 5000

# Mock DB Data Store matching Mongoose Schema
USERS_DB = [
    {
        "_id": "user_001",
        "name": "Arjun Sharma",
        "email": "arjun.sharma@gmail.com",
        "password": "password123",
        "role": "citizen",
        "mobile": "+91 98765 43210",
        "address": "123, 5th Cross, Indiranagar, Bengaluru 560038",
        "aadhaar": "XXXX-XXXX-3421",
        "unmaskedAadhaar": "5482-9102-3421",
        "badge": "VERIFIED CITIZEN",
        "zone": "Bengaluru Municipal Zone C",
        "memberSince": "January 2023"
    },
    {
        "_id": "admin_001",
        "name": "Municipal Admin",
        "email": "admin@smartcivic.gov.in",
        "password": "adminpassword123",
        "role": "admin",
        "mobile": "+91 99000 11223",
        "address": "BBMP Zone C Headquarters, Bengaluru",
        "aadhaar": "XXXX-XXXX-9999",
        "badge": "ZONAL COMMISSIONER",
        "zone": "Bengaluru Municipal Zone C",
        "memberSince": "January 2022"
    },
    {
        "_id": "officer_pwd_001",
        "name": "Rajesh Kumar (PWD Officer)",
        "email": "officer.pwd@smartcivic.gov.in",
        "password": "officer123",
        "role": "dept_officer",
        "department": "PWD",
        "mobile": "+91 98450 12345",
        "address": "PWD Sub-Division Office, Indiranagar",
        "aadhaar": "XXXX-XXXX-7712",
        "badge": "CHIEF DISPATCH ENGINEER",
        "zone": "Bengaluru Zone C — PWD Division",
        "memberSince": "March 2021"
    }
]

COMPLAINTS_DB = [
    {
        "_id": "60d5ecb8b3b7c82b8c8b4567",
        "ticketId": "SC-2026-0041",
        "title": "Pothole on MG Road",
        "category": "Roads & Potholes",
        "priority": "High",
        "department": "PWD",
        "status": "In Progress",
        "date": "Jul 20, 2026",
        "time": "09:14 AM",
        "estResolution": "Jul 24, 2026",
        "assignedOfficer": "Rajesh Kumar",
        "officerRole": "PWD Engineer",
        "location": "12.9716°N, 77.5946°E — Indiranagar",
        "address": "MG Road near Ulsoor junction, Bengaluru",
        "latitude": 12.9716,
        "longitude": 77.5946,
        "description": "Large pothole approximately 40cm x 30cm x 15cm deep on MG Road near Ulsoor junction, causing vehicle damage and risk to two-wheelers. Reported by 14 citizens (upvoted). Prior complaint filed in March was partially patched.",
        "upvotes": 14,
        "upvotedBy": [],
        "images": [
            "https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=600&q=80",
            "https://images.unsplash.com/photo-1541888946425-d0fbb186a5b3?auto=format&fit=crop&w=600&q=80",
            "https://images.unsplash.com/photo-1530587191325-3db32d826c18?auto=format&fit=crop&w=600&q=80"
        ],
        "timeline": [
            { "status": "Submitted", "time": "Jul 20, 2026 09:14", "note": "Complaint received and assigned ID SC-2026-0041", "done": True },
            { "status": "Verified", "time": "Jul 20, 2026 14:30", "note": "Field inspector confirmed pothole severity", "done": True },
            { "status": "Assigned", "time": "Jul 21, 2026 10:00", "note": "Assigned to PWD — Engineer Rajesh Kumar", "done": True },
            { "status": "In Progress", "time": "Jul 21, 2026 15:00", "note": "Repair crew dispatched, estimated 48h", "done": True },
            { "status": "Resolved", "time": "Estimated Jul 24", "note": "Pending completion", "done": False }
        ],
        "reportedBy": "Arjun Sharma"
    },
    {
        "_id": "60d5ecb8b3b7c82b8c8b4568",
        "ticketId": "SC-2026-0038",
        "title": "Broken streetlight — Block C",
        "category": "Power & Streetlights",
        "priority": "Medium",
        "department": "BESCOM",
        "status": "Resolved",
        "date": "Jul 18, 2026",
        "time": "08:30 PM",
        "estResolution": "Jul 19, 2026",
        "assignedOfficer": "Suresh Gowda",
        "officerRole": "BESCOM Electrical Linesman",
        "location": "12.9780°N, 77.6400°E — Block C, Indiranagar",
        "address": "Block C 4th Main, Indiranagar, Bengaluru",
        "latitude": 12.9780,
        "longitude": 77.6400,
        "description": "Streetlight pole #42 on Block C 4th main street is dark for 3 days. Creates safety hazard during night hours.",
        "upvotes": 8,
        "upvotedBy": [],
        "images": [
            "https://images.unsplash.com/photo-1509114397022-ed747cca3f65?auto=format&fit=crop&w=600&q=80"
        ],
        "timeline": [
            { "status": "Submitted", "time": "Jul 18, 2026 20:30", "note": "Complaint registered by citizen", "done": True },
            { "status": "Verified", "time": "Jul 18, 2026 21:15", "note": "Remote grid sensor confirmed outage", "done": True },
            { "status": "Assigned", "time": "Jul 19, 2026 08:00", "note": "Assigned to BESCOM Linesman Suresh Gowda", "done": True },
            { "status": "In Progress", "time": "Jul 19, 2026 09:30", "note": "Transformer bulb replacement underway", "done": True },
            { "status": "Resolved", "time": "Jul 19, 2026 11:45", "note": "LED fixture replaced and tested working", "done": True }
        ],
        "reportedBy": "Arjun Sharma"
    },
    {
        "_id": "60d5ecb8b3b7c82b8c8b4569",
        "ticketId": "SC-2026-0031",
        "title": "Garbage overflow near Park",
        "category": "Waste & Sanitation",
        "priority": "High",
        "department": "BBMP Sanitation",
        "status": "Verified",
        "date": "Jul 15, 2026",
        "time": "11:20 AM",
        "estResolution": "Jul 17, 2026",
        "assignedOfficer": "Anand Kumar",
        "officerRole": "Sanitation Inspector Zone 3",
        "location": "12.9650°N, 77.5900°E — Cubbon Park area",
        "address": "Near West Gate Cubbon Park, Bengaluru",
        "latitude": 12.9650,
        "longitude": 77.5900,
        "description": "Public waste bins overflowing on main walkway. Garbage spilling onto pavement.",
        "upvotes": 22,
        "upvotedBy": [],
        "images": [
            "https://images.unsplash.com/photo-1530587191325-3db32d826c18?auto=format&fit=crop&w=600&q=80"
        ],
        "timeline": [
            { "status": "Submitted", "time": "Jul 15, 2026 11:20", "note": "Ticket registered by citizen", "done": True },
            { "status": "Verified", "time": "Jul 15, 2026 14:00", "note": "Inspector verified waste overflow", "done": True },
            { "status": "Assigned", "time": "Pending", "note": "En route for truck dispatch", "done": False },
            { "status": "In Progress", "time": "Pending", "note": "Pending garbage sweep", "done": False },
            { "status": "Resolved", "time": "Pending", "note": "Pending cleanup sign-off", "done": False }
        ],
        "reportedBy": "Arjun Sharma"
    }
]

NOTIFICATIONS_DB = [
    {
        "id": "n1",
        "ticketId": "SC-2026-0041",
        "title": "SC-2026-0041 Status Updated",
        "message": "Your complaint has been assigned to PWD department.",
        "time": "2 hours ago",
        "unread": True,
        "isNew": True
    },
    {
        "id": "n2",
        "ticketId": "SC-2026-0038",
        "title": "SC-2026-0038 Resolved",
        "message": "The streetlight issue has been successfully resolved.",
        "time": "1 day ago",
        "unread": True,
        "isNew": True
    }
]

def generate_jwt_token(user_id):
    header = base64.b64encode(json.dumps({"alg": "HS256", "typ": "JWT"}).encode()).decode()
    payload = base64.b64encode(json.dumps({"id": str(user_id), "exp": int(time.time()) + 604800}).encode()).decode()
    signature = "smartcivic_signature"
    return f"{header}.{payload}.{signature}"

def get_user_from_headers(headers):
    auth = headers.get('Authorization', '')
    if auth.startswith('Bearer '):
        token = auth.split(' ')[1]
        try:
            parts = token.split('.')
            if len(parts) >= 2:
                raw_b64 = parts[1]
                padding = len(raw_b64) % 4
                if padding:
                    raw_b64 += '=' * (4 - padding)
                payload_json = base64.b64decode(raw_b64).decode('utf-8')
                payload = json.loads(payload_json)
                uid = payload.get('id')
                user = next((u for u in USERS_DB if str(u.get('_id')) == str(uid)), None)
                if user:
                    return user
        except Exception as e:
            pass
    return None

class SmartCivicRequestHandler(http.server.BaseHTTPRequestHandler):

    def _set_headers(self, status=200):
        self.send_response(status)
        self.send_header('Content-Type', 'application/json')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type, Authorization')
        self.end_headers()

    def do_OPTIONS(self):
        self._set_headers(200)

    def do_GET(self):
        url = self.path
        if url == '/api/health':
            self._set_headers(200)
            self.wfile.write(json.dumps({
                "status": "OK",
                "message": "SmartCivic REST API Server Operational",
                "timestamp": time.ctime(),
                "version": "1.0.0"
            }).encode())
        elif url.startswith('/api/complaints/track/'):
            ticket_id = url.split('/')[-1]
            complaint = next((c for c in COMPLAINTS_DB if c['ticketId'].upper() == ticket_id.upper()), None)
            if complaint:
                self._set_headers(200)
                self.wfile.write(json.dumps(complaint).encode())
            else:
                self._set_headers(404)
                self.wfile.write(json.dumps({"message": "Ticket not found"}).encode())
        elif url.startswith('/uploads/'):
            filename = os.path.basename(url.split('?')[0])
            uploads_dir = os.path.join(os.path.dirname(__file__), 'uploads')
            file_path = os.path.join(uploads_dir, filename)
            if os.path.exists(file_path):
                self.send_response(200)
                ext = os.path.splitext(filename)[1].lower()
                mime = 'image/jpeg' if ext in ['.jpg', '.jpeg'] else 'image/png' if ext == '.png' else 'image/webp' if ext == '.webp' else 'application/octet-stream'
                self.send_header('Content-Type', mime)
                self.send_header('Access-Control-Allow-Origin', '*')
                self.end_headers()
                with open(file_path, 'rb') as f:
                    self.wfile.write(f.read())
            else:
                self._set_headers(404)
                self.wfile.write(json.dumps({"message": "File not found"}).encode())
        elif url == '/api/complaints':
            self._set_headers(200)
            self.wfile.write(json.dumps(COMPLAINTS_DB).encode())
        elif url == '/api/complaints/user':
            user = get_user_from_headers(self.headers)
            if user:
                user_complaints = [c for c in COMPLAINTS_DB if c.get('createdBy') and str(c.get('createdBy')) == str(user['_id']) and not c.get('isGuest', False)]
                self._set_headers(200)
                self.wfile.write(json.dumps(user_complaints).encode())
            else:
                self._set_headers(401)
                self.wfile.write(json.dumps({"message": "Not authorized, token required"}).encode())
        elif url == '/api/users/me':
            user = get_user_from_headers(self.headers)
            if user:
                self._set_headers(200)
                self.wfile.write(json.dumps({"user": user}).encode())
            else:
                self._set_headers(401)
                self.wfile.write(json.dumps({"message": "Not authorized, token invalid or expired"}).encode())
        elif url == '/api/admin/stats':
            user = get_user_from_headers(self.headers)
            if not user or user.get('role') not in ['admin', 'dept_officer', 'department']:
                self._set_headers(403)
                self.wfile.write(json.dumps({"message": "Forbidden: Not authorized as an admin or department officer"}).encode())
                return
            total = len(COMPLAINTS_DB)
            pending = len([c for c in COMPLAINTS_DB if c['status'] in ['Pending', 'Submitted', 'Verified']])
            in_prog = len([c for c in COMPLAINTS_DB if c['status'] in ['In Progress', 'Assigned']])
            resolved = len([c for c in COMPLAINTS_DB if c['status'] == 'Resolved'])
            self._set_headers(200)
            self.wfile.write(json.dumps({
                "total": total,
                "pending": pending,
                "inProgress": in_prog,
                "resolved": resolved,
                "resolutionPct": 88
            }).encode())
        elif url == '/api/notifications':
            self._set_headers(200)
            self.wfile.write(json.dumps(NOTIFICATIONS_DB).encode())
        else:
            # Serve frontend static assets (HTML, JS, CSS, images) or SPA fallback
            clean_path = url.split('?')[0].lstrip('/')
            if not clean_path:
                clean_path = 'index.html'
            root_dir = os.path.join(os.path.dirname(__file__), '..')
            file_path = os.path.join(root_dir, clean_path)
            
            if not os.path.exists(file_path):
                file_path = os.path.join(root_dir, 'index.html')
            
            if os.path.exists(file_path):
                self.send_response(200)
                ext = os.path.splitext(file_path)[1].lower()
                mime = 'text/html' if ext == '.html' else 'application/javascript' if ext == '.js' else 'text/css' if ext == '.css' else 'image/jpeg' if ext in ['.jpg', '.jpeg'] else 'image/png' if ext == '.png' else 'application/octet-stream'
                self.send_header('Content-Type', f"{mime}; charset=utf-8" if 'text' in mime or 'javascript' in mime else mime)
                self.send_header('Access-Control-Allow-Origin', '*')
                self.end_headers()
                with open(file_path, 'rb') as f:
                    self.wfile.write(f.read())
            else:
                self._set_headers(404)
                self.wfile.write(json.dumps({"message": "Resource not found"}).encode())

    def do_POST(self):
        content_type = self.headers.get('Content-Type', '')
        content_length = int(self.headers.get('Content-Length', 0))
        body_data = self.rfile.read(content_length) if content_length > 0 else b''

        payload = {}
        uploaded_image_url = None

        # Check if multipart form data or json
        if 'multipart/form-data' in content_type:
            try:
                boundary = content_type.split("boundary=")[1].encode()
                parts = body_data.split(b'--' + boundary)
                for part in parts:
                    if b'Content-Disposition' in part:
                        headers_part, _, body_part = part.partition(b'\r\n\r\n')
                        body_part = body_part.rstrip(b'\r\n--')
                        disp_str = headers_part.decode('utf-8', errors='ignore')
                        if 'filename=' in disp_str:
                            fname_match = re.search(r'filename="([^"]+)"', disp_str)
                            orig_fname = fname_match.group(1) if fname_match else 'uploaded.jpg'
                            ext = os.path.splitext(orig_fname)[1].lower() or '.jpg'
                            if ext in ['.jpg', '.jpeg', '.png', '.webp']:
                                new_fname = f"evidence-{int(time.time())}{ext}"
                                uploads_dir = os.path.join(os.path.dirname(__file__), 'uploads')
                                os.makedirs(uploads_dir, exist_ok=True)
                                file_path = os.path.join(uploads_dir, new_fname)
                                with open(file_path, 'wb') as f:
                                    f.write(body_part)
                                uploaded_image_url = f"/uploads/{new_fname}"
                        else:
                            name_match = re.search(r'name="([^"]+)"', disp_str)
                            if name_match:
                                field_name = name_match.group(1)
                                payload[field_name] = body_part.decode('utf-8', errors='ignore').strip()
            except Exception as e:
                print(f"[Multipart Parse Error] {e}")
        else:
            try:
                payload = json.loads(body_data.decode('utf-8'))
            except:
                payload = {}

        if self.path == '/api/users/login':
            email = payload.get('email', '').strip().lower()
            password = payload.get('password', '')
            user = next((u for u in USERS_DB if u.get('email', '').strip().lower() == email), None)
            if user and user.get('password') == password:
                token = generate_jwt_token(user['_id'])
                self._set_headers(200)
                self.wfile.write(json.dumps({"token": token, "user": user}).encode())
            else:
                self._set_headers(401)
                self.wfile.write(json.dumps({"message": "Invalid email or password"}).encode())

        elif self.path == '/api/users/register':
            email = payload.get('email', '').strip().lower()
            name = payload.get('fullName', 'Citizen User')
            existing = next((u for u in USERS_DB if u.get('email', '').strip().lower() == email), None)
            if existing:
                self._set_headers(400)
                self.wfile.write(json.dumps({"message": "User with this email already exists"}).encode())
                return
            new_user = {
                "_id": f"user_{int(time.time())}",
                "name": name,
                "email": email,
                "password": payload.get('password', 'password123'),
                "role": "citizen",
                "mobile": payload.get('mobile', '+91 98765 43210'),
                "address": payload.get('address', 'Indiranagar, Bengaluru'),
                "aadhaar": "XXXX-XXXX-3421",
                "unmaskedAadhaar": "5482-9102-3421",
                "badge": "VERIFIED CITIZEN",
                "zone": "Bengaluru Municipal Zone C",
                "memberSince": "August 2026"
            }
            USERS_DB.append(new_user)
            token = generate_jwt_token(new_user['_id'])
            self._set_headers(201)
            self.wfile.write(json.dumps({"token": token, "user": new_user}).encode())

        elif self.path == '/api/upload':
            if uploaded_image_url:
                self._set_headers(200)
                self.wfile.write(json.dumps({"message": "Image uploaded successfully", "imageUrl": uploaded_image_url}).encode())
            else:
                self._set_headers(400)
                self.wfile.write(json.dumps({"message": "No valid image file uploaded"}).encode())

        elif self.path == '/api/complaints':
            if not payload.get('title') or not payload.get('description'):
                self._set_headers(400)
                self.wfile.write(json.dumps({"message": "Please provide title and description"}).encode())
                return
            
            user = get_user_from_headers(self.headers)
            ticket_id = f"SC-2026-00{len(COMPLAINTS_DB) + 42}"
            
            comp_images = payload.get('images', [])
            if uploaded_image_url:
                comp_images = [uploaded_image_url]

            new_comp = {
                "_id": f"comp_{int(time.time())}",
                "ticketId": ticket_id,
                "title": payload.get('title'),
                "category": payload.get('category', 'Roads & Potholes'),
                "priority": payload.get('priority', 'Medium'),
                "department": "PWD",
                "status": "Submitted",
                "date": "Aug 26, 2026",
                "time": "Just now",
                "estResolution": "Aug 29, 2026",
                "assignedOfficer": "Rajesh Kumar",
                "officerRole": "PWD Engineer",
                "location": payload.get('location', 'Indiranagar, Bengaluru'),
                "address": payload.get('location', 'Indiranagar, Bengaluru'),
                "description": payload.get('description'),
                "upvotes": 1,
                "upvotedBy": [],
                "images": comp_images,
                "createdBy": user['_id'] if user else None,
                "reportedBy": user['name'] if user else 'Guest User',
                "isGuest": True if not user else False,
                "timeline": [
                    { "status": "Submitted", "time": "Aug 26, 2026 Just now", "note": f"Ticket logged {ticket_id}", "done": True },
                    { "status": "Verified", "time": "Pending", "note": "Awaiting verification", "done": False },
                    { "status": "Assigned", "time": "Pending", "note": "Awaiting dispatch", "done": False },
                    { "status": "In Progress", "time": "Pending", "note": "Pending work crew", "done": False },
                    { "status": "Resolved", "time": "Pending", "note": "Pending completion", "done": False }
                ]
            }
            COMPLAINTS_DB.insert(0, new_comp)
            self._set_headers(201)
            self.wfile.write(json.dumps({"message": "Complaint created", "complaint": new_comp}).encode())
        else:
            self._set_headers(404)
            self.wfile.write(json.dumps({"message": "Route not found"}).encode())

    def do_PUT(self):
        content_length = int(self.headers.get('Content-Length', 0))
        body_data = self.rfile.read(content_length) if content_length > 0 else b'{}'
        try:
            payload = json.loads(body_data.decode('utf-8'))
        except:
            payload = {}

        url = self.path
        if '/api/complaints/' in url and '/upvote' in url:
            parts = url.split('/')
            ticket_id = parts[3]
            complaint = next((c for c in COMPLAINTS_DB if c['ticketId'].upper() == ticket_id.upper() or c['_id'] == ticket_id), None)
            if complaint:
                complaint['upvotes'] = complaint.get('upvotes', 0) + 1
                self._set_headers(200)
                self.wfile.write(json.dumps({"message": "Upvote recorded", "upvotes": complaint['upvotes']}).encode())
            else:
                self._set_headers(404)
                self.wfile.write(json.dumps({"message": "Complaint not found"}).encode())
        elif '/api/admin/complaints/' in url and '/status' in url:
            user = get_user_from_headers(self.headers)
            if not user or user.get('role') not in ['admin', 'dept_officer', 'department']:
                self._set_headers(403)
                self.wfile.write(json.dumps({"message": "Forbidden: Not authorized to update complaint status"}).encode())
                return
            parts = url.split('/')
            ticket_id = parts[4]
            complaint = next((c for c in COMPLAINTS_DB if c['ticketId'].upper() == ticket_id.upper() or c['_id'] == ticket_id), None)
            if complaint:
                new_status = payload.get('status', complaint['status'])
                remark = payload.get('remark', f'Status updated to {new_status} by municipal official.')
                
                status_flow = ['Submitted', 'Verified', 'Assigned', 'In Progress', 'Resolved']
                norm_status = next((s for s in status_flow if s.lower() == new_status.lower().replace('_', ' ')), new_status)
                complaint['status'] = norm_status
                if 'assignedOfficer' in payload and payload['assignedOfficer']:
                    complaint['assignedOfficer'] = payload['assignedOfficer']

                # Update timeline stages strictly based on status index
                now_str = time.strftime('%b %d, %Y %I:%M %p')
                target_idx = status_flow.index(norm_status) if norm_status in status_flow else 0
                
                new_timeline = []
                for s_idx, st in enumerate(status_flow):
                    existing = next((it for it in complaint.get('timeline', []) if it.get('status', '').lower() == st.lower()), {})
                    if s_idx < target_idx:
                        new_timeline.append({
                            "status": st,
                            "time": existing.get("time") if existing.get("time") and existing.get("time") != "Pending" else now_str,
                            "note": existing.get("note") if existing.get("note") else f"{st} completed",
                            "done": True
                        })
                    elif s_idx == target_idx:
                        new_timeline.append({
                            "status": st,
                            "time": now_str,
                            "note": remark if remark else (existing.get("note") if existing.get("note") and existing.get("note") != "Pending" else f"Status updated to {st}"),
                            "done": True
                        })
                    else:
                        new_timeline.append({
                            "status": st,
                            "time": "Pending",
                            "note": existing.get("note") if existing.get("note") and existing.get("note").startswith("Pending") else f"Awaiting {st.lower()} stage",
                            "done": False
                        })
                complaint['timeline'] = new_timeline

                # Append Notification for Citizen Message Receiving
                notif_item = {
                    "id": f"n_{int(time.time())}",
                    "ticketId": complaint['ticketId'],
                    "title": f"{complaint['ticketId']} Status: {new_status}",
                    "message": remark,
                    "time": "Just now",
                    "unread": True,
                    "isNew": True
                }
                NOTIFICATIONS_DB.insert(0, notif_item)

                self._set_headers(200)
                self.wfile.write(json.dumps({"message": "Status updated successfully", "complaint": complaint, "notification": notif_item}).encode())
            else:
                self._set_headers(404)
                self.wfile.write(json.dumps({"message": "Complaint not found"}).encode())
        elif url == '/api/notifications/read-all':
            for n in NOTIFICATIONS_DB:
                n['unread'] = False
                n['isNew'] = False
            self._set_headers(200)
            self.wfile.write(json.dumps({"message": "All notifications marked as read"}).encode())
        elif url == '/api/users/profile':
            user = get_user_from_headers(self.headers)
            if 'name' in payload: user['name'] = payload['name']
            if 'mobile' in payload: user['mobile'] = payload['mobile']
            if 'address' in payload: user['address'] = payload['address']
            self._set_headers(200)
            self.wfile.write(json.dumps({"message": "Profile updated successfully", "user": user}).encode())
        elif url == '/api/users/change-password':
            self._set_headers(200)
            self.wfile.write(json.dumps({"message": "Password updated successfully"}).encode())
        else:
            self._set_headers(200)
            self.wfile.write(json.dumps({"message": "PUT operation successful"}).encode())

def run_server():
    server = socketserver.TCPServer(("", PORT), SmartCivicRequestHandler)
    print("==================================================")
    print(f"[SmartCivic] REST API Server running on port {PORT}")
    print(f"[SmartCivic] Health Check: http://localhost:{PORT}/api/health")
    print("==================================================")
    server.serve_forever()

if __name__ == "__main__":
    run_server()
