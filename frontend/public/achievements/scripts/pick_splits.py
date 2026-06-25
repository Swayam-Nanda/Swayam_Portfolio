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
boundaries = []

for i, char in enumerate(code):
    if char == '\n':
        if p_level == 0 and b_level == 0 and not in_string and not in_comment:
            boundaries.append(line_num)
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

# Now pick split points
total_lines = line_num
target_size = total_lines // 10
splits = []
last_split = 0

for b in boundaries:
    if b - last_split >= target_size:
        splits.append(b)
        last_split = b

print(f"Chosen split points: {splits}")
