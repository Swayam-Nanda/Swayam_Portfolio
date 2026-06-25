from rest_framework import serializers
from .models import Hero, HeroThemeImage, About, AboutImage, Service, Project, SiteTheme, Experience, Avatar, Testimonial, Booking, Contact

class HeroSerializer(serializers.ModelSerializer):
    class Meta:
        model = Hero
        fields = [
            'id', 'eyebrow_text', 'name', 'tagline', 
            'github', 'linkedin', 'twitter', 'leetcode', 
            'image', 'reveal_image'
        ]

class HeroThemeImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = HeroThemeImage
        fields = ['theme', 'image']

from datetime import date
from .models import Hero, About, AboutImage, Service, Project, SiteTheme, Experience, Avatar, Testimonial, Booking, Contact

class AboutImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = AboutImage
        fields = ['image', 'caption', 'order']

class AboutSerializer(serializers.ModelSerializer):
    projects_built = serializers.SerializerMethodField()
    technologies = serializers.SerializerMethodField()
    years_building = serializers.SerializerMethodField()
    extra_images = AboutImageSerializer(source='images', many=True, read_only=True)

    class Meta:
        model = About
        fields = [
            'id', 'heading', 'bio_left', 'bio_right',
            'image1', 'image2', 'image3', 'image4', 'image5', 'image6', 'image7',
            'extra_images',
            'projects_built', 'projects_bonus', 'certifications', 'technologies', 
            'hackathon_wins', 'years_building', 'curiosity', 'tech_stack'
        ]

    def get_projects_built(self, obj):
        # Cache count on the request context if multiple instances exist (rare for About)
        # For a single About object, we can just do it.
        # To be truly efficient, we'd use a property that caches or a dedicated stat model.
        if not hasattr(self, '_db_project_count'):
            self._db_project_count = Project.objects.count()
        return self._db_project_count + obj.projects_bonus

    def get_technologies(self, obj):
        # Count items in tech_stack comma-separated list
        if not obj.tech_stack:
            return 0
        return len([t.strip() for t in obj.tech_stack.split(',') if t.strip()])

    def get_years_building(self, obj):
        # Current year - 2023
        current_year = date.today().year
        return max(0, current_year - 2023)

class ServiceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Service
        fields = '__all__'

class ProjectSerializer(serializers.ModelSerializer):
    class Meta:
        model = Project
        fields = '__all__'

class ExperienceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Experience
        fields = '__all__'

class AvatarSerializer(serializers.ModelSerializer):
    class Meta:
        model = Avatar
        fields = '__all__'

class TestimonialSerializer(serializers.ModelSerializer):
    avatar_details = AvatarSerializer(source='avatar', read_only=True)
    
    class Meta:
        model = Testimonial
        fields = ['id', 'name', 'role', 'content', 'avatar', 'avatar_details', 'display', 'created_at']
        read_only_fields = ['display']

class SiteThemeSerializer(serializers.ModelSerializer):
    class Meta:
        model = SiteTheme
        fields = '__all__'

class BookingSerializer(serializers.ModelSerializer):
    class Meta:
        model = Booking
        fields = '__all__'

class ContactSerializer(serializers.ModelSerializer):
    class Meta:
        model = Contact
        fields = '__all__'
