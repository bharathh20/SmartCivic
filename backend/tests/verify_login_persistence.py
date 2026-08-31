# SmartCivic 12-Step Login Persistence & Account Restoration Verification Test
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

def run_12_step_test():
    print("\n==================================================")
    print("[12-STEP AUDIT] LOGIN PERSISTENCE & ACCOUNT RESTORATION AUDIT")
    print("==================================================\n")

    test_name = "Bharath Test"
    test_email = f"bharath_persist_{int(time.time())}@gmail.com"
    test_phone = "9876543210"
    test_pass = "password123"

    # STEP 1: Register brand-new citizen account
    print("STEP 1: Register brand-new citizen account...")
    status, reg_data = make_request("/users/register", "POST", {
        "fullName": test_name,
        "email": test_email,
        "mobile": test_phone,
        "password": test_pass,
        "address": "Indiranagar 10th Cross, Bengaluru"
    })
    assert status == 201 and "token" in reg_data, f"Registration failed with status {status}"
    reg_token = reg_data["token"]
    reg_user = reg_data["user"]
    print(f" -> Registered user: ID={reg_user['_id']}, Name={reg_user['name']}, Email={reg_user['email']}")

    # STEP 2: Confirm account exists in DB & retrieves via /me
    print("\nSTEP 2: Confirm account exists in database via GET /api/users/me...")
    status, me1 = make_request("/users/me", "GET", token=reg_token)
    assert status == 200 and me1["user"]["email"] == test_email, f"User lookup failed: {me1}"
    print(f" -> DB Lookup Success: Name={me1['user']['name']}, Email={me1['user']['email']}, Phone={me1['user']['mobile']}")

    # STEP 3: Login using registered email/password
    print("\nSTEP 3: Login using registered email and password...")
    status, login1 = make_request("/users/login", "POST", {
        "email": test_email,
        "password": test_pass
    })
    assert status == 200 and "token" in login1, f"First login failed: {login1}"
    login1_token = login1["token"]
    login1_user = login1["user"]
    print(" -> First Login Success!")

    # STEP 4: Verify correct name/email/phone appear
    print("\nSTEP 4: Verify login response contains correct citizen profile details...")
    assert login1_user["name"] == test_name, f"Expected {test_name}, got {login1_user['name']}"
    assert login1_user["email"] == test_email, f"Expected {test_email}, got {login1_user['email']}"
    assert login1_user["mobile"] == test_phone, f"Expected {test_phone}, got {login1_user['mobile']}"
    print(f" -> Verified: Name='{login1_user['name']}', Email='{login1_user['email']}', Phone='{login1_user['mobile']}'")

    # STEP 5: Logout (Simulated token clearance)
    print("\nSTEP 5: Simulating logout (clearing token)...")
    login1_token = None

    # STEP 6: Login AGAIN using the SAME email/password
    print("\nSTEP 6: Login AGAIN using the SAME email/password...")
    status, login2 = make_request("/users/login", "POST", {
        "email": test_email,
        "password": test_pass
    })
    assert status == 200 and "token" in login2, f"Second login failed: {login2}"
    login2_token = login2["token"]
    login2_user = login2["user"]
    print(" -> Second Login Success!")

    # STEP 7: Verify SAME account is restored
    print("\nSTEP 7: Verify SAME registered account was restored (not a default/fake account)...")
    assert login2_user["name"] == test_name, f"Restored wrong user name: {login2_user['name']}"
    assert login2_user["email"] == test_email, f"Restored wrong email: {login2_user['email']}"
    print(f" -> Verified: Restored user ID={login2_user['_id']} matching '{test_email}'")

    # STEP 8: Refresh page simulation (calling GET /api/users/me with second token)
    print("\nSTEP 8: Simulating browser page refresh (calling GET /api/users/me with token)...")
    status, me2 = make_request("/users/me", "GET", token=login2_token)
    assert status == 200 and me2["user"]["email"] == test_email, f"Session restore failed: {me2}"

    # STEP 9: Verify SAME account is still displayed after refresh
    print("\nSTEP 9: Verify SAME account is still displayed after refresh...")
    assert me2["user"]["name"] == test_name, f"After refresh got wrong name: {me2['user']['name']}"
    print(f" -> Verified after refresh: Name='{me2['user']['name']}', Email='{me2['user']['email']}'")

    # STEP 10: Change profile name (Bharath Test -> Bharath Updated)
    print("\nSTEP 10: Updating profile name via PUT /api/users/profile (Bharath Test -> Bharath Updated)...")
    status, edit_res = make_request("/users/profile", "PUT", {
        "name": "Bharath Updated",
        "mobile": "9876543210",
        "address": "Indiranagar 10th Cross, Bengaluru"
    }, token=login2_token)
    assert status == 200 and edit_res["user"]["name"] == "Bharath Updated", f"Profile update failed: {edit_res}"
    print(f" -> Profile Updated: Name='{edit_res['user']['name']}'")

    # STEP 11: Refresh page simulation after profile update
    print("\nSTEP 11: Simulating page refresh after profile update...")
    status, me3 = make_request("/users/me", "GET", token=login2_token)
    assert status == 200, f"Session restore after edit failed: {me3}"

    # STEP 12: Verify new name persists in database after refresh
    print("\nSTEP 12: Verify new name 'Bharath Updated' STILL persists after refresh...")
    assert me3["user"]["name"] == "Bharath Updated", f"Name did not persist: {me3['user']['name']}"
    print(f" -> Verified: New Name '{me3['user']['name']}' STILL PERSISts across refresh!")

    print("\n==================================================")
    print("[SUCCESS] ALL 12 STEPS PASSED SUCCESSFULLY! LOGIN PERSISTENCE BUG FIX VERIFIED 100%")
    print("==================================================\n")

if __name__ == "__main__":
    run_12_step_test()
