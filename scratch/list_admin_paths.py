import json

with open('/Users/dikshantjangra/.gemini/antigravity/brain/5c0fdd6c-7dd1-49e3-a619-1f9ef1d8de10/.system_generated/steps/755/content.md', 'r') as f:
    content = f.read()
    # Skip the "Source: ..." header
    json_str = content.split('---', 1)[1].strip()
    data = json.loads(json_str)
    
    paths = data.get('paths', {})
    admin_paths = [p for p in paths.keys() if '/api/admin' in p]
    for p in sorted(admin_paths):
        methods = list(paths[p].keys())
        print(f"{p}: {methods}")
