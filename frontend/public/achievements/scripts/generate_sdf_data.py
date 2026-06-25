import trimesh
import numpy as np
import os

def generate_data(obj_path, output_path, num_points=125000):
    if not os.path.exists(obj_path):
        print(f"Error: {obj_path} not found. Please place your exported Blender file at the root.")
        return

    # Load the mesh
    mesh = trimesh.load(obj_path)
    
    # 1. Center and Normalize
    mesh.vertices -= mesh.bounding_box.centroid
    scale = 1.0 / np.max(mesh.bounding_box.extents)
    mesh.vertices *= scale
    
    print(f"Mesh loaded and normalized. Scale factor: {scale}")

    # 2. Lighter Sampling
    # Surface points
    surface_points, _ = trimesh.sample.sample_surface(mesh, num_points // 2)
    near_points = surface_points + np.random.normal(scale=0.03, size=surface_points.shape)
    
    # Random volume points
    random_points = np.random.uniform(-0.6, 0.6, size=(num_points // 2, 3))
    
    all_points = np.vstack([near_points, random_points])
    
    print(f"Calculating Signed Distances for {len(all_points)} points in chunks...")
    
    # 3. Chunked Calculation to prevent lag
    sdf_values = []
    chunk_size = 2000
    for i in range(0, len(all_points), chunk_size):
        chunk = all_points[i:i+chunk_size]
        sdf_values.append(trimesh.proximity.signed_distance(mesh, chunk))
        print(f"Progress: {min(i + chunk_size, len(all_points))}/{len(all_points)}", end='\r')
    
    sdf_values = np.concatenate(sdf_values)
    
    # 4. Save
    np.savez(output_path, points=all_points.astype(np.float32), sdf=sdf_values.astype(np.float32))
    print(f"\nSuccess! Training data saved to {output_path}")

if __name__ == "__main__":
    generate_data("target_s.obj", "sdf_data.npz")
