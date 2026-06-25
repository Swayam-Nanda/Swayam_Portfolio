import json
import os

files_to_patch = {
    'assets/data/uil_shaders.json': {
        "ATPBR/ATPBR/Element_2_homeScene/uTint": "#FFD700",
        "ATPBR/ATPBR/Element_3_homeScene/uTint": "#DC143C",
        "ATPBR/ATPBR/Element_6_homeScene/uTint": "#FFD700",
        "BulbShader/BulbShader/Element_0_Bulb/uTint": "#FFD700",
        "ParticleTestShader/ParticleTestShader/P_Element_0_ParticleTest/uTint": "#FFD700",
        "RoomPBR/RoomPBR/Element_3_CleanRoom/uTint": "#DC143C",
        "TentacleShader/TentacleShader/uTint": "#FF4500",
        "HomeAlleyShader/HomeAlleyShader/Element_4_home_scene/uColor0": "#FFD700",
        "HomeFloorShader/HomeFloorShader/Element_2_home_scene/uColor": "#DC143C",
        "HomeScreenLight/HomeScreenLight/Element_14_home_scene/uColor": "#FF4500",
        "HomeScreenLight/HomeScreenLight/Element_15_home_scene/uColor": "#FF4500",
        "SpineShader/SpineShader/Element_5_Work/uColor": "#E0E0E0",
        "TreeFBR/TreeFBR/Element_1_TreeScene/uColor": "#FFD700",
        "TreeFBR/TreeFBR/Element_8_TreeScene/uColor": "#DC143C",
        "TreeWaterShader/TreeWaterShader/uColor": "#080808",
        "GlassCubeShader/GlassCubeShader/Element_0_home_scene/uPhongColor": "#FFD700",
        "HomeAlleyShader/HomeAlleyShader/Element_4_home_scene/uPhongColor": "#FF4500"
    },
    'assets/data/uil_misc.json': {
        "HomeSceneVFX_home_uFogColor": "#FF4500",
        "L_Element_11_home_scenecolor": "#FFD700",
        "CoreParticlesShader/CoreParticlesShader/P_Element_0_BodyCores/uColor": "#FFD700",
        "CoreParticlesShader/CoreParticlesShader/P_Element_0_BodyCores/uColorB": "#DC143C",
        "CoreParticlesShader/CoreParticlesShader/P_Element_0_BodyCores/uColorC": "#FF4500"
    }
}

for filepath, patches in files_to_patch.items():
    if not os.path.exists(filepath):
        print(f"Skipping {filepath}, does not exist.")
        continue
        
    with open(filepath, 'r', encoding='utf-8') as f:
        data = json.load(f)
        
    for k, v in patches.items():
        if k in data:
            data[k] = v
            print(f"Updated {k} -> {v} in {filepath}")
            
    with open(filepath, 'w', encoding='utf-8') as f:
        json.dump(data, f, indent=2)

print("Patching complete.")
