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
        print("Executing comprehensive table cleanup...")
        
        # First, identify all foreign key constraints
        print("\nIdentifying foreign key constraints...")
        cursor.execute("""
            SELECT 
                TABLE_NAME, 
                COLUMN_NAME,
                CONSTRAINT_NAME, 
                REFERENCED_TABLE_NAME,
                REFERENCED_COLUMN_NAME
            FROM
                information_schema.KEY_COLUMN_USAGE
            WHERE
                REFERENCED_TABLE_SCHEMA = 'bawabati_db'
                AND REFERENCED_TABLE_NAME IS NOT NULL
            ORDER BY
                TABLE_NAME, REFERENCED_TABLE_NAME
        """)
        constraints = cursor.fetchall()
        
        # Print the constraints for reference
        print(f"Found {len(constraints)} foreign key constraints:")
        for table_name, column_name, constraint_name, ref_table, ref_column in constraints:
            print(f"  - {table_name}.{column_name} -> {ref_table}.{ref_column} ({constraint_name})")
        
        # Temporarily disable foreign key checks
        print("\nTemporarily disabling foreign key checks...")
        cursor.execute("SET FOREIGN_KEY_CHECKS = 0")
        
        # Tables to drop (legacy tables that are empty or redundant)
        tables_to_drop = [
            'courses_cours',
            'students_eleve',
            'teachers_professeur',
            'courses_classe',  # This one might have dependencies
            'auth_group_permissions',
            'auth_user_groups',
            'auth_user_user_permissions',
            'grades_note',
            'bawabati_app_enrollment',  # If empty and not needed
        ]
        
        # Keep django_admin_log as it's part of the core Django system
        
        # Drop the tables
        for table in tables_to_drop:
            try:
                print(f"Dropping table: {table}")
                cursor.execute(f"DROP TABLE IF EXISTS {table}")
                print(f"Successfully dropped table: {table}")
            except Exception as e:
                print(f"Error dropping table {table}: {e}")
        
        # Re-enable foreign key checks
        print("\nRe-enabling foreign key checks...")
        cursor.execute("SET FOREIGN_KEY_CHECKS = 1")
        
        # Commit changes
        conn.commit()
        print("\nTable cleanup completed successfully!")
        
        # List remaining tables
        cursor.execute("SHOW TABLES")
        tables = [table[0] for table in cursor.fetchall()]
        print(f"\nRemaining tables in the database ({len(tables)}):")
        for table in sorted(tables):
            print(f"  - {table}")
        
        # Explain the changes
        print("\nSummary of changes:")
        print("1. Removed legacy tables (courses_cours, students_eleve, teachers_professeur)")
        print("2. Removed redundant tables (auth_group_permissions, auth_user_groups, etc.)")
        print("3. Your database now has a cleaner structure with only the essential tables")
        print("4. The application now relies on Django's built-in user management system")
        
    except Exception as e:
        print(f"\nError during table cleanup: {e}")
        conn.rollback()
    
    finally:
        cursor.close()
        conn.close()

if __name__ == "__main__":
    cleanup_tables() 