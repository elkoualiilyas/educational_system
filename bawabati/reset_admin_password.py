import os
import django

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'bawabati.settings')
django.setup()

from django.contrib.auth.models import User
from django.contrib.auth.hashers import make_password

def reset_admin_password():
    print("Resetting admin account passwords...")
    
    # Find the admin user by username
    try:
        admin_user = User.objects.get(username='badr1')
        
        # Check current status
        print(f"Found user: {admin_user.username}")
        print(f"Current is_active status: {admin_user.is_active}")
        print(f"Current is_staff status: {admin_user.is_staff}")
        print(f"Current is_superuser status: {admin_user.is_superuser}")
        
        # Reset password and ensure account is active
        admin_user.password = make_password('2435Oujda')
        admin_user.is_active = True
        admin_user.is_staff = True
        admin_user.is_superuser = True
        
        # Save using direct update to bypass validation
        User.objects.filter(pk=admin_user.pk).update(
            password=admin_user.password,
            is_active=True,
            is_staff=True, 
            is_superuser=True
        )
        
        print(f"Successfully reset password for {admin_user.username}")
        print("User is now active and has admin privileges")
        print("Username: badr1")
        print("Password: 2435Oujda")
        
    except User.DoesNotExist:
        print("Admin user 'badr1' not found")
        
        # Create admin user if it doesn't exist
        User.objects.create_superuser(
            username='badr1',
            email='badr1@example.com',
            password='2435Oujda'
        )
        print("Created new admin user:")
        print("Username: badr1")
        print("Password: 2435Oujda")

if __name__ == "__main__":
    reset_admin_password() 