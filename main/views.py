
from django.shortcuts import render, redirect
from litellm import email
from .models import Contact , Project, Service , Hero
from django.shortcuts import redirect
from django.contrib import messages
from .models import About
from .models import Booking
from django.core.mail import send_mail
from django.conf import settings
from django.core.mail import EmailMultiAlternatives
from django.template.loader import render_to_string
import random
from .models import SiteTheme
from django.http import JsonResponse


print("View is working") 


def change_theme(request):
    themes = SiteTheme.objects.all()
    if themes.exists():
        # Get a different theme from the current one
        current_id = request.session.get('theme_id')
        other_themes = themes.exclude(id=current_id)
        if other_themes.exists():
            new_theme = random.choice(list(other_themes))
        else:
            new_theme = themes.first()  
        request.session['theme_id'] = new_theme.id

    if request.headers.get('x-requested-with') == 'XMLHttpRequest':
        return JsonResponse({
            'status': 'success',
            'theme': {
                'bg_color': new_theme.bg_color,
                'second_bg_color': new_theme.second_bg_color,
                'text_color': new_theme.text_color,
                'main_color': new_theme.main_color,
            }
    })

    return redirect(request.META.get('HTTP_REFERER', '/'))

def get_current_theme(request):
    if 'theme_id' not in request.session:
        theme = random.choice(SiteTheme.objects.all())
        request.session['theme_id'] = theme.id
    else:
        theme = SiteTheme.objects.get(id=request.session['theme_id'])
    return theme

def get_theme_json(request):
    theme = get_current_theme(request)
    return JsonResponse({
        'bg_color': theme.bg_color,
        'second_bg_color': theme.second_bg_color,
        'text_color': theme.text_color,
        'main_color': theme.main_color,
    })


def home(request):
    about = About.objects.first()
    services = Service.objects.all().order_by('-created_at')
    projects = Project.objects.all().order_by('-created_at')
    hero = Hero.objects.first()
    roles = [role.strip() for role in hero.tagline.split(',')]
    theme = get_current_theme(request)

    success = False

    if request.method == 'POST':
        name = request.POST.get('name')
        email = request.POST.get('email')
        mobile = request.POST.get('mobile')
        subject = request.POST.get('subject')
        message = request.POST.get('message')

        Contact.objects.create(
            name=name,
            email=email,
            mobile=mobile,
            subject=subject,
            message=message
        )
        user_email = email  # ✅ store the user's email

        admin_subject = f'New Contact from {name}'
        from_email = 'swayam.portfolio@gmail.com'
        to_email = ['swayam.portfolio@gmail.com']

        html_content = render_to_string('email_templates/contact_email.html', {
            'name': name,
            'email': user_email,
            'mobile': mobile,
            'subject': subject,
            'message': message
        })

        email = EmailMultiAlternatives(admin_subject, message, from_email, to_email)
        email.attach_alternative(html_content, "text/html")
        email.send()

        # Send confirmation email to the user
        confirmation_subject = "Thanks for contacting me!"
        confirmation_html = render_to_string('email_templates/contact_confirmation.html', {
        'name': name,
        'subject': subject
        })

        confirmation_email = EmailMultiAlternatives(
        confirmation_subject,
        "Thanks for contacting me! I'll get back to you soon.",
        from_email,
        [user_email]
        )
        confirmation_email.attach_alternative(confirmation_html, "text/html")
        confirmation_email.send()



        messages.success(request, 'Thanks for contacting me! 🚀')
        return redirect('/#contact')

    context = {
    'theme': theme,
    'hero': hero,
    'roles': roles,
    'about': about,
    'success': success,
    'projects': projects,
    'services':services
}
    return render(request, 'index.html', context)

def about(request):
    about = About.objects.first()
    theme = get_current_theme(request)
    return render(request, 'about.html', {'about': about, 'theme': theme})

def services(request):
    services=Service.objects.all()
    return render(request,'services.html',{'services':services, })

def book_service(request):

    selected_service=request.GET.get('service','')
    services = Service.objects.all()
    theme = get_current_theme(request)

    if request.method == 'POST':
        name=request.POST.get('name')
        email=request.POST.get('email')
        service=request.POST.get('service')
        message=request.POST.get('message')

        Booking.objects.create(
            name=name,
            email=email,
            service=service,
            message=message
        )

                # Admin notification email
        from_email = 'swayam.portfolio@gmail.com'
        to_email = ['swayam.portfolio@gmail.com']
        admin_subject = f'New Booking: {service} from {name}'

        html_admin = render_to_string('email_templates/booking_email.html', {
            'name': name,
            'email': email,
            'service': service,
            'message': message
        })

        admin_email = EmailMultiAlternatives(admin_subject, message, from_email, to_email)
        admin_email.attach_alternative(html_admin, "text/html")
        admin_email.send()

        # User confirmation email
        confirmation_subject = f'Booking Confirmed: {service}'
        html_user = render_to_string('email_templates/booking_confirmation.html', {
            'name': name,
            'service': service
        })

        user_email = EmailMultiAlternatives(
            confirmation_subject,
            f'Thank you {name} for booking {service}. I will contact you soon.',
            from_email,
            [email]
        )
        user_email.attach_alternative(html_user, "text/html")
        user_email.send()


        messages.success(request,"Thanks for booking! I'll get back to you soon.")
        return redirect('/book_service')

    return render(request, 'book_service.html',{'selected_service': selected_service,'services': services, 'theme': theme})