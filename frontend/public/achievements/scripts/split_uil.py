import json
import os

def split_uil():
    with open('assets/data/uil.json', 'r') as f:
        data = json.load(f)
    
    # Analyze keys to group them
    keys = sorted(data.keys())
    
    groups = {
        'cameras': [],
        'input_config': [],
        'input_elements': [],
        'input_other': [],
        'particles': [],
        'mesh': [],
        'scenelayout': [],
        'shaders': [],
        'vfx_logic': [],
        'misc': []
    }
    
    shader_prefixes = ['ATPBR', 'ChainShader', 'SpineShader', 'TreeFBR', 'FloorShader', 'JellyShader', 'WallShader', 'RoomPBR', 'WaterCeilingShader', 'LabLogoShader', 'BioLightsShader', 'HomeAlleyShader', 'HomeColumnShader', 'HomeFloorShader', 'HomeLogoShader', 'HomeParticleShader', 'HomeVideoShader', 'ParticleTestShader', 'PhysicalShader', 'ProtonTube', 'WorkDetailCube', 'WorkDetailParticleShader', 'WorkGlass', 'WorkItemShader', 'WorkItemUIShader', 'WorkPageBG', 'WorkPageParticleShader', 'WorkProjectPlane', 'WorkSceneBackground', 'WaterParticles', 'TentacleShader', 'TreeWaterShader', 'AboutLogoShader', 'BigScreenVideoShader', 'BulbShader', 'GlassCubeShader', 'GlassShaderPBR', 'GlassWallShader', 'HomeScreenLight', 'StageScreenShader', 'TestVideoShader']

    for k in keys:
        if k.startswith('CAMERA_'):
            groups['cameras'].append(k)
        elif k.startswith('INPUT_Config_'):
            groups['input_config'].append(k)
        elif k.startswith('INPUT_Element_'):
            groups['input_elements'].append(k)
        elif k.startswith('INPUT_'):
            if k.startswith('INPUT_P_') or 'Element_0_ParticleTest' in k or 'P_Element_' in k:
                groups['particles'].append(k)
            else:
                groups['input_other'].append(k)
        elif k.startswith('P_Element_') or k.startswith('LIST_P_') or k.startswith('UIL_P_'):
            groups['particles'].append(k)
        elif k.startswith('MESH_'):
            groups['mesh'].append(k)
        elif k.startswith('SceneLayout/'):
            groups['scenelayout'].append(k)
        elif any(k.startswith(p + '/') for p in shader_prefixes) or any(k.startswith(p + '_') for p in shader_prefixes):
            groups['shaders'].append(k)
        elif k.startswith('UnrealBloom') or k.startswith('VolumetricLight') or k.startswith('am_') or k.startswith('homeParticle') or k.startswith('groupBridge') or k.startswith('group_'):
            groups['vfx_logic'].append(k)
        else:
            groups['misc'].append(k)

    # Create separate files
    for name, key_list in groups.items():
        if key_list:
            subset = {k: data[k] for k in key_list}
            with open(f'assets/data/uil_{name}.json', 'w') as f:
                json.dump(subset, f, indent=2)
            print(f"Created assets/data/uil_{name}.json with {len(key_list)} keys")

if __name__ == "__main__":
    split_uil()
