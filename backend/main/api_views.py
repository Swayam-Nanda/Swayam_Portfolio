from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.throttling import UserRateThrottle, AnonRateThrottle
from .models import Hero, HeroThemeImage, About, AboutImage, Service, Project, SiteTheme, Experience, Avatar, Testimonial, Booking, Contact
from .serializers import (
    HeroSerializer, HeroThemeImageSerializer, AboutSerializer, ServiceSerializer, 
    ProjectSerializer, SiteThemeSerializer, ExperienceSerializer,
    AvatarSerializer, TestimonialSerializer, BookingSerializer, ContactSerializer
)
from django.core.mail import send_mail
from django.template.loader import render_to_string
from django.conf import settings
from django.utils import timezone

class GlobalRateThrottle(AnonRateThrottle):
    def get_cache_key(self, request, view):
        return f"global_{self.scope}"

class ContactUserThrottle(AnonRateThrottle):
    scope = 'contact_user'

class ContactGlobalThrottle(GlobalRateThrottle):
    scope = 'contact_global'

class TestimonialUserThrottle(AnonRateThrottle):
    scope = 'testimonial_user'

class TestimonialGlobalThrottle(GlobalRateThrottle):
    scope = 'testimonial_global'

class HeroDetailAPI(APIView):
    def get(self, request):
        hero = Hero.objects.last()
        if not hero:
            return Response({})
        serializer = HeroSerializer(hero)
        return Response(serializer.data)

class HeroThemeImagesAPI(APIView):
    """Returns a dict of theme -> image URL for the hero section portraits."""
    def get(self, request):
        images = HeroThemeImage.objects.all()
        serializer = HeroThemeImageSerializer(images, many=True, context={'request': request})
        # Return as { theme: imageUrl } dict for easy lookup on frontend
        result = {item['theme']: item['image'] for item in serializer.data}
        return Response(result)

class AboutDetailAPI(APIView):
    def get(self, request):
        about = About.objects.last()
        if not about:
            return Response({})
        serializer = AboutSerializer(about)
        return Response(serializer.data)

class ServiceListAPI(APIView):
    def get(self, request):
        services = Service.objects.all().order_by('created_at')
        serializer = ServiceSerializer(services, many=True)
        return Response(serializer.data)

class ProjectListAPI(APIView):
    def get(self, request):
        projects = Project.objects.all().order_by('-created_at')
        serializer = ProjectSerializer(projects, many=True)
        return Response(serializer.data)

class ExperienceListAPI(APIView):
    def get(self, request):
        experiences = Experience.objects.all().order_by('start_date')
        serializer = ExperienceSerializer(experiences, many=True)
        return Response(serializer.data)

class AvatarListAPI(APIView):
    def get(self, request):
        avatars = Avatar.objects.all()
        serializer = AvatarSerializer(avatars, many=True)
        return Response(serializer.data)

class TestimonialAPI(APIView):
    def get_throttles(self):
        if self.request.method == 'POST':
            return [TestimonialUserThrottle(), TestimonialGlobalThrottle()]
        return []

    def get(self, request):
        # Only show verified testimonials
        testimonials = Testimonial.objects.filter(display=True).order_by('-created_at')
        serializer = TestimonialSerializer(testimonials, many=True)
        return Response(serializer.data)

    def post(self, request):
        # Create new testimonial (display defaults to False)
        serializer = TestimonialSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class ThemeAPI(APIView):
    def get(self, request):
        theme = SiteTheme.objects.first()
        if not theme:
            return Response({})
        serializer = SiteThemeSerializer(theme)
        return Response(serializer.data)

class BookingCreateAPI(APIView):
    def get_throttles(self):
        return [ContactUserThrottle(), ContactGlobalThrottle()]

    def post(self, request):
        serializer = BookingSerializer(data=request.data)
        if serializer.is_valid():
            booking = serializer.save()
            
            # Send email to admin
            admin_subject = f"New Booking: {booking.service} from {booking.name}"
            admin_message = render_to_string('email_templates/booking_email.html', {
                'name': booking.name,
                'email': booking.email,
                'service': booking.service,
                'timeline': booking.timeline,
                'budget': booking.budget,
                'message': booking.message,
            })
            
            # Send confirmation to user
            user_subject = "Booking Received - Swayam Nanda"
            user_message = render_to_string('email_templates/booking_confirmation.html', {
                'name': booking.name,
                'service': booking.service,
                'now': timezone.now(),
            })
            
            try:
                # Email to admin
                send_mail(
                    admin_subject,
                    '',
                    settings.DEFAULT_FROM_EMAIL,
                    [settings.DEFAULT_FROM_EMAIL],
                    html_message=admin_message,
                    fail_silently=False,
                )
                
                # Email to user
                send_mail(
                    user_subject,
                    '',
                    settings.DEFAULT_FROM_EMAIL,
                    [booking.email],
                    html_message=user_message,
                    fail_silently=False,
                )
            except Exception as e:
                print(f"Error sending email: {e}")
                return Response({"error": "Message recorded but email notification failed."}, status=status.HTTP_201_CREATED)

            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class ContactCreateAPI(APIView):
    def get_throttles(self):
        return [ContactUserThrottle(), ContactGlobalThrottle()]

    def post(self, request):
        serializer = ContactSerializer(data=request.data)
        if serializer.is_valid():
            contact = serializer.save()
            
            # Send email to admin
            admin_subject = f"New Contact Message: {contact.subject}"
            admin_message = render_to_string('email_templates/contact_email.html', {
                'name': contact.name,
                'email': contact.email,
                'mobile': contact.mobile,
                'subject': contact.subject,
                'message': contact.message,
            })
            
            # Send confirmation to user
            user_subject = "Message Received - Swayam Nanda"
            user_message = render_to_string('email_templates/contact_confirmation.html', {
                'name': contact.name,
                'now': timezone.now(),
            })
            
            try:
                # Email to admin
                send_mail(
                    admin_subject,
                    '',
                    settings.DEFAULT_FROM_EMAIL,
                    [settings.DEFAULT_FROM_EMAIL],
                    html_message=admin_message,
                    fail_silently=False,
                )
                
                # Email to user
                send_mail(
                    user_subject,
                    '',
                    settings.DEFAULT_FROM_EMAIL,
                    [contact.email],
                    html_message=user_message,
                    fail_silently=False,
                )
            except Exception as e:
                print(f"Error sending email: {e}")
                return Response({"error": "Message recorded but email notification failed."}, status=status.HTTP_201_CREATED)

            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
