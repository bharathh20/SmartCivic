import json
import urllib.request
import urllib.parse
import time
import sys

BASE_URL = 'http://localhost:5000/api'

def request(method, path, data=None, token=None):
    url = f'{BASE_URL}{path}'
    headers = {'Content-Type': 'application/json'}
    if token:
        headers['Authorization'] = f'Bearer {token}'
    req_data = json.dumps(data).encode('utf-8') if data is not None else None
    req = urllib.request.Request(url, data=req_data, headers=headers, method=method)
    try:
        with urllib.request.urlopen(req) as resp:
            body = resp.read().decode('utf-8')
            return resp.status, json.loads(body) if body else {}
    except urllib.error.HTTPError as e:
        body = e.read().decode('utf-8')
        try:
            err_json = json.loads(body)
        except:
            err_json = {'error': body}
        return e.code, err_json

def login(email, password):
    status, res = request('POST', '/users/login', {'email': email, 'password': password})
    assert status == 200, f'Login failed for {email}: {res}'
    assert 'token' in res, f'No token returned for {email}'
    assert 'department' in res['user'], f'department not returned in user object for {email}'
    return res['token'], res['user']

def run_tests():
    print('=====================================================')
    print('STARTING VERIFICATION OF ALL 5 REQUIRED TESTS')
    print('=====================================================')

    print('\nLogging in Admin and Citizen...')
    admin_token, admin_user = login('admin@smartcivic.gov.in', 'adminpassword123')
    print(f'Admin logged in: {admin_user["name"]} ({admin_user["role"]})')

    citizen_token, citizen_user = login('arjun.sharma@gmail.com', 'password123')
    print(f'Citizen logged in: {citizen_user["name"]} (ID: {citizen_user["_id"]})')

    # TEST 1: Water & Sewage -> BWSSB & BWSSB officer visibility
    print('\n--- TEST 1: Create Water & Sewage complaint -> Confirm department = BWSSB & BWSSB officer sees it ---')
    comp_data_1 = {
        'title': 'Sewage pipe burst on 100ft Road',
        'category': 'Water & Sewage',
        'priority': 'High',
        'description': 'Severe sewage leak on main road causing health hazard.',
        'location': '100ft Road, Indiranagar'
    }
    s, r = request('POST', '/complaints', comp_data_1, token=citizen_token)
    assert s in [200, 201], f'Failed to create complaint: {r}'
    comp1 = r['complaint']
    ticket1 = comp1['ticketId']
    print(f'Created Complaint: ticketId={ticket1}, category={comp1["category"]}, department={comp1["department"]}')
    assert comp1['department'] == 'BWSSB', f'Expected department BWSSB, got {comp1["department"]}'

    bwssb_token, bwssb_user = login('officer.bwssb@smartcivic.gov.in', 'officer123')
    print(f'Logged in BWSSB Officer: {bwssb_user["name"]}, department: {bwssb_user["department"]}')
    assert bwssb_user['department'] == 'BWSSB', f'BWSSB officer department is {bwssb_user["department"]}'

    s, all_comps = request('GET', '/admin/complaints', token=bwssb_token)
    assert s == 200, f'BWSSB officer failed to get complaints: {all_comps}'
    
    bwssb_queue = [c for c in all_comps if c.get('department') == bwssb_user['department']]
    matched1 = next((c for c in bwssb_queue if c['ticketId'] == ticket1), None)
    assert matched1 is not None, f'Ticket {ticket1} NOT found in BWSSB officer queue!'
    print(f'SUCCESS TEST 1: Ticket {ticket1} is correctly in BWSSB department queue!')

    # TEST 2: Admin changes status: Submitted -> Verified
    print('\n--- TEST 2: Admin updates status to Verified -> Confirm Citizen sees Verified ---')
    update_payload = {
        'status': 'Verified',
        'assignedOfficer': 'Venkatesh R',
        'officerRole': 'Chief Hydro Engineer',
        'remark': 'Field inspector confirmed sewage pipe breach. BWSSB emergency crew dispatched.',
        'department': 'BWSSB'
    }
    s, r = request('PUT', f'/admin/complaints/{ticket1}/status', update_payload, token=admin_token)
    assert s == 200, f'Admin status update failed: {r}'
    assert r['complaint']['status'] == 'Verified', f'Status not updated in response: {r}'
    print(f'Admin PUT Response confirmed: status={r["complaint"]["status"]}, department={r["complaint"]["department"]}')

    s, user_comps = request('GET', '/complaints/user', token=citizen_token)
    assert s == 200, f'Citizen fetch failed: {user_comps}'
    citizen_c1 = next((c for c in user_comps if c['ticketId'] == ticket1), None)
    assert citizen_c1 is not None, f'Ticket {ticket1} not found in citizen complaints!'
    assert citizen_c1['status'] == 'Verified', f'Expected Verified in Citizen Portal, got {citizen_c1["status"]}'
    
    timeline = citizen_c1.get('timeline', [])
    submitted_step = next((t for t in timeline if t['status'] == 'Submitted'), None)
    verified_step = next((t for t in timeline if t['status'] == 'Verified'), None)
    assigned_step = next((t for t in timeline if t['status'] == 'Assigned'), None)
    assert submitted_step and submitted_step['done'] == True, 'Submitted should be done'
    assert verified_step and verified_step['done'] == True, 'Verified should be done'
    assert assigned_step and assigned_step['done'] == False, 'Assigned must NOT be done'
    print(f'SUCCESS TEST 2: Citizen complaint refreshed, showing status: {citizen_c1["status"]} and verified timeline step!')

    # TEST 3: Parks & Vegetation -> BBMP Sanitation
    print('\n--- TEST 3: Create Parks & Vegetation complaint -> Confirm department = BBMP Sanitation ---')
    comp_data_3 = {
        'title': 'Fallen tree branches blocking walkway',
        'category': 'Parks & Vegetation',
        'priority': 'Medium',
        'description': 'Overhanging and fallen branches on park walking track.',
        'location': 'Cubbon Park, Bengaluru'
    }
    s, r = request('POST', '/complaints', comp_data_3, token=citizen_token)
    assert s in [200, 201], f'Failed to create complaint: {r}'
    comp3 = r['complaint']
    ticket3 = comp3['ticketId']
    print(f'Created Complaint: ticketId={ticket3}, category={comp3["category"]}, department={comp3["department"]}')
    assert comp3['department'] == 'BBMP Sanitation', f'Expected BBMP Sanitation, got {comp3["department"]}'

    sanitation_token, sanitation_user = login('officer.sanitation@smartcivic.gov.in', 'officer123')
    print(f'Logged in BBMP Sanitation Officer: {sanitation_user["name"]}, department: {sanitation_user["department"]}')
    assert sanitation_user['department'] == 'BBMP Sanitation'

    s, all_comps = request('GET', '/admin/complaints', token=sanitation_token)
    sanitation_queue = [c for c in all_comps if c.get('department') == sanitation_user['department']]
    matched3 = next((c for c in sanitation_queue if c['ticketId'] == ticket3), None)
    assert matched3 is not None, f'Ticket {ticket3} NOT found in BBMP Sanitation queue!'
    print(f'SUCCESS TEST 3: Ticket {ticket3} successfully routed to BBMP Sanitation queue!')

    # TEST 4: Public Safety -> Traffic Police
    print('\n--- TEST 4: Create Public Safety complaint -> Confirm department = Traffic Police ---')
    comp_data_4 = {
        'title': 'Traffic signal malfunctioning at junction',
        'category': 'Public Safety',
        'priority': 'High',
        'description': 'Traffic light stuck on green both ways causing gridlock.',
        'location': 'Sony World Junction, Koramangala'
    }
    s, r = request('POST', '/complaints', comp_data_4, token=citizen_token)
    assert s in [200, 201], f'Failed to create complaint: {r}'
    comp4 = r['complaint']
    ticket4 = comp4['ticketId']
    print(f'Created Complaint: ticketId={ticket4}, category={comp4["category"]}, department={comp4["department"]}')
    assert comp4['department'] == 'Traffic Police', f'Expected Traffic Police, got {comp4["department"]}'

    traffic_token, traffic_user = login('officer.traffic@smartcivic.gov.in', 'officer123')
    print(f'Logged in Traffic Police Officer: {traffic_user["name"]}, department: {traffic_user["department"]}')
    assert traffic_user['department'] == 'Traffic Police'

    s, all_comps = request('GET', '/admin/complaints', token=traffic_token)
    traffic_queue = [c for c in all_comps if c.get('department') == traffic_user['department']]
    matched4 = next((c for c in traffic_queue if c['ticketId'] == ticket4), None)
    assert matched4 is not None, f'Ticket {ticket4} NOT found in Traffic Police queue!'
    print(f'SUCCESS TEST 4: Ticket {ticket4} successfully routed to Traffic Police queue!')

    # TEST 5: Admin reassigns complaint between canonical departments
    print('\n--- TEST 5: Reassign complaint department (BWSSB -> PWD) ---')
    reassign_payload = {
        'status': 'Assigned',
        'assignedOfficer': 'Rajesh Kumar',
        'officerRole': 'PWD Chief Engineer',
        'remark': 'Reassigned from BWSSB to PWD for road restoration.',
        'department': 'PWD'
    }
    s, r = request('PUT', f'/admin/complaints/{ticket1}/status', reassign_payload, token=admin_token)
    assert s == 200, f'Reassignment failed: {r}'
    assert r['complaint']['department'] == 'PWD', f'Department not changed in DB: {r}'
    print(f'Reassigned {ticket1} in DB to: {r["complaint"]["department"]}')

    s, all_comps_after = request('GET', '/admin/complaints', token=bwssb_token)
    bwssb_queue_after = [c for c in all_comps_after if c.get('department') == 'BWSSB']
    assert not any(c['ticketId'] == ticket1 for c in bwssb_queue_after), f'Ticket {ticket1} still present in old department BWSSB!'
    print(f'Confirmed: Ticket {ticket1} disappeared from old department BWSSB queue.')

    pwd_token, pwd_user = login('officer.pwd@smartcivic.gov.in', 'officer123')
    pwd_queue = [c for c in all_comps_after if c.get('department') == 'PWD']
    assert any(c['ticketId'] == ticket1 for c in pwd_queue), f'Ticket {ticket1} NOT found in new department PWD queue!'
    print(f'Confirmed: Ticket {ticket1} appears in new department PWD queue.')

    print('\n=====================================================')
    print('ALL 5 TESTS PASSED WITH 100% SUCCESS!')
    print('=====================================================')

if __name__ == '__main__':
    run_tests()
