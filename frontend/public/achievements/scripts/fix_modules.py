import os

module_names = [
    "01_core.js", "02_ui_base.js", "03_ui_dom.js", "04_app_state.js",
    "05_engine_3d.js", "06_math_3d.js", "07_shaders.js", "08_fx_logic.js",
    "09_components.js", "10_main.js"
]
out_dir = 'assets/js/modules/'

for name in module_names:
    path = os.path.join(out_dir, name)
    with open(path, 'r', encoding='utf-8') as f:
        code = f.read()
    
    p_level = 0
    b_level = 0
    in_string = None
    in_comment = None
    escaped = False
    
    for i, char in enumerate(code):
        if escaped: escaped = False; continue
        if char == '\\': escaped = True; continue
        if in_comment == 'single':
            if char == '\n': in_comment = None
            continue
        if in_comment == 'multi':
            if char == '/' and i > 0 and code[i-1] == '*': in_comment = None
            continue
        if in_string:
            if char == in_string: in_string = None
            continue
        if char == '"' or char == "'" or char == '`': in_string = char; continue
        if char == '/' and i < len(code)-1:
            if code[i+1] == '/': in_comment = 'single'; continue
            if code[i+1] == '*': in_comment = 'multi'; continue
        if char == '(': p_level += 1
        elif char == ')': p_level -= 1
        elif char == '{': b_level += 1
        elif char == '}': b_level -= 1
    
    print(f"File {name}: p={p_level}, b={b_level}")
    
    if p_level != 0 or b_level != 0:
        if p_level > 0:
             code = code.rstrip() + (')' * p_level) + ';\n'
             print(f"  -> Fixed p_level by adding {p_level} parens")
        elif p_level < 0:
             code = ('(' * abs(p_level)) + code
             print(f"  -> Fixed p_level by adding {abs(p_level)} opening parens")
        
        # Note: fixing b_level is harder as it might be a class/function.
        # But for these modules, they should all be at b=0.
        
        with open(path, 'w', encoding='utf-8') as f:
            f.write(code)
