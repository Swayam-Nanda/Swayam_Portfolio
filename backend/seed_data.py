import os
import django
from django.core.files import File
from datetime import date

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'swayam_portfolio.settings')
django.setup()

from main.models import Hero, About, SiteTheme, Service, Project, Experience

def seed_data():
    # 1. Seed Site Theme
    SiteTheme.objects.get_or_create(
        name="Default",
        bg_color="#0f172a",
        second_bg_color="#1e293b",
        text_color="#f1f5f9",
        main_color="#38bdf8"
    )

    # 2. Seed Hero
    hero, created = Hero.objects.get_or_create(id=1)
    hero.eyebrow_text = "MEET NANDA JI KA BETA"
    hero.name = "SWAYAM"
    hero.tagline = "Full Stack Developer, AI Builder, Creative Engineer, CS Student, Problem Solver"
    hero.github = "https://github.com/swayam-nanda"
    hero.linkedin = "http://www.linkedin.com/in/swayam-nanda"
    hero.twitter = "https://x.com/SWAYAM_NANDA_"
    hero.leetcode = "https://leetcode.com/swayam_nanda"
    
    static_images_path = os.path.join('main', 'static', 'images')
    me_image_path = os.path.join(static_images_path, 'me1.png')
    if os.path.exists(me_image_path):
        with open(me_image_path, 'rb') as f:
            hero.image.save('me1.png', File(f), save=False)
            hero.reveal_image.save('me1.png', File(f), save=False)
    
    hero.save()
    print("Hero seeded.")

    # 3. Seed About
    about, created = About.objects.get_or_create(id=1)
    about.heading = "01 — Identity"
    about.projects_built = "40+"
    about.certifications = "12"
    about.technologies = "25+"
    about.hackathon_wins = "6"
    about.years_building = "4y"
    about.curiosity = "100%"
    about.tech_stack = "React, TypeScript, Tailwind CSS, HTML, CSS, JavaScript, Vite, Vercel, GitHub, Supabase, PostgreSQL, Firebase, Flask, Django, Python, REST, Render, Ollama, IoT"
    
    for i in range(1, 7):
        img_path = os.path.join(static_images_path, f'{i}.jpg')
        if os.path.exists(img_path):
            with open(img_path, 'rb') as f:
                field_name = f'image{i}'
                getattr(about, field_name).save(f'{i}.jpg', File(f), save=False)
    
    about.save()
    print("About seeded.")

    # 4. Seed Services
    Service.objects.all().delete()
    services_to_create = [
        {"title": "Full Stack Dev (Frontend)", "description": "Crafting premium user interfaces with React and TanStack.", "icon": "Code2", "span": "md:col-span-2 md:row-span-1"},
        {"title": "Full Stack Dev (Backend)", "description": "Building resilient APIs and data layers with Django and Supabase.", "icon": "Server", "span": "md:col-span-2 md:row-span-1"},
        {"title": "AI Integrations", "description": "LLMs, RAG, agents — embedded into real products.", "icon": "Sparkles", "span": ""},
        {"title": "UI/UX Engineering", "description": "Design-led interfaces, polished to the frame.", "icon": "Layout", "span": ""},
        {"title": "Backend Systems", "description": "Resilient APIs, queues, and data layers.", "icon": "Database", "span": ""},
        {"title": "API Development", "description": "Clean contracts, typed, documented, fast.", "icon": "Plug", "span": ""},
    ]
    for s in services_to_create:
        Service.objects.create(**s)
    print("Services seeded.")

    # 5. Seed Projects
    Project.objects.all().delete()
    projects_to_create = [
        {
            "title": "Quantum SaaS Dashboard",
            "description": "Enterprise-grade metrics with real-time AI insights.",
            "tech_stack": "Next.js, Tailwind, Prisma",
            "github_link": "https://github.com/swayam-nanda",
            "live_link": "https://swayam-portfolio.onrender.com",
        },
        {
            "title": "Lumina Identity",
            "description": "Animated biometric-inspired portfolio system.",
            "tech_stack": "React, Three.js, Framer Motion",
            "github_link": "https://github.com/swayam-nanda",
            "live_link": "https://swayam-portfolio.onrender.com",
        },
    ]
    for p in projects_to_create:
        Project.objects.create(**p)
    print("Projects seeded.")

    # 6. Seed Experiences
    Experience.objects.all().delete()
    experiences_to_create = [
        {
            "title": "Open Source Contributor",
            "subtitle": "Various",
            "start_date": date(2023, 1, 1),
            "description": "Performance and DX patches across frontend tooling.",
            "card_type": "small",
        },
        {
            "title": "B.Tech Computer Science",
            "subtitle": "University",
            "start_date": date(2024, 1, 1),
            "description": "Focus on systems, distributed computing, applied ML.",
            "card_type": "big",
        },
        {
            "title": "AI Hackathon — 1st Place",
            "subtitle": "National",
            "start_date": date(2024, 6, 1),
            "description": "Built a voice-driven multi-agent ops assistant in 36 hours.",
            "card_type": "big",
        },
        {
            "title": "SWE Intern",
            "subtitle": "Fintech Lab",
            "start_date": date(2025, 1, 1),
            "description": "Realtime trading dashboards and a low-latency analytics pipeline.",
            "card_type": "small",
        },
        {
            "title": "Independent Engineering",
            "subtitle": "Selected Clients",
            "start_date": date(2026, 1, 1),
            "end_date": date(2026, 6, 1),
            "description": "Designing & shipping production interfaces for AI-native startups.",
            "card_type": "big",
        },
    ]
    for e in experiences_to_create:
        Experience.objects.create(**e)
    print("Experiences seeded.")

if __name__ == "__main__":
    seed_data()
