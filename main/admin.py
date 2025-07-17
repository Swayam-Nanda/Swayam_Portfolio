from django.contrib import admin
from .models import Hero,Contact, Project, About , Service, Booking, SiteTheme

admin.site.register(Hero)
admin.site.register(About)
admin.site.register(Project)
admin.site.register(Contact)
admin.site.register(SiteTheme)



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
