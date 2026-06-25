import os

file_path = 'assets/js/app.1746999829739.js'
out_dir = 'assets/js/modules/'

if not os.path.exists(out_dir):
    os.makedirs(out_dir)

# 1-based start line (inclusive), 1-based end line (inclusive)
boundaries = [
    ("01_core.js", 1, 5253),
    ("02_ui_base.js", 5254, 11208),
    ("03_ui_dom.js", 11209, 14202),
    ("04_app_state.js", 14203, 22315),
    ("05_engine_3d.js", 22316, 29338),
    ("06_math_3d.js", 29339, 33196),
    ("07_shaders.js", 33197, 45241),
    ("08_fx_logic.js", 45242, 60019),
    ("09_components.js", 60020, 75042),
    ("10_main.js", 75043, None) # End of file
]

with open(file_path, 'r', encoding='utf-8') as f:
    lines = f.readlines()

for filename, start, end in boundaries:
    out_path = os.path.join(out_dir, filename)
    with open(out_path, 'w', encoding='utf-8') as out_f:
        start_idx = start - 1
        end_idx = end if end is not None else len(lines)
        out_f.writelines(lines[start_idx:end_idx])
    
    print(f"Created {out_path} ({end_idx - start_idx} lines)")
