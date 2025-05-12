import os
import django
import pymysql

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'bawabati.settings')
django.setup()

def analyze_table_structure():
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
        print("Analyzing database table structure...")
        
        # Get all tables in the database
        cursor.execute("SHOW TABLES")
        tables = [table[0] for table in cursor.fetchall()]
        print(f"Found {len(tables)} tables in the database:")
        for table in tables:
            print(f"  - {table}")
        
        # Group tables by potential duplicates or overlapping functionality
        table_groups = {
            "users": [table for table in tables if "user" in table or "auth_user" in table],
            "courses": [table for table in tables if "course" in table or "cours" in table],
            "students": [table for table in tables if "student" in table or "eleve" in table],
            "teachers": [table for table in tables if "teacher" in table or "professeur" in table],
            "enrollments": [table for table in tables if "enrollment" in table or "inscription" in table],
            "notes": [table for table in tables if "note" in table],
            "grades": [table for table in tables if "grade" in table]
        }
        
        print("\nPotential duplicate/overlapping tables by category:")
        for category, related_tables in table_groups.items():
            if len(related_tables) > 1:
                print(f"\n--- {category.upper()} tables ---")
                for table in related_tables:
                    # Get column information
                    cursor.execute(f"DESCRIBE {table}")
                    columns = cursor.fetchall()
                    
                    # Count rows
                    cursor.execute(f"SELECT COUNT(*) FROM {table}")
                    row_count = cursor.fetchone()[0]
                    
                    # Check for foreign keys
                    cursor.execute(f"""
                        SELECT TABLE_NAME, COLUMN_NAME, REFERENCED_TABLE_NAME
                        FROM information_schema.KEY_COLUMN_USAGE
                        WHERE REFERENCED_TABLE_SCHEMA = 'bawabati_db'
                        AND TABLE_NAME = '{table}'
                    """)
                    foreign_keys = cursor.fetchall()
                    
                    # Check for tables referencing this table
                    cursor.execute(f"""
                        SELECT TABLE_NAME, COLUMN_NAME
                        FROM information_schema.KEY_COLUMN_USAGE
                        WHERE REFERENCED_TABLE_SCHEMA = 'bawabati_db'
                        AND REFERENCED_TABLE_NAME = '{table}'
                    """)
                    referenced_by = cursor.fetchall()
                    
                    print(f"  Table: {table}")
                    print(f"    Columns: {len(columns)}")
                    print(f"    Rows: {row_count}")
                    print(f"    Foreign Keys: {len(foreign_keys)}")
                    print(f"    Referenced by {len(referenced_by)} tables")
        
        # Check for unused/empty tables
        print("\n--- UNUSED/EMPTY TABLES ---")
        for table in tables:
            cursor.execute(f"SELECT COUNT(*) FROM {table}")
            row_count = cursor.fetchone()[0]
            
            # Check for tables referencing this table
            cursor.execute(f"""
                SELECT TABLE_NAME
                FROM information_schema.KEY_COLUMN_USAGE
                WHERE REFERENCED_TABLE_SCHEMA = 'bawabati_db'
                AND REFERENCED_TABLE_NAME = '{table}'
            """)
            referenced_by = cursor.fetchall()
            
            if row_count == 0 and len(referenced_by) == 0:
                print(f"  Table {table} is empty and not referenced by other tables (can be safely removed)")
        
        # Recommend tables to merge or drop
        print("\n=== RECOMMENDATIONS ===")
        
        # Check for similar table structures between app vs legacy tables
        recommendations = []
        
        # Django vs Legacy Course tables
        if "bawabati_app_course" in tables and "courses_cours" in tables:
            cursor.execute("SELECT COUNT(*) FROM bawabati_app_course")
            bawabati_courses = cursor.fetchone()[0]
            cursor.execute("SELECT COUNT(*) FROM courses_cours")
            legacy_courses = cursor.fetchone()[0]
            
            if bawabati_courses > 0 and legacy_courses == 0:
                recommendations.append(("DROP TABLE", "courses_cours", "Empty legacy course table"))
            elif bawabati_courses == 0 and legacy_courses > 0:
                recommendations.append(("MIGRATE DATA", "courses_cours -> bawabati_app_course", "Transfer data to Django course model"))
        
        # User profiles vs legacy tables
        if "bawabati_app_userprofile" in tables and "students_eleve" in tables and "teachers_professeur" in tables:
            cursor.execute("SELECT COUNT(*) FROM bawabati_app_userprofile WHERE role='student'")
            django_students = cursor.fetchone()[0]
            cursor.execute("SELECT COUNT(*) FROM students_eleve")
            legacy_students = cursor.fetchone()[0]
            
            cursor.execute("SELECT COUNT(*) FROM bawabati_app_userprofile WHERE role='teacher'")
            django_teachers = cursor.fetchone()[0]
            cursor.execute("SELECT COUNT(*) FROM teachers_professeur")
            legacy_teachers = cursor.fetchone()[0]
            
            if django_students > 0 and legacy_students == 0:
                recommendations.append(("DROP TABLE", "students_eleve", "Empty legacy student table"))
            elif django_students == 0 and legacy_students > 0:
                recommendations.append(("MIGRATE DATA", "students_eleve -> bawabati_app_userprofile", "Transfer student data to Django user model"))
            
            if django_teachers > 0 and legacy_teachers == 0:
                recommendations.append(("DROP TABLE", "teachers_professeur", "Empty legacy teacher table"))
            elif django_teachers == 0 and legacy_teachers > 0:
                recommendations.append(("MIGRATE DATA", "teachers_professeur -> bawabati_app_userprofile", "Transfer teacher data to Django user model"))
        
        # Print recommendations
        if recommendations:
            print("Based on the analysis, the following actions are recommended:")
            for action, target, reason in recommendations:
                print(f"  - {action}: {target} ({reason})")
            
            # SQL for dropping unused tables
            print("\nSQL commands to run for dropping unused/empty tables:")
            drop_tables = [target for action, target, reason in recommendations if action == "DROP TABLE"]
            for table in drop_tables:
                print(f"DROP TABLE IF EXISTS {table};")
            
            # Ask for confirmation to execute drops
            response = input("\nWould you like to execute these DROP TABLE commands now? (yes/no): ")
            if response.lower() == "yes":
                for table in drop_tables:
                    try:
                        cursor.execute(f"DROP TABLE IF EXISTS {table}")
                        print(f"Dropped table: {table}")
                    except Exception as e:
                        print(f"Error dropping table {table}: {e}")
                conn.commit()
                print("Table cleanup completed.")
            else:
                print("No tables were dropped.")
        else:
            print("No specific recommendations - your table structure looks good!")
        
    except Exception as e:
        print(f"\nError during database analysis: {e}")
        conn.rollback()
    
    finally:
        cursor.close()
        conn.close()

if __name__ == "__main__":
    analyze_table_structure() 