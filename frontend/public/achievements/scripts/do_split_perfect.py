import os

file_path = 'assets/js/app.1746999829739.js'
out_dir = 'assets/js/modules/'
if not os.path.exists(out_dir):
    os.makedirs(out_dir)

# Refined split points (line, p_level)
# These are the LAST lines of each module.
splits = [(10500, 2), (13215, 0), (22316, 0), (28320, 0), (36155, 2), (45564, 0), (57425, 0), (59596, 2), (67409, 2)]

with open(file_path, 'r', encoding='utf-8') as f:
    lines = f.readlines()

module_names = [
    "01_core.js", "02_ui_base.js", "03_ui_dom.js", "04_app_state.js",
    "05_engine_3d.js", "06_math_3d.js", "07_shaders.js", "08_fx_logic.js",
    "09_components.js", "10_main.js"
]

start_idx = 0
current_open_p = 0

for i, (end_line, p_at_end) in enumerate(splits):
    filename = module_names[i]
    out_path = os.path.join(out_dir, filename)
    
    end_idx = end_line # lines[start_idx:end_idx]
    chunk = lines[start_idx:end_idx]
    
    # 1. Adjust the START of the chunk based on current_open_p
    if current_open_p > 0:
        chunk[0] = ('(' * current_open_p) + chunk[0]
        
    # 2. Adjust the END of the chunk based on p_at_end
    last_line = chunk[-1].rstrip()
    if p_at_end > 0:
        # If it ends with a comma, replace it
        if last_line.endswith(','):
            last_line = last_line[:-1]
        chunk[-1] = last_line + (')' * p_at_end) + ';\n'
    else:
        # If p=0, just make sure it has a semicolon if it was a comma
        if last_line.endswith(','):
            chunk[-1] = last_line[:-1] + ';\n'

    # Special case for the very first file: it starts with '(' on line 7
    # But wait, my p_level tracking already includes that.
    # Actually, line 1-6 are RNG and console setup.
    # Line 7 starts '('. So current_open_p for first file is 0, but it contains '(' naturally.
    
    with open(out_path, 'w', encoding='utf-8') as out_f:
        out_f.writelines(chunk)
    
    print(f"Created {out_path} ({len(chunk)} lines), closed p={p_at_end}")
    
    start_idx = end_idx
    current_open_p = p_at_end

# Last module
filename = module_names[-1]
out_path = os.path.join(out_dir, filename)
chunk = lines[start_idx:]
if current_open_p > 0:
    chunk[0] = ('(' * current_open_p) + chunk[0]

with open(out_path, 'w', encoding='utf-8') as out_f:
    out_f.writelines(chunk)
print(f"Created {out_path} ({len(chunk)} lines), start p={current_open_p}")
