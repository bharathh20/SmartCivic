# SmartCivic Citizen vs Guest Complaint Ownership Test Suite
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

def run_citizen_vs_guest_test():
    print("\n==================================================")
    print("[AUDIT] TESTING CITIZEN VS GUEST COMPLAINT OWNERSHIP SEPARATION")
    print("==================================================\n")

    # STEP 1: Register & Login Citizen A
    email_a = f"citizen_a_owner_{int(time.time())}@example.com"
    status, reg_a = make_request("/users/register", "POST", {
        "fullName": "Bharath Citizen A",
        "email": email_a,
        "password": "password123"
    })
    assert status == 201, f"Citizen A registration failed: {reg_a}"
    token_a = reg_a["token"]
    user_a = reg_a["user"]
    print(f"STEP 1: Citizen A Registered: ID={user_a['_id']}, Email={email_a}")

    # Citizen A submits "Dogs" complaint while logged in
    status, comp_dogs = make_request("/complaints", "POST", {
        "title": "Dogs barking on 5th Cross",
        "category": "Public Safety",
        "priority": "Medium",
        "description": "Stray dogs issue reported by Citizen A",
        "location": "Indiranagar Zone A"
    }, token=token_a)
    assert status == 201, f"Citizen A complaint failed: {comp_dogs}"
    dogs_ticket = comp_dogs["complaint"]["ticketId"]
    assert comp_dogs["complaint"]["createdBy"] == user_a["_id"]
    assert comp_dogs["complaint"]["isGuest"] == False
    print(f" -> Citizen A Submitted Complaint: '{comp_dogs['complaint']['title']}' (Ticket: {dogs_ticket}, createdBy={comp_dogs['complaint']['createdBy']}, isGuest=False)")

    # STEP 2: Log out (No token) & Submit complaint as GUEST ("Waste")
    print("\nSTEP 2: Submitting complaint as GUEST (No authorization token)...")
    status, comp_waste = make_request("/complaints", "POST", {
        "title": "Waste accumulation near junction",
        "category": "Waste & Sanitation",
        "priority": "High",
        "description": "Uncollected garbage reported anonymously by Guest",
        "location": "Indiranagar Public Spot"
    }) # Notice: token is None
    assert status == 201, f"Guest complaint failed: {comp_waste}"
    waste_ticket = comp_waste["complaint"]["ticketId"]
    assert comp_waste["complaint"]["createdBy"] is None
    assert comp_waste["complaint"]["isGuest"] == True
    print(f" -> Guest Submitted Complaint: '{comp_waste['complaint']['title']}' (Ticket: {waste_ticket}, createdBy=None, isGuest=True)")

    # STEP 3: Register & Login Citizen B and submit "Pothole"
    print("\nSTEP 3: Registering Citizen B and submitting 'Pothole' complaint...")
    email_b = f"citizen_b_owner_{int(time.time())}@example.com"
    status, reg_b = make_request("/users/register", "POST", {
        "fullName": "Bharath Citizen B",
        "email": email_b,
        "password": "password123"
    })
    assert status == 201
    token_b = reg_b["token"]
    user_b = reg_b["user"]

    status, comp_pothole = make_request("/complaints", "POST", {
        "title": "Pothole on Main Road",
        "category": "Roads & Potholes",
        "priority": "High",
        "description": "Deep pothole reported by Citizen B",
        "location": "Koramangala 4th Block"
    }, token=token_b)
    assert status == 201
    pothole_ticket = comp_pothole["complaint"]["ticketId"]
    print(f" -> Citizen B Submitted Complaint: '{comp_pothole['complaint']['title']}' (Ticket: {pothole_ticket})")

    # STEP 4: VERIFY CITIZEN A "MY COMPLAINTS"
    print("\nSTEP 4: Querying GET /api/complaints/user for Citizen A...")
    status, list_a = make_request("/complaints/user", "GET", token=token_a)
    assert status == 200, f"Citizen A query failed: {list_a}"
    tickets_a = [c["ticketId"] for c in list_a]
    titles_a = [c["title"] for c in list_a]

    assert dogs_ticket in tickets_a, f"Citizen A should see 'Dogs' ticket ({dogs_ticket})"
    assert waste_ticket not in tickets_a, f"CRITICAL SECURITY VIOLATION: Citizen A MUST NOT see Guest ticket '{waste_ticket}'!"
    assert pothole_ticket not in tickets_a, f"CRITICAL SECURITY VIOLATION: Citizen A MUST NOT see Citizen B's ticket '{pothole_ticket}'!"
    print(f" -> [PASS] Citizen A sees ONLY Citizen A's complaints! ({titles_a})")

    # STEP 5: VERIFY CITIZEN B "MY COMPLAINTS"
    print("\nSTEP 5: Querying GET /api/complaints/user for Citizen B...")
    status, list_b = make_request("/complaints/user", "GET", token=token_b)
    assert status == 200, f"Citizen B query failed: {list_b}"
    tickets_b = [c["ticketId"] for c in list_b]
    titles_b = [c["title"] for c in list_b]

    assert pothole_ticket in tickets_b, f"Citizen B should see 'Pothole' ticket ({pothole_ticket})"
    assert dogs_ticket not in tickets_b, f"Citizen B MUST NOT see Citizen A's ticket '{dogs_ticket}'!"
    assert waste_ticket not in tickets_b, f"Citizen B MUST NOT see Guest ticket '{waste_ticket}'!"
    print(f" -> [PASS] Citizen B sees ONLY Citizen B's complaints! ({titles_b})")

    # STEP 6: VERIFY ADMIN COMPLAINT LIST
    print("\nSTEP 6: Querying GET /api/complaints for Zonal Admin...")
    status, admin_login = make_request("/users/login", "POST", {
        "email": "admin@smartcivic.gov.in",
        "password": "adminpassword123"
    })
    assert status == 200
    admin_token = admin_login["token"]

    status, admin_list = make_request("/complaints", "GET", token=admin_token)
    assert status == 200
    admin_tickets = [c["ticketId"] for c in admin_list]

    assert dogs_ticket in admin_tickets, f"Admin must see Citizen A's ticket ({dogs_ticket})"
    assert pothole_ticket in admin_tickets, f"Admin must see Citizen B's ticket ({pothole_ticket})"
    assert waste_ticket in admin_tickets, f"Admin must see Guest ticket ({waste_ticket})"
    print(f" -> [PASS] Admin sees ALL complaints across the city! (Total in system: {len(admin_list)})")

    print("\n==================================================")
    print("[SUCCESS] CITIZEN VS GUEST COMPLAINT SEPARATION VERIFIED 100%")
    print("==================================================\n")

if __name__ == "__main__":
    run_citizen_vs_guest_test()
