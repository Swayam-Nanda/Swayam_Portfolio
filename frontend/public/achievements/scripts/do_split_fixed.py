import os
import re

file_path = 'assets/js/app.1746999829739.js'
out_dir = 'assets/js/modules/'

if not os.path.exists(out_dir):
    os.makedirs(out_dir)

# 1-based safe split points (the LAST line of each module)
safe_points = [5253, 11746, 18259, 24923, 33196, 40672, 48726, 56668, 64677, 75042]
module_names = [
    "01_core.js", "02_ui_base.js", "03_ui_dom.js", "04_app_state.js",
    "05_engine_3d.js", "06_math_3d.js", "07_shaders.js", "08_fx_logic.js",
    "09_components.js", "10_main.js"
]

with open(file_path, 'r', encoding='utf-8') as f:
    lines = f.readlines()

start_idx = 0
for i, end_line in enumerate(safe_points):
    filename = module_names[i]
    out_path = os.path.join(out_dir, filename)
    
    end_idx = end_line # Exclusive in slice, but end_line is 1-based index
    chunk = lines[start_idx:end_idx]
    
    # Fix the last line of the chunk
    last_line = chunk[-1].rstrip()
    if last_line.endswith(','):
        chunk[-1] = last_line[:-1] + ';\n'
    elif not last_line.endswith(';') and not last_line.endswith('{'):
        chunk[-1] = last_line + ';\n'
        
    with open(out_path, 'w', encoding='utf-8') as out_f:
        out_f.writelines(chunk)
    
    print(f"Created {out_path} ({len(chunk)} lines)")
    start_idx = end_idx

# Handle the last module (10_main.js)
filename = module_names[-1]
out_path = os.path.join(out_dir, filename)
chunk = lines[start_idx:]
with open(out_path, 'w', encoding='utf-8') as out_f:
    out_f.writelines(chunk)
print(f"Created {out_path} ({len(chunk)} lines)")
