import os
import django
import pymysql

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'bawabati.settings')
django.setup()

def cleanup_tables():
    # Connect to MySQL database
    conn = pymysql.connect(
        host='localhost',
        user='root',
        password='',  # Add your password if any
        database='bawabati_db',
        charset='utf8mb4'
    )
    cursor = conn.cursor()
    
    try:
        print("Executing table cleanup...")
        
        # Tables to drop (legacy tables that are empty or redundant)
        tables_to_drop = [
            'courses_cours',
            'students_eleve',
            'teachers_professeur',
            'auth_group_permissions',
            'auth_user_groups',
            'auth_user_user_permissions',
            'grades_note'
        ]
        
        # Keep bawabati_app_enrollment and django_admin_log as they are part of the core Django system
        
        # Drop the tables
        for table in tables_to_drop:
            try:
                print(f"Dropping table: {table}")
                cursor.execute(f"DROP TABLE IF EXISTS {table}")
                print(f"Successfully dropped table: {table}")
            except Exception as e:
                print(f"Error dropping table {table}: {e}")
        
        # Commit changes
        conn.commit()
        print("\nTable cleanup completed successfully!")
        
        # List remaining tables
        cursor.execute("SHOW TABLES")
        tables = [table[0] for table in cursor.fetchall()]
        print(f"\nRemaining tables in the database ({len(tables)}):")
        for table in sorted(tables):
            print(f"  - {table}")
        
    except Exception as e:
        print(f"\nError during table cleanup: {e}")
        conn.rollback()
    
    finally:
        cursor.close()
        conn.close()

if __name__ == "__main__":
    cleanup_tables() 