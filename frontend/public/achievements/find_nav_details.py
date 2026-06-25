import re

def find_exact_strings():
    with open('assets/js/app.1746999829739.js', 'r', encoding='utf-8') as f:
        content = f.read()

    # Search for the layout block in startRender
    pattern = r'_this\.title\.x=_this\.bg\.x\+80,_this\.title\.y=_this\.bg\.y\+\.475\*_this\.bg\.height\+4\.5\*bgShader\.uniforms\.uScrollDelta\.value,_this\.audio\.x=_this\.bg\.x\+\.5\*_this\.bg\.width-_this\.audio\.width/2-13,_this\.audio\.y=_this\.bg\.y\+\.475\*_this\.bg\.height\+4\.5\*bgShader\.uniforms\.uScrollDelta\.value-12,Tests\.noMusic\(\)&&\(_this\.title\.x-=8,_this\.audio\.width=30,_this\.audio\.alpha=\.6,_this\.audio\.x-=2\)'
    match = re.search(pattern, content)
    if match:
        print("Found layout block:")
        print(match.group())
    else:
        print("Layout block not found exactly as expected. Trying partial match...")
        # Try a more flexible search
        pattern_flex = r'_this\.title\.x=_this\.bg\.x\+80.*Tests\.noMusic\(\)&&\(_this\.title\.x-=8,_this\.audio\.width=30,_this\.audio\.alpha=\.6,_this\.audio\.x-=2\)'
        match_flex = re.search(pattern_flex, content)
        if match_flex:
            print("Found flexible layout block:")
            print(match_flex.group())
        else:
            print("Flexible layout block not found either.")

if __name__ == "__main__":
    find_exact_strings()
