import torch
import torch.nn as nn
import numpy as np
import os
import re

# 1. High-Frequency SIREN Architecture
class SirenLayer(nn.Module):
    def __init__(self, in_f, out_f):
        super().__init__()
        self.linear = nn.Linear(in_f, out_f)
    def forward(self, x):
        # 120.0 is a much higher frequency for razor-sharp edges
        return torch.sin(120.0 * self.linear(x))

class SDFNet(nn.Module):
    def __init__(self):
        super().__init__()
        self.l1 = SirenLayer(3, 32)
        self.l2 = nn.Linear(32, 1)
    def forward(self, x):
        return self.l2(self.l1(x))

def run_proper_fix():
    if not os.path.exists('sdf_data.npz'):
        print("Regenerating data for high quality...")
        import subprocess
        subprocess.run(["python", "scripts/generate_sdf_data.py"])

    data = np.load('sdf_data.npz')
    points = torch.from_numpy(data['points']).float()
    sdf = torch.from_numpy(data['sdf']).float().unsqueeze(1)
    
    device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
    model = SDFNet().to(device)
    points, sdf = points.to(device), sdf.to(device)
    
    optimizer = torch.optim.Adam(model.parameters(), lr=1e-4)
    criterion = nn.MSELoss()
    
    print(f"--- SUPER-RESOLUTION TRAINING STARTING ---")
    for epoch in range(15001):
        optimizer.zero_grad()
        pred = model(points)
        loss = criterion(pred, sdf)
        loss.backward()
        optimizer.step()
        if epoch % 1000 == 0:
            print(f"Epoch {epoch} | Accuracy Loss: {loss.item():.7f}")
        if loss.item() < 0.000005: break

    # EXTRACT AND GENERATE GLSL
    l1_w = model.l1.linear.weight.detach().cpu().numpy()
    l1_b = model.l1.linear.bias.detach().cpu().numpy()
    l2_w = model.l2.weight.detach().cpu().numpy()[0]
    l2_b = model.l2.bias.detach().cpu().numpy()[0]

    glsl = ["float logo_sdf(vec3 p) {", "    vec3 x = p;"]
    
    # Exporting 32 units as 8 vec4s for speed
    for i in range(8):
        w_chunk = l1_w[i*4:(i+1)*4]
        b_chunk = l1_b[i*4:(i+1)*4]
        glsl.append(f"    vec4 h{i} = sin(120.0 * (vec4(")
        for j in range(4):
            row = w_chunk[j]
            comma = "," if j < 3 else ""
            glsl.append(f"        dot(x, vec3({row[0]:.4f}, {row[1]:.4f}, {row[2]:.4f})) + ({b_chunk[j]:.4f}){comma}")
        glsl.append("    )));")
    
    glsl.append("    float d = ")
    for i in range(8):
        weights = l2_w[i*4:(i+1)*4]
        plus = " + " if i < 7 else ";"
        glsl.append(f"        dot(h{i}, vec4({weights[0]:.4f}, {weights[1]:.4f}, {weights[2]:.4f}, {weights[3]:.4f})){plus}")
    glsl.append(f"    return (d + ({l2_b:.4f})) * 0.5;")
    glsl.append("}")
    
    final_glsl = "\n".join(glsl)
    
    # AUTO-INJECT
    shader_path = 'assets/shaders/compiled.vs'
    with open(shader_path, 'r') as f:
        content = f.read()

    new_content = re.sub(r'float logo_sdf\(vec3 p\) \{.*?\}', final_glsl, content, flags=re.DOTALL)
    
    with open(shader_path, 'w') as f:
        f.write(new_content)
    
    print(f"\nSUCCESS! High-resolution 'S' injected into {shader_path}")

if __name__ == "__main__":
    run_proper_fix()
