from django.db import models

class SiteTheme(models.Model):
    name = models.CharField(max_length=100)
    bg_color = models.CharField(max_length=7)
    second_bg_color = models.CharField(max_length=7)
    text_color = models.CharField(max_length=7)
    main_color = models.CharField(max_length=7)

    def __str__(self):
        return self.name


class Hero(models.Model):
    eyebrow_text = models.CharField(max_length=100, default="MEET NANDA JI KA BETA")
    name = models.CharField(max_length=100, default="SWAYAM")
    tagline = models.TextField(help_text="Comma-separated job roles for typing effect", default="Full Stack Developer, AI Builder, Creative Engineer, CS Student, Problem Solver")
    github = models.URLField(blank=True, null=True)
    linkedin = models.URLField(blank=True, null=True)
    twitter = models.URLField(blank=True, null=True)
    leetcode = models.URLField(blank=True, null=True)
    image = models.ImageField(upload_to='hero/', help_text="Base portrait image")
    reveal_image = models.ImageField(upload_to='hero/', blank=True, null=True, help_text="Reveal portrait image (alt)")

    def __str__(self):
        return f"Hero Section - {self.name}"


class HeroThemeImage(models.Model):
    THEME_CHOICES = [
        ('blue', 'Blue'),
        ('gold', 'Gold'),
        ('white', 'White / Silver'),
        ('crimson', 'Crimson / Red'),
        ('emerald', 'Emerald / Green'),
        ('purple', 'Purple'),
    ]
    theme = models.CharField(max_length=20, choices=THEME_CHOICES, unique=True)
    image = models.ImageField(upload_to='hero/theme/', help_text="Portrait shown when this theme is active")

    def __str__(self):
        return f"Portrait for {self.get_theme_display()} theme"


class About(models.Model):
    heading = models.CharField(max_length=200, default="01 — Identity")
    bio_left = models.TextField(blank=True, null=True, help_text="Main bio text appearing on the left side of the laser")
    bio_right = models.TextField(blank=True, null=True, help_text="Short tagline or secondary bio on the right side of the laser")
    
    # Existing fields for backward compatibility during migration
    image1 = models.ImageField(upload_to='about/', blank=True, null=True)
    image2 = models.ImageField(upload_to='about/', blank=True, null=True)
    image3 = models.ImageField(upload_to='about/', blank=True, null=True)
    image4 = models.ImageField(upload_to='about/', blank=True, null=True)
    image5 = models.ImageField(upload_to='about/', blank=True, null=True)
    image6 = models.ImageField(upload_to='about/', blank=True, null=True)
    image7 = models.ImageField(upload_to='about/', blank=True, null=True)

    projects_built = models.IntegerField(default=0, help_text="This will be auto-calculated (Project count + bonus)")
    projects_bonus = models.IntegerField(default=40, help_text="Manual count of projects not listed in the Project section")
    certifications = models.CharField(max_length=10, default="12")
    technologies = models.IntegerField(default=0, help_text="This will be auto-calculated from tech_stack")
    hackathon_wins = models.CharField(max_length=10, default="6")
    years_building = models.IntegerField(default=0, help_text="This will be auto-calculated (Current Year - 2023)")
    curiosity = models.CharField(max_length=10, default="100%")

    tech_stack = models.TextField(help_text="Comma-separated tech names for marquees", default="React, TypeScript, Tailwind CSS, HTML, CSS, JavaScript, Vite, Vercel, GitHub, Supabase, PostgreSQL, Firebase, Flask, Django, Python, REST, Render, Ollama, IoT")

    def __str__(self):
        return self.heading

    def get_images(self):
        """Returns a list of all images related to this About section."""
        # Mix legacy fields and new related objects
        images = []
        for i in range(1, 8):
            img = getattr(self, f'image{i}')
            if img:
                images.append(img.url)
        
        # Add images from the new related model
        for extra in self.images.all():
            images.append(extra.image.url)
        
        return images


class AboutImage(models.Model):
    about = models.ForeignKey(About, related_name='images', on_delete=models.CASCADE)
    image = models.ImageField(upload_to='about/')
    caption = models.CharField(max_length=100, blank=True, null=True)
    order = models.IntegerField(default=0)

    class Meta:
        ordering = ['order']

    def __str__(self):
        return f"Image for {self.about.heading}"


class Service(models.Model):
    title = models.CharField(max_length=100)
    description = models.TextField()
    icon = models.CharField(max_length=100, help_text="Lucide icon name (e.g., Code2, Sparkles)")
    span = models.CharField(max_length=100, blank=True, null=True, help_text="Tailwind span classes (e.g., md:col-span-2 md:row-span-2)")
    created_at = models.DateTimeField(auto_now_add=True, blank=True, null=True)

    def __str__(self):
        return self.title


class Booking(models.Model):
    name = models.CharField(max_length=100)
    email = models.EmailField()
    service = models.CharField(max_length=100)
    timeline = models.CharField(max_length=100, blank=True, null=True)
    budget = models.CharField(max_length=100, blank=True, null=True)
    message = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.name} - {self.service}"


class Project(models.Model):
    CARD_TYPES = [
        ('small', 'Small Card'),
        ('medium', 'Medium Card'),
        ('big', 'Big Card'),
    ]
    title = models.CharField(max_length=200)
    description = models.TextField(help_text="Short project summary")
    tech_stack = models.CharField(max_length=300, help_text="Comma-separated technologies", default="React, Node.js")
    image = models.ImageField(upload_to='projects/thumbnails/', help_text="Project thumbnail image")
    github_link = models.URLField(blank=True, null=True, help_text="GitHub repository URL")
    live_link = models.URLField(blank=True, null=True, help_text="Live site URL")
    card_type = models.CharField(max_length=10, choices=CARD_TYPES, default='medium')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title


class Contact(models.Model):
    name = models.CharField(max_length=100)
    email = models.EmailField()
    mobile = models.CharField(max_length=15, blank=True)
    subject = models.CharField(max_length=200, blank=True)
    message = models.TextField()
    submitted_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.name} - {self.email}"


class Experience(models.Model):
    CARD_TYPES = [
        ('small', 'Small Card'),
        ('medium', 'Medium Card'),
        ('big', 'Big Card'),
    ]
    title = models.CharField(max_length=200)
    subtitle = models.CharField(max_length=200, help_text="e.g., University, Company, Location")
    start_date = models.DateField(help_text="Starting date (Month/Year)")
    end_date = models.DateField(blank=True, null=True, help_text="End date (Leave blank for single date event)")
    description = models.TextField()
    card_type = models.CharField(max_length=10, choices=CARD_TYPES, default='small')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.title} at {self.subtitle}"


class Avatar(models.Model):
    name = models.CharField(max_length=50)
    icon = models.CharField(max_length=10, help_text="Emoji or short icon string", blank=True, null=True)
    image = models.ImageField(upload_to='avatars/', blank=True, null=True)

    def __str__(self):
        return f"{self.name} ({self.icon if self.icon else 'Image'})"


class Testimonial(models.Model):
    name = models.CharField(max_length=100)
    role = models.CharField(max_length=100)
    content = models.TextField()
    avatar = models.ForeignKey(Avatar, on_delete=models.SET_NULL, null=True, blank=True)
    display = models.BooleanField(default=False, help_text="Show on main page?")
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Feedback from {self.name} ({'Live' if self.display else 'Hidden'})"
