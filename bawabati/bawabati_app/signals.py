from django.db.models.signals import post_save
from django.contrib.auth.models import User
from django.dispatch import receiver
from django.db import transaction
from .models import UserProfile

@receiver(post_save, sender=User)
def create_user_profile(sender, instance, created, **kwargs):
    """Create a UserProfile when a new User is created."""
    if created:
        with transaction.atomic():
            UserProfile.objects.get_or_create(
                user=instance,
                defaults={'role': 'student'}  # Default role for new users
            )

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