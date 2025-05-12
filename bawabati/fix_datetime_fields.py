import os
import django
import pymysql
from datetime import datetime

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'bawabati.settings')
django.setup()

def fix_datetime_fields():
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
        print("Identifying and fixing datetime fields in the database...")
        
        # Tables that commonly have datetime fields
        tables_to_check = [
            'auth_user',
            'django_session',
            'django_admin_log',
            'django_migrations',
            'bawabati_app_note',
            'bawabati_app_course'
        ]
        
        for table in tables_to_check:
            print(f"\nChecking table: {table}")
            
            # Get column information
            cursor.execute(f"DESCRIBE {table}")
            columns = cursor.fetchall()
            
            # Find datetime columns
            datetime_columns = []
            for column in columns:
                col_name = column[0]
                col_type = column[1]
                if 'datetime' in col_type.lower() or 'timestamp' in col_type.lower() or 'date' in col_type.lower():
                    datetime_columns.append(col_name)
            
            if not datetime_columns:
                print(f"  No datetime columns found in {table}")
                continue
            
            print(f"  Found {len(datetime_columns)} datetime columns: {', '.join(datetime_columns)}")
            
            # Check for string values in datetime columns
            for col_name in datetime_columns:
                cursor.execute(f"SELECT id, {col_name} FROM {table} WHERE {col_name} IS NOT NULL")
                rows = cursor.fetchall()
                
                fixed_count = 0
                for row in rows:
                    row_id = row[0]
                    date_value = row[1]
                    
                    # Check if it's a string instead of a datetime object
                    if isinstance(date_value, str):
                        print(f"  Found string value in {table}.{col_name} for id={row_id}: '{date_value}'")
                        
                        # Try to convert to proper datetime format or set to NULL
                        try:
                            # Try different date formats
                            formats_to_try = [
                                '%Y-%m-%d %H:%M:%S',  # 2023-01-01 12:34:56
                                '%Y-%m-%d',           # 2023-01-01
                                '%d/%m/%Y %H:%M:%S',  # 01/01/2023 12:34:56
                                '%d/%m/%Y'            # 01/01/2023
                            ]
                            
                            converted = False
                            for date_format in formats_to_try:
                                try:
                                    datetime_obj = datetime.strptime(date_value, date_format)
                                    # Format datetime in MySQL format
                                    formatted_date = datetime_obj.strftime('%Y-%m-%d %H:%M:%S')
                                    cursor.execute(f"UPDATE {table} SET {col_name} = %s WHERE id = %s", (formatted_date, row_id))
                                    converted = True
                                    fixed_count += 1
                                    print(f"    Converted to: {formatted_date}")
                                    break
                                except ValueError:
                                    continue
                            
                            if not converted:
                                # If conversion fails, set to NULL
                                cursor.execute(f"UPDATE {table} SET {col_name} = NULL WHERE id = %s", (row_id,))
                                fixed_count += 1
                                print(f"    Failed to convert, set to NULL")
                        
                        except Exception as e:
                            print(f"    Error fixing {table}.{col_name} for id={row_id}: {e}")
                
                if fixed_count > 0:
                    print(f"  Fixed {fixed_count} string values in {table}.{col_name}")
                else:
                    print(f"  No string values found in {table}.{col_name}")
        
        # Special check for auth_user last_login field which commonly causes issues
        print("\nSpecial check for auth_user.last_login field...")
        cursor.execute("""
            UPDATE auth_user 
            SET last_login = NULL 
            WHERE last_login IS NOT NULL AND NOT (last_login REGEXP '^[0-9]{4}-[0-9]{2}-[0-9]{2}')
        """)
        rows_affected = cursor.rowcount
        if rows_affected > 0:
            print(f"Fixed {rows_affected} invalid last_login values in auth_user table")
        else:
            print("No invalid last_login values found in auth_user table")
        
        # Special check for django_session expire_date field
        print("\nSpecial check for django_session.expire_date field...")
        cursor.execute("""
            UPDATE django_session 
            SET expire_date = DATE_ADD(NOW(), INTERVAL 2 WEEK)
            WHERE expire_date IS NOT NULL AND NOT (expire_date REGEXP '^[0-9]{4}-[0-9]{2}-[0-9]{2}')
        """)
        rows_affected = cursor.rowcount
        if rows_affected > 0:
            print(f"Fixed {rows_affected} invalid expire_date values in django_session table")
        else:
            print("No invalid expire_date values found in django_session table")
        
        # Commit changes
        conn.commit()
        print("\nDateTime field cleanup completed successfully!")
        
    except Exception as e:
        print(f"\nError during datetime field cleanup: {e}")
        conn.rollback()
    
    finally:
        cursor.close()
        conn.close()

if __name__ == "__main__":
    fix_datetime_fields() 