import trimesh
import numpy as np
import struct
import os

def convert_to_bin(obj_path, bin_path, num_particles=15000):
    if not os.path.exists(obj_path):
        print(f"Error: {obj_path} not found.")
        return

    # Load the mesh
    mesh = trimesh.load(obj_path)
    
    # Normalize to match the shader's coordinate system
    mesh.vertices -= mesh.bounding_box.centroid
    scale = 1.0 / np.max(mesh.bounding_box.extents)
    mesh.vertices *= scale
    
    print(f"Sampling {num_particles} particles from surface...")
    
    # Sample points on the surface of your 'S'
    points, _ = trimesh.sample.sample_surface(mesh, num_particles)
    
    # The Active Theory .bin format for these logo particles is typically:
    # [x, y, z] as float32 in a continuous stream.
    
    print(f"Writing to {bin_path}...")
    with open(bin_path, 'wb') as f:
        for p in points:
            # We pack x, y, z as little-endian float32
            f.write(struct.pack('<fff', p[0], p[1], p[2]))
            
    print("Success! Created new spawn geometry.")

if __name__ == "__main__":
    convert_to_bin("target_s.obj", "assets/geometry/particles/s_logo.bin")
