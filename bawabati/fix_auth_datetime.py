import os
import django
import pymysql

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'bawabati.settings')
django.setup()

def fix_auth_datetime_fields():
    # Connect to MySQL database
    conn = pymysql.connect(
        host='localhost',
        user='root',
        password='',
        database='bawabati_db',
        charset='utf8mb4'
    )
    cursor = conn.cursor()
    
    try:
        print("Fixing datetime fields in auth_user table...")
        
        # Get all users
        cursor.execute("SELECT id, username, last_login, date_joined FROM auth_user")
        users = cursor.fetchall()
        
        fixed_count = 0
        for user in users:
            user_id = user[0]
            username = user[1]
            last_login = user[2]
            date_joined = user[3]
            
            # Check if date fields are strings
            updates_needed = []
            
            if isinstance(last_login, str):
                print(f"User {username} (ID: {user_id}) has string last_login: '{last_login}'")
                updates_needed.append("last_login = NULL")
                fixed_count += 1
            
            if isinstance(date_joined, str):
                print(f"User {username} (ID: {user_id}) has string date_joined: '{date_joined}'")
                # Set a default date for joining
                updates_needed.append("date_joined = '2023-01-01 00:00:00'")
                fixed_count += 1
            
            # Apply updates if needed
            if updates_needed:
                update_sql = f"UPDATE auth_user SET {', '.join(updates_needed)} WHERE id = {user_id}"
                cursor.execute(update_sql)
                print(f"Fixed user {username} (ID: {user_id})")
        
        # Commit changes
        conn.commit()
        print(f"\nFixed {fixed_count} datetime issues in auth_user table")
        
        # Fix any remaining issues with a direct SQL query
        print("\nApplying additional fixes to ensure all datetime fields are valid...")
        
        # Fix last_login field (set to NULL if it's not a valid datetime)
        cursor.execute("""
            UPDATE auth_user 
            SET last_login = NULL 
            WHERE last_login IS NOT NULL AND (
                last_login = '0000-00-00 00:00:00' OR 
                last_login = '0000-00-00 00:00:00.000000' OR
                last_login LIKE '0%'
            )
        """)
        rows_affected = cursor.rowcount
        print(f"Fixed {rows_affected} additional invalid last_login values")
        
        # Fix date_joined field (set to a valid date if it's not a valid datetime)
        cursor.execute("""
            UPDATE auth_user 
            SET date_joined = '2023-01-01 00:00:00' 
            WHERE date_joined IS NOT NULL AND (
                date_joined = '0000-00-00 00:00:00' OR 
                date_joined = '0000-00-00 00:00:00.000000' OR
                date_joined LIKE '0%'
            )
        """)
        rows_affected = cursor.rowcount
        print(f"Fixed {rows_affected} additional invalid date_joined values")
        
        # Commit changes
        conn.commit()
        print("\nAll auth_user datetime issues have been fixed!")
        
    except Exception as e:
        print(f"\nError during auth_user datetime field cleanup: {e}")
        conn.rollback()
    
    finally:
        cursor.close()
        conn.close()

if __name__ == "__main__":
    fix_auth_datetime_fields() 