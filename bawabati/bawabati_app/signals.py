from django.db.models.signals import post_save
from django.contrib.auth.models import User
from django.dispatch import receiver
from django.db import transaction
from .models import UserProfile

@receiver(post_save, sender=User)
def create_or_update_user_profile(sender, instance, created, **kwargs):
    if created:
        # Create a profile with the correct role
        if instance.is_superuser:
            UserProfile.objects.create(user=instance, role='admin')
        else:
            UserProfile.objects.create(user=instance, role='student')
    else:
        # If profile exists, update the role based on superuser status
        if instance.is_superuser:
            instance.userprofile.role = 'admin'
        instance.userprofile.save()

@receiver(post_save, sender=User)
def save_user_profile(sender, instance, **kwargs):
    """Save the UserProfile when the User is saved."""
    with transaction.atomic():
        profile, created = UserProfile.objects.get_or_create(
            user=instance,
            defaults={'role': 'student'}
        )
        if not created:
            profile.save() 