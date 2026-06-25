
def extract_nav_ui_further():
    with open('assets/js/app.1746999829739.js', 'r', encoding='utf-8') as f:
        content = f.read()
    
    target = 'Class((function NavUI'
    idx = content.find(target)
    if idx != -1:
        print(f"Found NavUI at {idx}")
        # Print 5000 characters to see more
        print(content[idx:idx+5000])

if __name__ == "__main__":
    extract_nav_ui_further()
