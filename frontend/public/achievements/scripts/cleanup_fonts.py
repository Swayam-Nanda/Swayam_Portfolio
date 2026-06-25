import os

def cleanup_fonts():
    base_dir = 'activetheory.net'
    targets = [
        os.path.join(base_dir, 'assets/js/modules/11_module.js'),
        os.path.join(base_dir, 'assets/data/uil.json'),
        os.path.join(base_dir, 'assets/data/uil.1746999829739.json'),
        os.path.join(base_dir, 'assets/data/uil-partial.json'),
        os.path.join(base_dir, 'assets/data/timeline-main.json')
    ]
    
    replacements = {
        'NBArchitektStd-Regular': 'Aquatico',
        'NBArchitektStd-Bold': 'Aquire',
        'NBArchitektStd-Light': 'Aquatico',
        'nbarchitekt': 'Aquatico'
    }
    
    for target in targets:
        if not os.path.exists(target):
            print(f"Skipping {target} (not found)")
            continue
            
        with open(target, 'r', encoding='utf-8') as f:
            content = f.read()
        
        new_content = content
        for old, new in replacements.items():
            new_content = new_content.replace(old, new)
        
        if new_content != content:
            with open(target, 'w', encoding='utf-8') as f:
                f.write(new_content)
            print(f"Updated {target}")
        else:
            print(f"No changes needed for {target}")

if __name__ == "__main__":
    cleanup_fonts()
