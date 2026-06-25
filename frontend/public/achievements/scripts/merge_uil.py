import json
import os
import sys

def merge_uil(target_dir='.'):
    # If run from scripts folder, move up one level to find assets
    if os.path.basename(os.getcwd()) == 'scripts' and target_dir == '.':
        target_dir = '..'

    data_dir = os.path.join(target_dir, 'assets/data')
    if not os.path.exists(data_dir):
        print(f"Error: Directory {data_dir} does not exist.")
        return

    merged_data = {}
    files = [
        'uil_cameras.json', 'uil_input_config.json', 'uil_input_elements.json',
        'uil_input_other.json', 'uil_particles.json', 'uil_mesh.json',
        'uil_scenelayout.json', 'uil_shaders.json', 'uil_vfx_logic.json', 'uil_misc.json'
    ]

    for filename in files:
        path = os.path.join(data_dir, filename)
        if os.path.exists(path):
            with open(path, 'r') as f:
                data = json.load(f)
                merged_data.update(data)
            print(f"Merged {path}")

    # Write back to both locations in target_dir
    uil_path = os.path.join(data_dir, 'uil.json')
    with open(uil_path, 'w') as f:
        json.dump(merged_data, f, indent=2)
    print(f"Updated: {uil_path}")

    # Find the versioned filename
    for f in os.listdir(data_dir):
        if f.startswith('uil.') and f.endswith('.json') and len(f) > 8:
            v_path = os.path.join(data_dir, f)
            with open(v_path, 'w') as fv:
                json.dump(merged_data, fv, indent=None, separators=(',', ':'))
            print(f"Updated versioned file: {v_path}")

if __name__ == "__main__":
    target = sys.argv[1] if len(sys.argv) > 1 else '.'
    merge_uil(target)

