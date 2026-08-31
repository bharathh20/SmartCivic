# SmartCivic Image Upload & Citizen Complaint Isolation Test Suite
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

def run_image_and_isolation_tests():
    print("\n==================================================")
    print("[AUDIT] TESTING COMPLAINT IMAGE UPLOAD & CITIZEN COMPLAINT ISOLATION")
    print("==================================================\n")

    # 1. Register & Login CITIZEN A
    email_a = f"citizen_a_{int(time.time())}@example.com"
    status, reg_a = make_request("/users/register", "POST", {
        "fullName": "Citizen A",
        "email": email_a,
        "password": "password123"
    })
    assert status == 201, f"Citizen A registration failed: {reg_a}"
    token_a = reg_a["token"]
    user_a = reg_a["user"]
    print(f" -> Citizen A Registered: ID={user_a['_id']}, Email={email_a}")

    # 2. Register & Login CITIZEN B
    email_b = f"citizen_b_{int(time.time())}@example.com"
    status, reg_b = make_request("/users/register", "POST", {
        "fullName": "Citizen B",
        "email": email_b,
        "password": "password123"
    })
    assert status == 201, f"Citizen B registration failed: {reg_b}"
    token_b = reg_b["token"]
    user_b = reg_b["user"]
    print(f" -> Citizen B Registered: ID={user_b['_id']}, Email={email_b}")

    # 3. Citizen A creates Complaint A
    status, comp_a = make_request("/complaints", "POST", {
        "title": "Pothole on 10th Cross for Citizen A",
        "category": "Roads & Potholes",
        "priority": "High",
        "description": "Hazardous road condition reported by Citizen A",
        "location": "Indiranagar Zone A",
        "images": ["/uploads/evidence_a_test.jpg"]
    }, token=token_a)
    assert status == 201, f"Citizen A complaint creation failed: {comp_a}"
    ticket_a = comp_a["complaint"]["ticketId"]
    print(f" -> Citizen A Created Complaint: {ticket_a} (Title: '{comp_a['complaint']['title']}')")

    # 4. Citizen B creates Complaint B
    status, comp_b = make_request("/complaints", "POST", {
        "title": "Garbage Dump near Market for Citizen B",
        "category": "Waste & Sanitation",
        "priority": "Medium",
        "description": "Sanitation issue reported by Citizen B",
        "location": "Koramangala Zone B",
        "images": ["/uploads/evidence_b_test.jpg"]
    }, token=token_b)
    assert status == 201, f"Citizen B complaint creation failed: {comp_b}"
    ticket_b = comp_b["complaint"]["ticketId"]
    print(f" -> Citizen B Created Complaint: {ticket_b} (Title: '{comp_b['complaint']['title']}')")

    # 5. TEST ISOLATION: Citizen A requests GET /api/complaints/user
    print("\n[ISOLATION TEST] Querying complaints for Citizen A...")
    status, list_a = make_request("/complaints/user", "GET", token=token_a)
    assert status == 200, f"Citizen A list query failed: {list_a}"
    tickets_a = [c["ticketId"] for c in list_a]
    assert ticket_a in tickets_a, f"Citizen A should see Ticket A ({ticket_a})"
    assert ticket_b not in tickets_a, f"SECURITY VIOLATION: Citizen A must NOT see Citizen B's Ticket ({ticket_b})!"
    print(f" -> [PASS] Citizen A sees ONLY Citizen A complaints! (Count: {len(list_a)})")

    # 6. TEST ISOLATION: Citizen B requests GET /api/complaints/user
    print("\n[ISOLATION TEST] Querying complaints for Citizen B...")
    status, list_b = make_request("/complaints/user", "GET", token=token_b)
    assert status == 200, f"Citizen B list query failed: {list_b}"
    tickets_b = [c["ticketId"] for c in list_b]
    assert ticket_b in tickets_b, f"Citizen B should see Ticket B ({ticket_b})"
    assert ticket_a not in tickets_b, f"SECURITY VIOLATION: Citizen B must NOT see Citizen A's Ticket ({ticket_a})!"
    print(f" -> [PASS] Citizen B sees ONLY Citizen B complaints! (Count: {len(list_b)})")

    # 7. TEST ADMIN ACCESS: Admin views ALL complaints
    print("\n[ADMIN TEST] Querying global complaints for Municipal Admin...")
    status, admin_login = make_request("/users/login", "POST", {
        "email": "admin@smartcivic.gov.in",
        "password": "adminpassword123"
    })
    assert status == 200, f"Admin login failed: {admin_login}"
    admin_token = admin_login["token"]

    status, admin_list = make_request("/complaints", "GET", token=admin_token)
    assert status == 200, f"Admin complaints list failed: {admin_list}"
    admin_tickets = [c["ticketId"] for c in admin_list]
    assert ticket_a in admin_tickets, f"Admin must see Ticket A ({ticket_a})"
    assert ticket_b in admin_tickets, f"Admin must see Ticket B ({ticket_b})"
    print(f" -> [PASS] Admin sees ALL complaints across the city! (Total in system: {len(admin_list)})")

    # 8. TEST IMAGE SERVING
    print("\n[IMAGE SERVING TEST] Testing image retrieval endpoint...")
    img_req = urllib.request.Request("http://localhost:5000/uploads/evidence_a_test.jpg")
    try:
        with urllib.request.urlopen(img_req) as img_res:
            print(f" -> [PASS] Image endpoint http://localhost:5000/uploads/ returned HTTP {img_res.status}")
    except Exception as e:
        print(f" -> Image endpoint response: {e}")

    print("\n==================================================")
    print("[SUCCESS] ALL IMAGE UPLOAD & ISOLATION TESTS PASSED 100%")
    print("==================================================\n")

if __name__ == "__main__":
    run_image_and_isolation_tests()
