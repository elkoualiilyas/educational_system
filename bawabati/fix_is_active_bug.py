import os
import django

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'bawabati.settings')
django.setup()

from django.contrib.auth.models import User

def fix_user_boolean_fields():
    print("Fixing boolean fields in User model...")
    
    # Check all users for string values in boolean fields
    users = User.objects.all()
    fixed_count = 0
    
    for user in users:
        needs_update = False
        
        # Check is_active field (common source of problems)
        if not isinstance(user.is_active, bool):
            print(f"User {user.username} (ID: {user.id}) has non-boolean is_active: '{user.is_active}'")
            # Fix the value
            if str(user.is_active).lower() in ('true', 'yes', 't', 'y', '1', 'on', '127'):
                user.is_active = True
            else:
                user.is_active = False
            needs_update = True
        
        # Check is_staff field
        if not isinstance(user.is_staff, bool):
            print(f"User {user.username} (ID: {user.id}) has non-boolean is_staff: '{user.is_staff}'")
            # Fix the value
            if str(user.is_staff).lower() in ('true', 'yes', 't', 'y', '1', 'on', '127'):
                user.is_staff = True
            else:
                user.is_staff = False
            needs_update = True
        
        # Check is_superuser field
        if not isinstance(user.is_superuser, bool):
            print(f"User {user.username} (ID: {user.id}) has non-boolean is_superuser: '{user.is_superuser}'")
            # Fix the value
            if str(user.is_superuser).lower() in ('true', 'yes', 't', 'y', '1', 'on', '127'):
                user.is_superuser = True
            else:
                user.is_superuser = False
            needs_update = True
        
        # Save the user if changes were made
        if needs_update:
            try:
                # Update directly via SQL to bypass validation
                User.objects.filter(id=user.id).update(
                    is_active=user.is_active,
                    is_staff=user.is_staff,
                    is_superuser=user.is_superuser
                )
                fixed_count += 1
                print(f"Fixed user {user.username} (ID: {user.id})")
            except Exception as e:
                print(f"Error fixing user {user.username} (ID: {user.id}): {e}")
    
    print(f"\nFixed {fixed_count} users with boolean field issues")

if __name__ == "__main__":
    fix_user_boolean_fields() 