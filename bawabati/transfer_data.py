import os
import django
import sqlite3
import pymysql

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'bawabati.settings')
django.setup()

from django.contrib.auth.models import User
from bawabati_app.models import UserProfile, Course, Note, Enrollment

def transfer_data():
    # Connect to SQLite database
    sqlite_conn = sqlite3.connect('db.sqlite3')
    sqlite_cursor = sqlite_conn.cursor()
    
    # Connect to MySQL database
    mysql_conn = pymysql.connect(
        host='localhost',
        user='root',
        password='',  # Add your password if any
        database='bawabati_db',
        charset='utf8mb4'
    )
    mysql_cursor = mysql_conn.cursor()
    
    try:
        # Clear existing data to avoid duplicates
        print("Clearing existing data from MySQL tables...")
        tables = [
            'bawabati_app_note',
            'bawabati_app_enrollment',
            'bawabati_app_course',
            'bawabati_app_userprofile',
            'auth_user_groups', 
            'auth_user_user_permissions',
            'auth_user'
        ]
        
        for table in tables:
            try:
                mysql_cursor.execute(f"DELETE FROM {table}")
                print(f"Cleared {table}")
            except Exception as e:
                print(f"Error clearing {table}: {e}")
        
        # Reset auto-increment counters
        for table in tables:
            try:
                mysql_cursor.execute(f"ALTER TABLE {table} AUTO_INCREMENT = 1")
                print(f"Reset auto-increment for {table}")
            except Exception as e:
                print(f"Error resetting auto-increment for {table}: {e}")
        
        # Transfer Users
        print("Transferring Users...")
        sqlite_cursor.execute("SELECT * FROM auth_user")
        users = sqlite_cursor.fetchall()
        
        for user in users:
            # Insert user into MySQL
            mysql_cursor.execute("""
                INSERT INTO auth_user (id, password, last_login, is_superuser, username, first_name, last_name, 
                email, is_staff, is_active, date_joined)
                VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
            """, (user[0], user[1], user[2], user[3], user[4], user[5], user[6], user[7], user[8], user[9], user[10]))
        
        # Transfer UserProfiles
        print("Transferring UserProfiles...")
        sqlite_cursor.execute("SELECT * FROM bawabati_app_userprofile")
        profiles = sqlite_cursor.fetchall()
        
        for profile in profiles:
            # Insert profile into MySQL
            mysql_cursor.execute("""
                INSERT INTO bawabati_app_userprofile (id, role, user_id)
                VALUES (%s, %s, %s)
            """, (profile[0], profile[1], profile[2]))
        
        # Transfer Courses
        print("Transferring Courses...")
        sqlite_cursor.execute("SELECT * FROM bawabati_app_course")
        courses = sqlite_cursor.fetchall()
        
        for course in courses:
            # Insert course into MySQL
            mysql_cursor.execute("""
                INSERT INTO bawabati_app_course (id, title, description, assigned_teacher_id)
                VALUES (%s, %s, %s, %s)
            """, (course[0], course[1], course[2], course[3]))
        
        # Transfer Enrollments
        print("Transferring Enrollments...")
        sqlite_cursor.execute("SELECT * FROM bawabati_app_enrollment")
        enrollments = sqlite_cursor.fetchall()
        
        for enrollment in enrollments:
            # Insert enrollment into MySQL
            mysql_cursor.execute("""
                INSERT INTO bawabati_app_enrollment (id, enrollment_date, course_id, student_id)
                VALUES (%s, %s, %s, %s)
            """, (enrollment[0], enrollment[1], enrollment[2], enrollment[3]))
        
        # Transfer Notes
        print("Transferring Notes...")
        sqlite_cursor.execute("SELECT * FROM bawabati_app_note")
        notes = sqlite_cursor.fetchall()
        
        for note in notes:
            # Insert note into MySQL
            mysql_cursor.execute("""
                INSERT INTO bawabati_app_note (id, title, file, upload_date, course_id, uploaded_by_id)
                VALUES (%s, %s, %s, %s, %s, %s)
            """, (note[0], note[1], note[2], note[3], note[4], note[5]))
        
        # Commit changes
        mysql_conn.commit()
        print("Data transfer completed successfully!")
        
    except Exception as e:
        print(f"Error transferring data: {e}")
        mysql_conn.rollback()
    
    finally:
        # Close connections
        sqlite_cursor.close()
        sqlite_conn.close()
        mysql_cursor.close()
        mysql_conn.close()

if __name__ == "__main__":
    transfer_data() 