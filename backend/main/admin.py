from django.contrib import admin
from .models import Hero, HeroThemeImage, Contact, Project, About, Service, Booking, SiteTheme, Experience, Avatar, Testimonial

admin.site.register(Hero)
admin.site.register(About)
from django.utils.safestring import mark_safe

@admin.register(HeroThemeImage)
class HeroThemeImageAdmin(admin.ModelAdmin):
    list_display = ('theme', 'image_preview')
    list_display_links = ('theme',)

    def image_preview(self, obj):
        if obj.image:
            return mark_safe(f'<img src="{obj.image.url}" style="height:80px; border-radius:6px; object-fit:cover;" />')
        return '—'
    image_preview.short_description = 'Preview'

@admin.register(Project)
class ProjectAdmin(admin.ModelAdmin):
    list_display = ('title', 'tech_stack', 'created_at')
    search_fields = ('title', 'tech_stack', 'description')

    def get_form(self, request, obj=None, **kwargs):
        form = super().get_form(request, obj, **kwargs)
        about = About.objects.first()
        if about:
            tech_list = about.tech_stack.split(',')
            tech_badges = "".join([f'<span style="background:#e1f5fe; color:#01579b; padding:2px 8px; border-radius:10px; margin-right:5px; display:inline-block; margin-bottom:5px; font-size:11px;">{t.strip()}</span>' for t in tech_list])
            help_html = f'<div style="margin-top:10px; border-top:1px solid #eee; pt:10px;"><b>Master Tech Stack Reference:</b><br>{tech_badges}</div>'
            form.base_fields['tech_stack'].help_text = mark_safe(form.base_fields['tech_stack'].help_text + help_html)
        return form
admin.site.register(Contact)
admin.site.register(SiteTheme)
admin.site.register(Avatar)


@admin.register(Testimonial)
class TestimonialAdmin(admin.ModelAdmin):
    list_display = ('name', 'role', 'display', 'created_at')
    list_editable = ('display',)
    list_filter = ('display', 'created_at')
    search_fields = ('name', 'role', 'content')


@admin.register(Experience)
class ExperienceAdmin(admin.ModelAdmin):
    list_display = ('title', 'subtitle', 'start_date', 'card_type')
    list_filter = ('card_type', 'start_date')
    search_fields = ('title', 'subtitle', 'description')



@admin.register(Service)
class ServiceAdmin(admin.ModelAdmin):
    list_display=('title','icon')


@admin.register(Booking)
class BookingAdmin(admin.ModelAdmin):
    readonly_fields = ('created_at',)
    list_display = ('name', 'email', 'service','message', 'created_at')
    search_fields = ('name', 'email', 'service')
    list_filter = ('service', 'created_at')
    ordering = ('-created_at',)
# Register your models here.
# swayam_nanda
# nandaswayam
