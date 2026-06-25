
def get_exact_nav_code():
    with open('assets/js/app.1746999829739.js', 'r', encoding='utf-8') as f:
        content = f.read()
    
    target = '_this.title.x=_this.bg.x+80'
    idx = content.find(target)
    if idx != -1:
        # Get around 500 characters
        print(content[idx-100:idx+500])

if __name__ == "__main__":
    get_exact_nav_code()
