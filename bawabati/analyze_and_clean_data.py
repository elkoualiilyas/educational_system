import os
import django
import pymysql
from collections import defaultdict

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'bawabati.settings')
django.setup()

def analyze_and_clean():
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
        print("Analyzing database tables for duplications...")
        
        # 1. Check for duplicate users
        print("\n--- Analyzing auth_user table ---")
        cursor.execute("SELECT COUNT(*) FROM auth_user")
        total_users = cursor.fetchone()[0]
        print(f"Total users: {total_users}")
        
        cursor.execute("SELECT username, COUNT(*) FROM auth_user GROUP BY username HAVING COUNT(*) > 1")
        duplicate_usernames = cursor.fetchall()
        if duplicate_usernames:
            print(f"Found {len(duplicate_usernames)} duplicate usernames:")
            for username, count in duplicate_usernames:
                print(f"  - {username}: {count} entries")
                
                # Keep the oldest record, remove others
                cursor.execute("""
                    SELECT id FROM auth_user 
                    WHERE username = %s 
                    ORDER BY date_joined ASC
                """, (username,))
                ids = [row[0] for row in cursor.fetchall()]
                
                if len(ids) > 1:
                    keep_id = ids[0]
                    delete_ids = ids[1:]
                    print(f"    Keeping ID: {keep_id}, Removing IDs: {delete_ids}")
                    
                    # Update references before deletion
                    for delete_id in delete_ids:
                        # Update UserProfile references
                        cursor.execute("UPDATE bawabati_app_userprofile SET user_id = %s WHERE user_id = %s", (keep_id, delete_id))
                        # Update Course references
                        cursor.execute("UPDATE bawabati_app_course SET assigned_teacher_id = %s WHERE assigned_teacher_id = %s", (keep_id, delete_id))
                        # Update Enrollment references
                        cursor.execute("UPDATE bawabati_app_enrollment SET student_id = %s WHERE student_id = %s", (keep_id, delete_id))
                        # Update Note references
                        cursor.execute("UPDATE bawabati_app_note SET uploaded_by_id = %s WHERE uploaded_by_id = %s", (keep_id, delete_id))
                        
                        # Delete the duplicate user
                        cursor.execute("DELETE FROM auth_user WHERE id = %s", (delete_id,))
        else:
            print("No duplicate usernames found.")
            
        # 2. Check for duplicate user profiles
        print("\n--- Analyzing bawabati_app_userprofile table ---")
        cursor.execute("SELECT COUNT(*) FROM bawabati_app_userprofile")
        total_profiles = cursor.fetchone()[0]
        print(f"Total profiles: {total_profiles}")
        
        cursor.execute("SELECT user_id, COUNT(*) FROM bawabati_app_userprofile GROUP BY user_id HAVING COUNT(*) > 1")
        duplicate_profiles = cursor.fetchall()
        if duplicate_profiles:
            print(f"Found {len(duplicate_profiles)} duplicate user profiles:")
            for user_id, count in duplicate_profiles:
                print(f"  - User ID {user_id}: {count} profiles")
                
                # Keep the first profile, remove others
                cursor.execute("SELECT id FROM bawabati_app_userprofile WHERE user_id = %s", (user_id,))
                profile_ids = [row[0] for row in cursor.fetchall()]
                
                if len(profile_ids) > 1:
                    keep_id = profile_ids[0]
                    delete_ids = profile_ids[1:]
                    print(f"    Keeping profile ID: {keep_id}, Removing profile IDs: {delete_ids}")
                    
                    for delete_id in delete_ids:
                        cursor.execute("DELETE FROM bawabati_app_userprofile WHERE id = %s", (delete_id,))
        else:
            print("No duplicate user profiles found.")
        
        # 3. Check for orphaned user profiles (no corresponding user)
        print("\n--- Checking for orphaned user profiles ---")
        cursor.execute("""
            SELECT bp.id, bp.user_id
            FROM bawabati_app_userprofile bp
            LEFT JOIN auth_user au ON bp.user_id = au.id
            WHERE au.id IS NULL
        """)
        orphaned_profiles = cursor.fetchall()
        if orphaned_profiles:
            print(f"Found {len(orphaned_profiles)} orphaned user profiles:")
            for profile_id, user_id in orphaned_profiles:
                print(f"  - Profile ID {profile_id} references non-existent User ID {user_id}")
                cursor.execute("DELETE FROM bawabati_app_userprofile WHERE id = %s", (profile_id,))
            print(f"Deleted {len(orphaned_profiles)} orphaned profiles.")
        else:
            print("No orphaned user profiles found.")
        
        # 4. Check for duplicate courses
        print("\n--- Analyzing bawabati_app_course table ---")
        cursor.execute("SELECT COUNT(*) FROM bawabati_app_course")
        total_courses = cursor.fetchone()[0]
        print(f"Total courses: {total_courses}")
        
        cursor.execute("SELECT title, assigned_teacher_id, COUNT(*) FROM bawabati_app_course GROUP BY title, assigned_teacher_id HAVING COUNT(*) > 1")
        duplicate_courses = cursor.fetchall()
        if duplicate_courses:
            print(f"Found {len(duplicate_courses)} duplicate courses:")
            for title, teacher_id, count in duplicate_courses:
                print(f"  - Course '{title}' by Teacher ID {teacher_id}: {count} entries")
                
                # Keep the first course, update references for others
                cursor.execute("SELECT id FROM bawabati_app_course WHERE title = %s AND assigned_teacher_id = %s", (title, teacher_id))
                course_ids = [row[0] for row in cursor.fetchall()]
                
                if len(course_ids) > 1:
                    keep_id = course_ids[0]
                    delete_ids = course_ids[1:]
                    print(f"    Keeping Course ID: {keep_id}, Removing Course IDs: {delete_ids}")
                    
                    for delete_id in delete_ids:
                        # Update Enrollment references
                        cursor.execute("UPDATE bawabati_app_enrollment SET course_id = %s WHERE course_id = %s", (keep_id, delete_id))
                        # Update Note references
                        cursor.execute("UPDATE bawabati_app_note SET course_id = %s WHERE course_id = %s", (keep_id, delete_id))
                        
                        # Delete the duplicate course
                        cursor.execute("DELETE FROM bawabati_app_course WHERE id = %s", (delete_id,))
        else:
            print("No duplicate courses found.")
        
        # 5. Check for duplicate enrollments
        print("\n--- Analyzing bawabati_app_enrollment table ---")
        cursor.execute("SELECT COUNT(*) FROM bawabati_app_enrollment")
        total_enrollments = cursor.fetchone()[0]
        print(f"Total enrollments: {total_enrollments}")
        
        cursor.execute("SELECT student_id, course_id, COUNT(*) FROM bawabati_app_enrollment GROUP BY student_id, course_id HAVING COUNT(*) > 1")
        duplicate_enrollments = cursor.fetchall()
        if duplicate_enrollments:
            print(f"Found {len(duplicate_enrollments)} duplicate enrollments:")
            for student_id, course_id, count in duplicate_enrollments:
                print(f"  - Student ID {student_id} in Course ID {course_id}: {count} entries")
                
                # Keep the oldest enrollment
                cursor.execute("""
                    SELECT id FROM bawabati_app_enrollment 
                    WHERE student_id = %s AND course_id = %s 
                    ORDER BY enrollment_date ASC
                """, (student_id, course_id))
                enrollment_ids = [row[0] for row in cursor.fetchall()]
                
                if len(enrollment_ids) > 1:
                    keep_id = enrollment_ids[0]
                    delete_ids = enrollment_ids[1:]
                    print(f"    Keeping Enrollment ID: {keep_id}, Removing Enrollment IDs: {delete_ids}")
                    
                    for delete_id in delete_ids:
                        cursor.execute("DELETE FROM bawabati_app_enrollment WHERE id = %s", (delete_id,))
        else:
            print("No duplicate enrollments found.")
        
        # 6. Check for orphaned enrollments
        print("\n--- Checking for orphaned enrollments ---")
        cursor.execute("""
            SELECT e.id, e.student_id, e.course_id 
            FROM bawabati_app_enrollment e
            LEFT JOIN auth_user u ON e.student_id = u.id
            LEFT JOIN bawabati_app_course c ON e.course_id = c.id
            WHERE u.id IS NULL OR c.id IS NULL
        """)
        orphaned_enrollments = cursor.fetchall()
        if orphaned_enrollments:
            print(f"Found {len(orphaned_enrollments)} orphaned enrollments:")
            for enrollment_id, student_id, course_id in orphaned_enrollments:
                print(f"  - Enrollment ID {enrollment_id} references non-existent Student ID {student_id} or Course ID {course_id}")
                cursor.execute("DELETE FROM bawabati_app_enrollment WHERE id = %s", (enrollment_id,))
            print(f"Deleted {len(orphaned_enrollments)} orphaned enrollments.")
        else:
            print("No orphaned enrollments found.")
        
        # 7. Check for duplicate notes
        print("\n--- Analyzing bawabati_app_note table ---")
        cursor.execute("SELECT COUNT(*) FROM bawabati_app_note")
        total_notes = cursor.fetchone()[0]
        print(f"Total notes: {total_notes}")
        
        cursor.execute("SELECT title, course_id, uploaded_by_id, COUNT(*) FROM bawabati_app_note GROUP BY title, course_id, uploaded_by_id HAVING COUNT(*) > 1")
        duplicate_notes = cursor.fetchall()
        if duplicate_notes:
            print(f"Found {len(duplicate_notes)} duplicate notes:")
            for title, course_id, uploader_id, count in duplicate_notes:
                print(f"  - Note '{title}' in Course ID {course_id} by User ID {uploader_id}: {count} entries")
                
                # Keep the most recent note
                cursor.execute("""
                    SELECT id FROM bawabati_app_note 
                    WHERE title = %s AND course_id = %s AND uploaded_by_id = %s 
                    ORDER BY upload_date DESC
                """, (title, course_id, uploader_id))
                note_ids = [row[0] for row in cursor.fetchall()]
                
                if len(note_ids) > 1:
                    keep_id = note_ids[0]
                    delete_ids = note_ids[1:]
                    print(f"    Keeping Note ID: {keep_id}, Removing Note IDs: {delete_ids}")
                    
                    for delete_id in delete_ids:
                        cursor.execute("DELETE FROM bawabati_app_note WHERE id = %s", (delete_id,))
        else:
            print("No duplicate notes found.")
        
        # 8. Check for orphaned notes
        print("\n--- Checking for orphaned notes ---")
        cursor.execute("""
            SELECT n.id, n.course_id, n.uploaded_by_id
            FROM bawabati_app_note n
            LEFT JOIN bawabati_app_course c ON n.course_id = c.id
            LEFT JOIN auth_user u ON n.uploaded_by_id = u.id
            WHERE c.id IS NULL OR u.id IS NULL
        """)
        orphaned_notes = cursor.fetchall()
        if orphaned_notes:
            print(f"Found {len(orphaned_notes)} orphaned notes:")
            for note_id, course_id, uploader_id in orphaned_notes:
                print(f"  - Note ID {note_id} references non-existent Course ID {course_id} or User ID {uploader_id}")
                cursor.execute("DELETE FROM bawabati_app_note WHERE id = %s", (note_id,))
            print(f"Deleted {len(orphaned_notes)} orphaned notes.")
        else:
            print("No orphaned notes found.")
        
        # Commit changes
        conn.commit()
        print("\nDatabase analysis and cleanup completed successfully!")
        
    except Exception as e:
        print(f"\nError during database analysis and cleanup: {e}")
        conn.rollback()
    
    finally:
        cursor.close()
        conn.close()

if __name__ == "__main__":
    analyze_and_clean() 