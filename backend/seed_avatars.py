import os
import django
from django.conf import settings
from django.core.files import File

# Set up Django environment
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'swayam_portfolio.settings')
django.setup()

from main.models import Avatar

def seed_avatars():
    avatar_dir = os.path.join(settings.BASE_DIR, '..', 'avatars')
    if not os.path.exists(avatar_dir):
        print(f"Avatar directory {avatar_dir} does not exist.")
        return

    print(f"Seeding avatars from {avatar_dir}...")
    
    # Optional: clear existing image-based avatars if needed, 
    # but better to just skip if already exists
    
    for filename in os.listdir(avatar_dir):
        if filename.endswith('.png') or filename.endswith('.jpg'):
            avatar_name = filename.split('.')[0]
            
            # Check if avatar already exists
            if Avatar.objects.filter(name=avatar_name).exists():
                print(f"Avatar {avatar_name} already exists. Skipping.")
                continue

            filepath = os.path.join(avatar_dir, filename)
            print(f"Uploading {filename}...")
            
            try:
                with open(filepath, 'rb') as f:
                    avatar = Avatar(name=avatar_name)
                    avatar.image.save(filename, File(f), save=True)
                print(f"Successfully created avatar: {avatar_name}")
            except Exception as e:
                print(f"Failed to upload {filename}: {e}")

    print("Avatar seeding complete!")

if __name__ == "__main__":
    seed_avatars()
