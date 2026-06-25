
def extract_nav_ui():
    with open('assets/js/app.1746999829739.js', 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Find NavUI definition
    target = 'NavUI'
    idx = content.find(target)
    while idx != -1:
        # Check if it's a Class((function NavUI
        if 'Class((function NavUI' in content[idx-20:idx+20]:
            print(f"Found NavUI at {idx}")
            print("--- CONTEXT ---")
            print(content[idx-100:idx+2000])
            print("--- END CONTEXT ---")
        idx = content.find(target, idx + 1)

if __name__ == "__main__":
    extract_nav_ui()
