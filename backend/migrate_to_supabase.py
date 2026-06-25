import os
import django
from django.conf import settings
from django.core.files.storage import default_storage
from django.core.files import File

# Set up Django environment
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'swayam_portfolio.settings')
django.setup()

def migrate_media():
    media_root = settings.MEDIA_ROOT
    print(f"Starting migration from {media_root} to {settings.STORAGES['default']['BACKEND']}...")

    for root, dirs, files in os.walk(media_root):
        for file in files:
            local_path = os.path.join(root, file)
            # Create the relative path for the storage (e.g., 'hero/portrait.png')
            relative_path = os.path.relpath(local_path, media_root).replace('\\', '/')
            
            if default_storage.exists(relative_path):
                print(f"Skipping {relative_path} (already exists in storage)")
                continue

            print(f"Uploading {relative_path}...")
            try:
                with open(local_path, 'rb') as f:
                    default_storage.save(relative_path, File(f))
                print(f"Successfully uploaded {relative_path}")
            except Exception as e:
                print(f"Failed to upload {relative_path}: {e}")

    print("Migration complete!")

if __name__ == "__main__":
    migrate_media()
