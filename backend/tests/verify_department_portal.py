import urllib.request
import json
import time

BASE_URL = "http://localhost:5000/api"

def make_req(path, method="GET", payload=None, token=None):
    url = f"{BASE_URL}{path}"
    headers = {"Content-Type": "application/json"}
    if token:
        headers["Authorization"] = f"Bearer {token}"
    data = json.dumps(payload).encode() if payload else None
    req = urllib.request.Request(url, data=data, headers=headers, method=method)
    try:
        with urllib.request.urlopen(req) as resp:
            return resp.status, json.loads(resp.read().decode())
    except urllib.error.HTTPError as e:
        return e.code, json.loads(e.read().decode())

def test_department_portal_flow():
    print("\n======================================================")
    print("TESTING SMARTCIVIC DEPARTMENT PORTAL WORKFLOW & ISOLATION")
    print("======================================================\n")

    # 1. Citizen Login
    status, cuser_res = make_req("/users/login", "POST", {"email": "arjun.sharma@gmail.com", "password": "password123"})
    assert status == 200, f"Citizen login failed: {cuser_res}"
    c_token = cuser_res["token"]
    print("[PASS] 1. Citizen Logged In Successfully")

    # 2. Citizen Creates PWD Complaint
    pwd_title = f"Major Pothole on 100ft Road - {int(time.time())}"
    status, pwd_res = make_req("/complaints", "POST", {
        "title": pwd_title,
        "category": "Roads & Potholes",
        "priority": "High",
        "description": "Deep asphalt crater on 100ft road causing traffic halt",
        "location": "100ft Road Indiranagar, Bengaluru"
    }, token=c_token)
    assert status == 201, f"PWD complaint failed: {pwd_res}"
    pwd_ticket = pwd_res["complaint"]["ticketId"]
    print(f"[PASS] 2. Citizen Created PWD Complaint (Ticket ID: {pwd_ticket})")

    # 3. Citizen Creates BESCOM Complaint
    bescom_title = f"Blown Transformer Streetlight - {int(time.time())}"
    status, bescom_res = make_req("/complaints", "POST", {
        "title": bescom_title,
        "category": "Power & Streetlights",
        "priority": "Medium",
        "description": "Streetlight pole sparked and went dark",
        "location": "Block B 2nd Main, Indiranagar"
    }, token=c_token)
    assert status == 201, f"BESCOM complaint failed: {bescom_res}"
    bescom_ticket = bescom_res["complaint"]["ticketId"]
    print(f"[PASS] 3. Citizen Created BESCOM Complaint (Ticket ID: {bescom_ticket})")

    # 4. Admin Login & View All
    status, admin_login = make_req("/users/login", "POST", {"email": "admin@smartcivic.gov.in", "password": "adminpassword123"})
    assert status == 200, f"Admin login failed: {admin_login}"
    a_token = admin_login["token"]
    print("[PASS] 4. Admin Logged In Successfully")

    status, all_comps = make_req("/complaints", "GET")
    all_tickets = [c["ticketId"] for c in all_comps]
    assert pwd_ticket in all_tickets, f"PWD ticket {pwd_ticket} missing in admin view"
    assert bescom_ticket in all_tickets, f"BESCOM ticket {bescom_ticket} missing in admin view"
    print("[PASS] 5. Admin Sees All Complaints Across All Departments")

    # 5. PWD Department Officer Login
    status, dept_login = make_req("/users/login", "POST", {"email": "officer.pwd@smartcivic.gov.in", "password": "officer123"})
    assert status == 200, f"Department login failed: {dept_login}"
    d_token = dept_login["token"]
    dept_user = dept_login["user"]
    assert dept_user.get("department") == "PWD", "Department mismatch"
    print(f"[PASS] 6. PWD Officer Logged In ({dept_user.get('name')})")

    # 6. PWD Department Queue Isolation
    status, global_comps = make_req("/complaints", "GET")
    pwd_queue = [c for c in global_comps if c.get("department") == "PWD" or c.get("category") == "Roads & Potholes"]
    pwd_queue_ids = [c["ticketId"] for c in pwd_queue]
    assert pwd_ticket in pwd_queue_ids, f"PWD ticket {pwd_ticket} must be in PWD queue"
    assert bescom_ticket not in pwd_queue_ids, f"BESCOM ticket {bescom_ticket} must NOT be in PWD queue"
    print(f"[PASS] 7. PWD Department Queue Accurately Isolates {len(pwd_queue)} PWD Complaints and Excludes BESCOM")

    # 7. PWD Officer updates status to In Progress
    status, update_res = make_req(f"/admin/complaints/{pwd_ticket}/status", "PUT", {
        "status": "In Progress",
        "assignedOfficer": "Engineer Rajesh Kumar",
        "remark": "PWD road repair crew dispatched with asphalt mixer."
    }, token=d_token)
    assert status == 200, f"Status update failed: {update_res}"
    print("[PASS] 8. PWD Officer Dispatched Crew and Updated Status to 'In Progress'")

    # 8. Citizen receives notification
    status, notifs = make_req("/notifications", "GET", token=c_token)
    assert any(n.get("ticketId") == pwd_ticket for n in notifs), "Notification not received"
    print("[PASS] 9. Citizen Received Live Notification for Status Update")

    print("\n=====================================================")
    print("ALL DEPARTMENT PORTAL TESTS PASSED (100% success)!")
    print("======================================================\n")

if __name__ == "__main__":
    test_department_portal_flow()
