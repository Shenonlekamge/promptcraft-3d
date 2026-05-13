import json
import os

def get_allowed_assets():
    # Adjust this path based on your folder structure
    manifest_path = os.path.join(os.path.dirname(__file__), "../frontend/public/models/manifest.json")
    with open(manifest_path, 'r') as f:
        data = json.load(f)
        # Returns a list of strings like ['bed', 'bedDouble', 'desk', ...]
        return [item['type'] for item in data]