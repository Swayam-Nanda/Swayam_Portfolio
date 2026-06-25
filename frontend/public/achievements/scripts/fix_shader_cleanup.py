import re
import os

def fix_shader():
    path = 'assets/shaders/compiled.vs'
    with open(path, 'r') as f:
        content = f.read()
    
    # Define the pattern to remove (the redundant code block)
    # It starts after the analytical logo_sdf and ends at vec3 logo_norm
    pattern = r'return \(min\(max\(d, w\), 0.0\) \+ length\(max\(vec2\(d, w\), 0.0\)\)\) \* 0.8;\s*\}\s*\}\s*vec4 h6 = sin\(120.0 \* \(vec4\(.*?return \(d \+ \(-0.2934\)\) \* 0.5;\s*\}'
    
    # Let's try a more specific one based on the read_file output
    # The output showed two closing braces '}' or something?
    # No, it showed '}\n\n    vec4 h6 = ...'
    
    # Actually, I'll just look for the double definition of logo_sdf or the floating h6
    # I'll replace everything from the first 'vec4 h6' to the next 'vec3 logo_norm'
    
    fixed_content = re.sub(r'vec4 h6 = sin\(120.0 \* \(vec4\(.*?return \(d \+ \(-0.2934\)\) \* 0.5;\s*\}', '', content, flags=re.DOTALL)
    
    with open(path, 'w') as f:
        f.write(fixed_content)
    print("Shader cleaned up successfully.")

if __name__ == "__main__":
    fix_shader()
