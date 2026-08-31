# SmartCivic Role Portals & Authentication Security Test Suite
import urllib.request
import json
import time

BASE_URL = "http://localhost:5000/api"

def make_request(url, method="GET", body=None, token=None):
    headers = {"Content-Type": "application/json"}
    if token:
        headers["Authorization"] = f"Bearer {token}"
    
    data = json.dumps(body).encode("utf-8") if body else None
    req = urllib.request.Request(f"{BASE_URL}{url}", data=data, headers=headers, method=method)
    try:
        with urllib.request.urlopen(req) as response:
            res_body = response.read().decode("utf-8")
            return response.status, json.loads(res_body) if res_body else {}
    except urllib.error.HTTPError as e:
        res_body = e.read().decode("utf-8")
        try:
            return e.code, json.loads(res_body)
        except:
            return e.code, {"message": res_body}

def run_role_portal_security_tests():
    print("\n==================================================")
    print("[AUDIT] TESTING FINAL SMARTCIVIC ROLE PORTALS & AUTHENTICATION SECURITY")
    print("==================================================\n")

    # 1. TEST CITIZEN LOGIN & ROLE VERIFICATION
    print("TEST 1: Citizen Registration & Login...")
    citizen_email = f"citizen_final_{int(time.time())}@example.com"
    status, reg_res = make_request("/users/register", "POST", {
        "fullName": "Suresh Citizen",
        "email": citizen_email,
        "password": "password123"
    })
    assert status == 201
    citizen_token = reg_res["token"]
    citizen_user = reg_res["user"]
    assert citizen_user["role"] == "citizen"
    print(f" -> [PASS] Citizen Registered: {citizen_email} (Role: {citizen_user['role']})")

    # 2. TEST CITIZEN ACCESS TO ADMIN API (MUST BE REJECTED 403)
    print("\nTEST 2: Role Guard Check — Citizen attempting Admin API (/api/admin/stats)...")
    status, admin_stat_res = make_request("/admin/stats", "GET", token=citizen_token)
    assert status == 403, f"Security Breach! Citizen was not rejected: {status}, {admin_stat_res}"
    print(f" -> [PASS] Access Denied for Citizen on Admin Route (HTTP {status})")

    # 3. TEST DEPARTMENT OFFICER LOGIN
    print("\nTEST 3: Department Officer Authentication...")
    status, dept_res = make_request("/users/login", "POST", {
        "email": "officer.pwd@smartcivic.gov.in",
        "password": "officer123"
    })
    assert status == 200, f"Department login failed: {dept_res}"
    dept_token = dept_res["token"]
    dept_user = dept_res["user"]
    assert dept_user["role"] in ["dept_officer", "department"]
    assert dept_user["department"] == "PWD"
    print(f" -> [PASS] Department Officer Logged In: {dept_user['name']} (Dept: {dept_user['department']}, Role: {dept_user['role']})")

    # 4. TEST DEPARTMENT OFFICER STATUS UPDATE
    print("\nTEST 4: Department Officer Updating Complaint Status & Assigning Crew...")
    status, update_res = make_request("/admin/complaints/SC-2026-0041/status", "PUT", {
        "status": "In Progress",
        "assignedOfficer": "Engineer Rajesh Kumar",
        "remark": "Field road crew dispatched for asphalt resurfacing."
    }, token=dept_token)
    assert status == 200, f"Status update failed: {update_res}"
    print(f" -> [PASS] Complaint Status Updated to 'In Progress' by Department Officer")

    # 5. TEST ADMIN AUTHENTICATION
    print("\nTEST 5: Municipal Admin Authentication...")
    status, admin_res = make_request("/users/login", "POST", {
        "email": "admin@smartcivic.gov.in",
        "password": "adminpassword123"
    })
    assert status == 200, f"Admin login failed: {admin_res}"
    admin_token = admin_res["token"]
    admin_user = admin_res["user"]
    assert admin_user["role"] == "admin"
    print(f" -> [PASS] Municipal Admin Logged In: {admin_user['name']} (Role: {admin_user['role']})")

    # 6. TEST ADMIN ACCESS TO ADMIN STATS & ALL COMPLAINTS
    print("\nTEST 6: Admin Querying Zonal Stats and City-Wide Complaints...")
    status, stats = make_request("/admin/stats", "GET", token=admin_token)
    assert status == 200
    print(f" -> [PASS] Admin Stats Retrieved: Total={stats['total']}, Pending={stats['pending']}, InProg={stats['inProgress']}, Resolved={stats['resolved']}")

    status, all_comps = make_request("/complaints", "GET", token=admin_token)
    assert status == 200
    print(f" -> [PASS] Admin accessed ALL complaints across city (Count: {len(all_comps)})")

    # 7. TEST INVALID PASSWORDS REJECTED
    print("\nTEST 7: Invalid Login Attempts Rejected...")
    status, inv_res = make_request("/users/login", "POST", {
        "email": "admin@smartcivic.gov.in",
        "password": "wrong_password_999"
    })
    assert status == 401
    print(f" -> [PASS] Wrong Admin Password Rejected (HTTP 401)")

    status, inv_dept = make_request("/users/login", "POST", {
        "email": "officer.pwd@smartcivic.gov.in",
        "password": "wrong_dept_password"
    })
    assert status == 401
    print(f" -> [PASS] Wrong Department Password Rejected (HTTP 401)")

    # 8. TEST CITIZEN COMPLAINT ISOLATION WITH IMAGE
    print("\nTEST 8: Citizen Creating Complaint with Evidence Image...")
    status, comp_res = make_request("/complaints", "POST", {
        "title": "Streetlight Broken on 2nd Main",
        "category": "Power & Streetlights",
        "priority": "Medium",
        "description": "Streetlight flickering and broken",
        "location": "Indiranagar Zone C",
        "images": ["/uploads/test_evidence.jpg"]
    }, token=citizen_token)
    assert status == 201
    new_ticket = comp_res["complaint"]["ticketId"]
    assert comp_res["complaint"]["createdBy"] == citizen_user["_id"]
    assert comp_res["complaint"]["isGuest"] == False
    print(f" -> [PASS] Complaint Logged by Citizen: {new_ticket} (createdBy={citizen_user['_id']}, isGuest=False)")

    # Verify citizen query contains this ticket
    status, my_list = make_request("/complaints/user", "GET", token=citizen_token)
    assert status == 200
    assert any(c["ticketId"] == new_ticket for c in my_list)
    print(f" -> [PASS] Citizen 'My Complaints' strictly contains own ticket ({new_ticket})")

    print("\n==================================================")
    print("[SUCCESS] ALL ROLE PORTAL & AUTH SECURITY TESTS PASSED 100%")
    print("==================================================\n")

if __name__ == "__main__":
    run_role_portal_security_tests()
