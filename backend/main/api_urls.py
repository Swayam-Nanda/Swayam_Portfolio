from django.urls import path
from . import api_views

urlpatterns = [
    path('hero/', api_views.HeroDetailAPI.as_view(), name='api_hero'),
    path('hero/portraits/', api_views.HeroThemeImagesAPI.as_view(), name='api_hero_portraits'),
    path('about/', api_views.AboutDetailAPI.as_view(), name='api_about'),
    path('services/', api_views.ServiceListAPI.as_view(), name='api_services'),
    path('projects/', api_views.ProjectListAPI.as_view(), name='api_projects'),
    path('experience/', api_views.ExperienceListAPI.as_view(), name='api_experience'),
    path('avatars/', api_views.AvatarListAPI.as_view(), name='api_avatars'),
    path('testimonials/', api_views.TestimonialAPI.as_view(), name='api_testimonials'),
    path('bookings/', api_views.BookingCreateAPI.as_view(), name='api_bookings'),
    path('contact/', api_views.ContactCreateAPI.as_view(), name='api_contact'),
    path('theme/', api_views.ThemeAPI.as_view(), name='api_theme'),
]
