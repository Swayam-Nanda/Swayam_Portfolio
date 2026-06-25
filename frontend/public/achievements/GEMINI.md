# Project Workflow & Mandates

## UIL Data Management
The master UI configuration file `assets/data/uil.json` and its versioned counterpart (e.g., `assets/data/uil.1746999829739.json`) are monolithic and should **NEVER** be read in their entirety or edited directly.

### Source of Truth
The source of truth for UI configuration consists of the 10 split files in `assets/data/`:
- `uil_cameras.json`
- `uil_input_config.json`
- `uil_input_elements.json`
- `uil_input_other.json`
- `uil_particles.json`
- `uil_mesh.json`
- `uil_scenelayout.json`
- `uil_shaders.json`
- `uil_vfx_logic.json`
- `uil_misc.json`

### Modification Workflow
1. **Identify**: Determine which split file contains the data you need to modify.
2. **Edit**: Modify only the relevant split file(s).
3. **Synchronize**: Run the merge script to update the monolithic files:
   ```powershell
   python scripts/merge_uil.py
   ```
4. **Validation**: Ensure the merge script completes without errors.

## JavaScript Handling
The main application file `assets/js/app.1746999829739.js` is extremely large (~2.9 MB).
- **NEVER** attempt to read this file in its entirety.
- Use `grep_search` to find specific sections or `read_file` with `start_line` and `end_line` for targeted analysis.
- If significant refactoring is needed, consider proposing a split of this file, but do not perform such a split without user approval.
