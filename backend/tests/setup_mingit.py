import urllib.request
import zipfile
import os
import sys

mingit_url = "https://github.com/git-for-windows/git/releases/download/v2.45.2.windows.1/MinGit-2.45.2-64-bit.zip"
target_dir = os.path.expandvars(r"%LOCALAPPDATA%\Programs\MinGit")
zip_path = os.path.expandvars(r"%LOCALAPPDATA%\Programs\mingit.zip")

os.makedirs(target_dir, exist_ok=True)

print(f"Downloading MinGit from {mingit_url}...")
try:
    urllib.request.urlretrieve(mingit_url, zip_path)
    print("Download complete. Extracting...")
    with zipfile.ZipFile(zip_path, 'r') as zip_ref:
        zip_ref.extractall(target_dir)
    print(f"MinGit extracted successfully to {target_dir}!")
    if os.path.exists(zip_path):
        os.remove(zip_path)
    
    git_cmd = os.path.join(target_dir, "cmd", "git.exe")
    print(f"Git executable verified: {os.path.exists(git_cmd)} ({git_cmd})")
except Exception as e:
    print(f"Error: {e}")
