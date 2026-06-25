import json
import os

files_to_patch = {
    'assets/data/uil_input_elements.json': {
        "CleanRoom_text3d": "#FFD700",
        "Home_text3d": "#FF4500",
        "WorkDetailContent_text3d": "#E0E0E0",
        "WorkDetailSub_text3d": "#E0E0E0",
        "WorkDetailAlign_text3d": "#E0E0E0"
    },
    'assets/data/uil_vfx_logic.json': {
        "UnrealBloomTintColor": "#FFD700"
    },
    'assets/data/uil_input_other.json': {
        "HydraLens_halo_color": "#FFD700",
        "HydraLens_bloom_color": "#FFD700"
    }
}

for filepath, patches in files_to_patch.items():
    if not os.path.exists(filepath):
        print(f"Skipping {filepath}, does not exist.")
        continue
        
    with open(filepath, 'r', encoding='utf-8') as f:
        data = json.load(f)
        
    for k, v in patches.items():
        if k in data:
            data[k] = v
            print(f"Updated {k} -> {v} in {filepath}")
        else:
             # Some nested properties need deeper inspection
             for key, value in data.items():
                 if isinstance(value, dict) and k in value:
                     data[key][k] = v
                     print(f"Updated {key}.{k} -> {v} in {filepath}")
                 elif isinstance(value, str) and k in key:
                     data[key] = v
                     print(f"Updated {key} -> {v} in {filepath}")
            
    with open(filepath, 'w', encoding='utf-8') as f:
        json.dump(data, f, indent=2)

print("Exhaustive Patching complete.")