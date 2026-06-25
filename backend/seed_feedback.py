import os
import django
from django.core.files import File

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'swayam_portfolio.settings')
django.setup()

from main.models import Avatar, Testimonial

def seed_feedback():
    # 1. Seed Avatars
    Avatar.objects.all().delete()
    avatar_list = [
        {"name": "Lightning", "icon": "⚡"},
        {"name": "Rocket", "icon": "🚀"},
        {"name": "Diamond", "icon": "💎"},
        {"name": "Palette", "icon": "🎨"},
        {"name": "Laptop", "icon": "💻"},
        {"name": "Brain", "icon": "🧠"},
        {"name": "Sparkles", "icon": "✨"},
        {"name": "Fire", "icon": "🔥"},
    ]
    avatars = []
    for a in avatar_list:
        avatars.append(Avatar.objects.create(**a))
    print(f"{len(avatars)} Avatars seeded.")

    # 2. Seed initial Testimonials (Live)
    Testimonial.objects.all().delete()
    testimonials_to_create = [
        {
            "name": "Maya Lin",
            "role": "Founder · Helix",
            "content": "Swayam thinks like a designer and ships like a senior engineer. Rare combination, real impact.",
            "avatar": avatars[3], # Palette
            "display": True,
        },
        {
            "name": "Aarav Mehta",
            "role": "CEO · Nebula AI",
            "content": "Our product moved from prototype to launch in six weeks. The interface alone closed our seed round.",
            "avatar": avatars[1], # Rocket
            "display": True,
        },
        {
            "name": "Jordan Reyes",
            "role": "Design Lead · Orbit",
            "content": "Best frontend work I've seen this year. Cinematic, fast, taste in every detail.",
            "avatar": avatars[2], # Diamond
            "display": True,
        },
    ]
    for t in testimonials_to_create:
        Testimonial.objects.create(**t)
    print("Initial live testimonials seeded.")

if __name__ == "__main__":
    seed_feedback()
