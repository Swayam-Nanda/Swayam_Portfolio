import os
import django
from django.db import connection

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'swayam_portfolio.settings')
django.setup()

def reset_main():
    with connection.cursor() as cursor:
        tables = [
            'main_about', 'main_booking', 'main_contact', 
            'main_hero', 'main_project', 'main_service', 
            'main_sitetheme'
        ]
        for table in tables:
            print(f"Dropping {table}...")
            cursor.execute(f"DROP TABLE IF EXISTS {table} CASCADE")
        
        print("Clearing migration history for 'main'...")
        cursor.execute("DELETE FROM django_migrations WHERE app = 'main'")

if __name__ == "__main__":
    reset_main()
