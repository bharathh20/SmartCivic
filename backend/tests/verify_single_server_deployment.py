# SmartCivic Single Unified Server Verification Test
import urllib.request
import json

BASE_URL = "http://localhost:5000"

def test_single_server():
    print("\n==================================================")
    print("[DEPLOYMENT AUDIT] TESTING SINGLE UNIFIED APPLICATION")
    print("==================================================\n")

    # 1. Test Root Frontend Serving (index.html)
    print("TEST 1: Fetching Root URL (http://localhost:5000/)...")
    req = urllib.request.Request(f"{BASE_URL}/")
    with urllib.request.urlopen(req) as res:
        html = res.read().decode('utf-8')
        assert res.status == 200
        assert "SmartCivic" in html
        assert "<div id=\"root\"></div>" in html
        print(f" -> [PASS] Root URL successfully serves frontend index.html (HTTP 200, {len(html)} bytes)")

    # 2. Test Frontend Static Asset (app.js)
    print("\nTEST 2: Fetching app.js from same server (http://localhost:5000/app.js)...")
    req = urllib.request.Request(f"{BASE_URL}/app.js")
    with urllib.request.urlopen(req) as res:
        js = res.read().decode('utf-8')
        assert res.status == 200
        assert "React" in js
        assert "API_BASE_URL" in js
        print(f" -> [PASS] Frontend script app.js loaded from same server (HTTP 200, {len(js)} bytes)")

    # 3. Test Stylesheet (styles.css)
    print("\nTEST 3: Fetching styles.css from same server (http://localhost:5000/styles.css)...")
    req = urllib.request.Request(f"{BASE_URL}/styles.css")
    with urllib.request.urlopen(req) as res:
        css = res.read().decode('utf-8')
        assert res.status == 200
        print(f" -> [PASS] Stylesheet styles.css loaded from same server (HTTP 200, {len(css)} bytes)")

    # 4. Test REST API Health Route (/api/health)
    print("\nTEST 4: Calling REST API Health endpoint (http://localhost:5000/api/health)...")
    req = urllib.request.Request(f"{BASE_URL}/api/health")
    with urllib.request.urlopen(req) as res:
        data = json.loads(res.read().decode('utf-8'))
        assert res.status == 200
        assert data.get("status") == "OK"
        print(f" -> [PASS] REST API operational: {data.get('message')}")

    # 5. Test Authentication & API Integration under same server
    print("\nTEST 5: Authenticating Admin via /api/users/login...")
    login_data = json.dumps({"email": "admin@smartcivic.gov.in", "password": "adminpassword123"}).encode('utf-8')
    req = urllib.request.Request(f"{BASE_URL}/api/users/login", data=login_data, headers={"Content-Type": "application/json"}, method="POST")
    with urllib.request.urlopen(req) as res:
        auth_data = json.loads(res.read().decode('utf-8'))
        assert res.status == 200
        assert auth_data.get("token") is not None
        assert auth_data["user"]["role"] == "admin"
        print(f" -> [PASS] Admin authenticated successfully under unified URL!")

    print("\n==================================================")
    print("[SUCCESS] SINGLE-SERVER ARCHITECTURE VERIFIED 100%")
    print("==================================================\n")

if __name__ == "__main__":
    test_single_server()
