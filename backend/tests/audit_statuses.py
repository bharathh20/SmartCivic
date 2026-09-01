import os

files = [
    'backend/utils/seedData.js',
    'backend/server.js',
    'backend/server.py',
    'backend/models/Complaint.js',
    'backend/controllers/complaintController.js',
    'backend/controllers/adminController.js',
    'app.js'
]

print("=== STATUS AUDIT ===")
for f in files:
    if os.path.exists(f):
        with open(f, 'r', encoding='utf-8') as fp:
            for i, line in enumerate(fp, 1):
                if 'status:' in line or 'status =' in line or 'status":' in line or 'status ==' in line:
                    print(f"{f}:{i} -> {line.strip()}")
