import json
import os

def get_allowed_assets():
    manifest_path = os.path.join(os.path.dirname(__file__), "../frontend/public/models/manifest.json")
    with open(manifest_path, 'r') as f:
        data = json.load(f)
        return [item['type'] for item in data]