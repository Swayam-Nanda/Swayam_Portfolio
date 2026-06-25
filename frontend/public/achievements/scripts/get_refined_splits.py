import os

file_path = 'assets/js/app.1746999829739.js'

with open(file_path, 'r', encoding='utf-8') as f:
    code = f.read()

p_level = 0
b_level = 0
in_string = None
in_comment = None
escaped = False
line_num = 1
levels = [] # List of (line_num, p, b, ends_with_comma)

for i, char in enumerate(code):
    if char == '\n':
        # Check if line ends with comma (excluding whitespace)
        # We look back from i
        j = i - 1
        while j >= 0 and code[j].isspace(): j -= 1
        ends_with_comma = (j >= 0 and code[j] == ',')
        
        levels.append({'ln': line_num, 'p': p_level, 'b': b_level, 'comma': ends_with_comma})
        line_num += 1
    
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

# Pick 10 split points
num_modules = 10
total_lines = line_num
target_size = total_lines // num_modules
splits = []
last_split = 0

for i in range(1, num_modules):
    target_ln = i * target_size
    # Find the BEST split point near target_ln
    # Search in range [target_ln - 2000, target_ln + 2000]
    best_p = 999
    best_ln = -1
    
    for ln_idx in range(max(0, target_ln - 3000), min(len(levels), target_ln + 3000)):
        lvl = levels[ln_idx]
        if lvl['b'] == 0: # Must be at top-level bracket
            if lvl['p'] < best_p:
                best_p = lvl['p']
                best_ln = lvl['ln']
            elif lvl['p'] == best_p:
                # If same p, prefer points that end with a comma or are closer to target
                pass
    
    splits.append((best_ln, best_p))
    last_split = best_ln

print(f"Refined split points (line, p_level): {splits}")
