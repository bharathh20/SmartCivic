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

def test_profile_features():
    print("\n=======================================================")
    print("TESTING SMARTCIVIC PROFILE PAGE ENHANCEMENTS")
    print("=======================================================\n")

    # 1. Register a new citizen
    email = f"profile_test_{int(time.time())}@example.com"
    reg_payload = {
        "fullName": "Test Citizen Profile",
        "email": email,
        "password": "password123",
        "mobile": "+91 91234 56789",
        "address": "45, 100ft Road, Indiranagar, Bengaluru"
    }
    status, res = make_req("/users/register", "POST", reg_payload)
    assert status == 201, f"Registration failed: {res}"
    token = res["token"]
    user = res["user"]
    print("[PASS] Citizen Registration")

    # Verify Aadhaar is NOT present
    assert "aadhaar" not in user, "Aadhaar must not be present in user object"
    assert "unmaskedAadhaar" not in user, "Unmasked Aadhaar must not be present in user object"
    print("[PASS] Aadhaar field completely absent in registration response")

    # Verify Member Since is not hardcoded January 2023
    assert user.get("memberSince") != "January 2023", f"Member Since must be dynamic, got {user.get('memberSince')}"
    print(f"[PASS] Member Since is dynamic: '{user.get('memberSince')}'")

    # 2. Get Profile (/api/users/me)
    status, me_res = make_req("/users/me", "GET", token=token)
    assert status == 200, f"Get Profile failed: {me_res}"
    me_user = me_res["user"]
    assert "aadhaar" not in me_user, "Aadhaar must not be present in /me response"
    assert me_user.get("memberSince") == user.get("memberSince"), "Member Since must remain stable"
    print("[PASS] /api/users/me verification passed")

    # 3. Update Profile Photo & Details (/api/users/profile)
    avatar_mock = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg=="
    update_payload = {
        "name": "Test Citizen Profile Updated",
        "mobile": "+91 98888 77777",
        "address": "78, 80ft Road, HAL 2nd Stage, Bengaluru",
        "avatar": avatar_mock
    }
    status, up_res = make_req("/users/profile", "PUT", update_payload, token=token)
    assert status == 200, f"Profile Update failed: {up_res}"
    updated_user = up_res["user"]
    assert updated_user.get("name") == "Test Citizen Profile Updated"
    assert updated_user.get("avatar") == avatar_mock
    print("[PASS] Profile Photo (Avatar) uploaded and persisted in database")

    # 4. Verify Persistence after Re-login
    status, login_res = make_req("/users/login", "POST", {"email": email, "password": "password123"})
    assert status == 200, f"Login failed: {login_res}"
    logged_in_user = login_res["user"]
    assert logged_in_user.get("avatar") == avatar_mock, "Avatar must persist across login sessions"
    assert logged_in_user.get("memberSince") == user.get("memberSince"), "Member Since must persist across login sessions"
    print("[PASS] Profile Photo and Member Since persist accurately after re-login")

    print("\n=======================================================")
    print("ALL PROFILE PAGE ENHANCEMENT TESTS PASSED (100% SUCCESS)!")
    print("=======================================================\n")

if __name__ == "__main__":
    test_profile_features()
