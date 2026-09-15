import os
import glob

admin_pages_dir = "josdy/src/pages/admin/"
files = glob.glob(os.path.join(admin_pages_dir, "*.jsx")) + glob.glob(os.path.join(admin_pages_dir, "*.tsx"))

replacements = {
    'import.meta.env.VITE_BACKEND_URL || "http://localhost:5000/api"': 'import.meta.env.VITE_API_URL || "http://localhost:3001/api"',
    'http://localhost:5000/api': 'http://localhost:3001/api',
}

for filepath in files:
    with open(filepath, 'r') as f:
        content = f.read()
        
    original = content
    for old, new in replacements.items():
        content = content.replace(old, new)
        
    if content != original:
        with open(filepath, 'w') as f:
            f.write(content)
        print(f"Fixed URLs in {filepath}")
    else:
        print(f"No changes needed in {filepath}")
