import os
import sys

def convert_glb_to_at_bin(glb_path, output_path='assets/geometry/logo/AT_logo.bin'):
    if not os.path.exists(glb_path):
        print(f"Error: Could not find '{glb_path}'")
        sys.exit(1)

    with open(glb_path, 'rb') as f:
        # GLB header is 12 bytes
        header = f.read(12)
        if header[:4] != b'glTF':
            print("Error: Input file is not a valid GLB. Did you export as .glb?")
            sys.exit(1)
            
        # JSON chunk header
        json_len = int.from_bytes(f.read(4), 'little')
        chunk_type = f.read(4)
        if chunk_type != b'JSON':
            print("Error: First chunk is not JSON.")
            sys.exit(1)
            
        # Skip JSON content (aligning to 4-byte boundary)
        aligned_json_len = (json_len + 3) & ~3
        f.seek(20 + aligned_json_len)
        
        # BIN chunk header
        bin_chunk_header = f.read(8)
        if len(bin_chunk_header) < 8:
            print("Error: Could not find the binary (BIN) chunk in GLB. Did you use Draco compression?")
            sys.exit(1)
            
        bin_len = int.from_bytes(bin_chunk_header[:4], 'little')
        draco_data = f.read(bin_len)

    # Prepare the custom engine .bin content
    json_metadata = '{"name":"AT_logo","type":0,"attributes":[["position",7],["normal",7],["uv",7]]}'
    json_len_bytes = str(len(json_metadata)).encode('ascii')

    # The header is 10 bytes total: ASCII length followed by nulls
    custom_header = json_len_bytes + (b'\x00' * (10 - len(json_len_bytes)))

    # Ensure output directory exists
    os.makedirs(os.path.dirname(output_path), exist_ok=True)

    with open(output_path, 'wb') as f:
        f.write(custom_header)
        f.write(json_metadata.encode('ascii'))
        f.write(draco_data)

    print(f"Success! Converted '{glb_path}' into the custom engine format at '{output_path}'")

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python convert_logo.py <your_file.glb>")
        sys.exit(1)
    
    input_file = sys.argv[1]
    convert_glb_to_at_bin(input_file)
