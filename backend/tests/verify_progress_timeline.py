import urllib.request
import json

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

def test_progress_workflow():
    print("=== TESTING STATUS PROGRESS TIMELINE WORKFLOW ===")
    
    # 1. Login as Citizen
    status, res = make_req("/users/login", "POST", {"email": "arjun.sharma@gmail.com", "password": "password123"})
    assert status == 200, f"Login failed: {res}"
    citizen_token = res["token"]
    print("[PASS] Citizen Login")

    # 2. Login as Admin
    status, res = make_req("/users/login", "POST", {"email": "admin@smartcivic.gov.in", "password": "adminpassword123"})
    assert status == 200, f"Admin Login failed: {res}"
    admin_token = res["token"]
    print("[PASS] Admin Login")

    # 3. Create New Complaint (Starts at Submitted)
    comp_payload = {
        "title": "Timeline Progress Test Pothole",
        "category": "Roads & Potholes",
        "priority": "High",
        "description": "Testing that progress starts at exactly Submitted / 20%",
        "location": "MG Road, Bengaluru"
    }
    status, res = make_req("/complaints", "POST", comp_payload, citizen_token)
    assert status == 201, f"Create complaint failed: {res}"
    ticket_id = res["complaint"]["ticketId"]
    complaint = res["complaint"]
    
    print(f"Created Ticket: {ticket_id}")
    assert complaint["status"] == "Submitted", f"Expected Submitted, got {complaint['status']}"
    done_stages = [t["status"] for t in complaint["timeline"] if t.get("done")]
    assert done_stages == ["Submitted"], f"Expected only Submitted done, got {done_stages}"
    print("[PASS] Stage 1: Submitted -> Only Submitted completed (20% progress)")

    # 4. Admin Verifies Complaint -> Verified
    status, res = make_req(f"/admin/complaints/{ticket_id}/status", "PUT", {
        "status": "Verified",
        "remark": "Inspector completed ground verification"
    }, admin_token)
    assert status == 200, f"Verify failed: {res}"
    complaint = res["complaint"]
    assert complaint["status"] == "Verified", f"Expected Verified, got {complaint['status']}"
    done_stages = [t["status"] for t in complaint["timeline"] if t.get("done")]
    assert done_stages == ["Submitted", "Verified"], f"Expected Submitted + Verified done, got {done_stages}"
    print("[PASS] Stage 2: Verified -> Submitted + Verified completed (40% progress)")

    # 5. Admin Assigns Field Officer -> Assigned
    status, res = make_req(f"/admin/complaints/{ticket_id}/status", "PUT", {
        "status": "Assigned",
        "assignedOfficer": "Engineer Rajesh Kumar",
        "remark": "Assigned to PWD Field Crew"
    }, admin_token)
    assert status == 200, f"Assign failed: {res}"
    complaint = res["complaint"]
    assert complaint["status"] == "Assigned", f"Expected Assigned, got {complaint['status']}"
    done_stages = [t["status"] for t in complaint["timeline"] if t.get("done")]
    assert done_stages == ["Submitted", "Verified", "Assigned"], f"Expected Submitted + Verified + Assigned done, got {done_stages}"
    print("[PASS] Stage 3: Assigned -> Submitted + Verified + Assigned completed (60% progress)")

    # 6. Officer Starts Work -> In Progress
    status, res = make_req(f"/admin/complaints/{ticket_id}/status", "PUT", {
        "status": "In Progress",
        "remark": "Asphalt leveling and compaction underway"
    }, admin_token)
    assert status == 200, f"In Progress failed: {res}"
    complaint = res["complaint"]
    assert complaint["status"] == "In Progress", f"Expected In Progress, got {complaint['status']}"
    done_stages = [t["status"] for t in complaint["timeline"] if t.get("done")]
    assert done_stages == ["Submitted", "Verified", "Assigned", "In Progress"], f"Expected 4 done, got {done_stages}"
    print("[PASS] Stage 4: In Progress -> 4 stages completed (80% progress)")

    # 7. Officer / Admin Resolves Complaint -> Resolved
    status, res = make_req(f"/admin/complaints/{ticket_id}/status", "PUT", {
        "status": "Resolved",
        "remark": "Pothole fully repaired and road opened"
    }, admin_token)
    assert status == 200, f"Resolve failed: {res}"
    complaint = res["complaint"]
    assert complaint["status"] == "Resolved", f"Expected Resolved, got {complaint['status']}"
    done_stages = [t["status"] for t in complaint["timeline"] if t.get("done")]
    assert done_stages == ["Submitted", "Verified", "Assigned", "In Progress", "Resolved"], f"Expected all 5 done, got {done_stages}"
    print("[PASS] Stage 5: Resolved -> All 5 stages completed (100% progress)")

    # 8. Test Live Tracking Endpoint
    status, track_res = make_req(f"/complaints/track/{ticket_id}", "GET")
    assert status == 200, f"Track failed: {track_res}"
    assert track_res["status"] == "Resolved"
    print("[PASS] Public Tracking Verification Successful")

    print("\n=======================================================")
    print("ALL STATUS PROGRESS TIMELINE TESTS PASSED WITH 100% SUCCESS!")
    print("=======================================================\n")

if __name__ == "__main__":
    test_progress_workflow()
