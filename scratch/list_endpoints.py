import json

filepath = '/Users/dikshantjangra/Documents/projects/resolve-home/apps/platform/openapi.json'
with open(filepath, 'r') as f:
    data = json.load(f)

endpoints = []
for path, methods in data.get('paths', {}).items():
    for method in methods.keys():
        endpoints.append(f"{method.upper()} {path}")

print("\n".join(endpoints))
