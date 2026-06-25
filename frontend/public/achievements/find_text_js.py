import re

def find_text_in_js():
    with open('assets/js/app.1746999829739.js', 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Search for anything like _innerText:"...WORK..." or _innerText:"...CONTACT..."
    targets = [r'_innerText:"[^"]*WORK[^"]*"', r'_innerText:"[^"]*CONTACT[^"]*"']
    for target in targets:
        matches = re.finditer(target, content)
        for m in matches:
            print(f"Found at {m.start()}: {m.group()}")
            print(f"Context: {content[m.start()-100:m.end()+100]}")
            print("-" * 40)

    # Search for NavUI
    matches = re.finditer(r'NavUI', content)
    for m in matches:
        print(f"Found NavUI at {m.start()}: {content[m.start()-100:m.start()+200]}")
        print("-" * 40)

if __name__ == "__main__":
    find_text_in_js()
