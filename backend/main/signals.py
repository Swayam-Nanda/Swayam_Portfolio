from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import Project, About

@receiver(post_save, sender=Project)
def sync_tech_stack(sender, instance, **kwargs):
    if not instance.tech_stack:
        return

    # Get about entry (assume only one exists)
    about = About.objects.first()
    if not about:
        return

    # Extract techs from current project
    project_techs = [t.strip() for t in instance.tech_stack.split(',') if t.strip()]
    
    # Extract techs from About table
    current_techs = [t.strip() for t in about.tech_stack.split(',') if t.strip()]
    
    # Merge and maintain order, avoiding duplicates (case-insensitive check)
    new_techs_added = False
    current_techs_lower = [t.lower() for t in current_techs]
    
    for tech in project_techs:
        if tech.lower() not in current_techs_lower:
            current_techs.append(tech)
            current_techs_lower.append(tech.lower())
            new_techs_added = True
    
    if new_techs_added:
        about.tech_stack = ", ".join(current_techs)
        about.save()
