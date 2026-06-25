import torch
import torch.nn as nn
import numpy as np
import time

class SirenLayer(nn.Module):
    def __init__(self, in_f, out_f):
        super().__init__()
        self.linear = nn.Linear(in_f, out_f)
    
    def forward(self, x):
        return torch.sin(30.0 * self.linear(x))

class SDFNet(nn.Module):
    def __init__(self):
        super().__init__()
        # 16 units is the "Sweet Spot" for letters
        self.l1 = SirenLayer(3, 16)
        self.l2 = nn.Linear(16, 1)
        
    def forward(self, x):
        x = self.l1(x)
        return self.l2(x)

def train():
    data = np.load('sdf_data.npz')
    points = torch.from_numpy(data['points']).float()
    sdf = torch.from_numpy(data['sdf']).float().unsqueeze(1)
    
    device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
    model = SDFNet().to(device)
    points, sdf = points.to(device), sdf.to(device)
    
    optimizer = torch.optim.Adam(model.parameters(), lr=1e-4)
    criterion = nn.MSELoss()
    
    print(f"Retraining for High Quality... (Target Loss < 0.0001)")
    for epoch in range(10001):
        optimizer.zero_grad()
        pred = model(points)
        loss = criterion(pred, sdf)
        loss.backward()
        optimizer.step()
        
        if epoch % 1000 == 0:
            print(f"Epoch {epoch} | Loss: {loss.item():.6f}")
            
        if loss.item() < 0.00002: break

    # SAVE THE MODEL
    torch.save(model.state_dict(), 's_logo_model.pth')
    print("\nModel saved. Now running the GLSL Exporter...")
    export_to_glsl(model)

def export_to_glsl(model):
    # Extract weights
    l1_w = model.l1.linear.weight.detach().cpu().numpy()
    l1_b = model.l1.linear.bias.detach().cpu().numpy()
    l2_w = model.l2.weight.detach().cpu().numpy()[0]
    l2_b = model.l2.bias.detach().cpu().numpy()[0]

    print("\n--- COPY THIS EXACT CODE INTO THE SHADER ---")
    print("float logo_sdf(vec3 p) {")
    print("    vec3 x = p;")
    
    # We'll export as 4 mat4x3 to represent the 16 units
    for i in range(4):
        w_chunk = l1_w[i*4:(i+1)*4]
        b_chunk = l1_b[i*4:(i+1)*4]
        print(f"    vec4 h{i} = sin(30.0 * (vec4(")
        for j in range(4):
            row = w_chunk[j]
            comma = "," if j < 3 else ""
            print(f"        dot(x, vec3({row[0]:.4f}, {row[1]:.4f}, {row[2]:.4f})) + ({b_chunk[j]:.4f}){comma}")
        print("    )));")
    
    # Output layer
    print("    float d = ")
    for i in range(4):
        weights = l2_w[i*4:(i+1)*4]
        plus = " + " if i < 3 else ";"
        print(f"        dot(h{i}, vec4({weights[0]:.4f}, {weights[1]:.4f}, {weights[2]:.4f}, {weights[3]:.4f})){plus}")
    
    print(f"    return (d + ({l2_b:.4f})) * 0.5;")
    print("}")

if __name__ == "__main__":
    train()
