import psycopg2
from datetime import datetime

conn = psycopg2.connect('postgresql://postgres:postgres@localhost:5432/library_db')
cur = conn.cursor()

print('='*60)
print('🎉 DATABASE LIBRARY_DB - STATUS')
print('='*60)

# Check tables
cur.execute("SELECT table_name FROM information_schema.tables WHERE table_schema='public' ORDER BY table_name")
tables = [row[0] for row in cur.fetchall()]
print(f'\n📊 Total Tabel: {len(tables)}')
for table in tables:
    print(f'  ✓ {table}')

# Check users table structure
print('\n' + '='*60)
print('👥 STRUKTUR TABEL: USERS')
print('='*60)
cur.execute("""
    SELECT column_name, data_type, character_maximum_length, is_nullable 
    FROM information_schema.columns 
    WHERE table_name='users' 
    ORDER BY ordinal_position
""")
for row in cur.fetchall():
    col_name, data_type, max_len, nullable = row
    length = f"({max_len})" if max_len else ""
    null_info = "NULL" if nullable == "YES" else "NOT NULL"
    print(f'  • {col_name:<20} {data_type}{length:<15} {null_info}')

# Check books table structure
print('\n' + '='*60)
print('📚 STRUKTUR TABEL: BOOKS')
print('='*60)
cur.execute("""
    SELECT column_name, data_type, character_maximum_length, is_nullable 
    FROM information_schema.columns 
    WHERE table_name='books' 
    ORDER BY ordinal_position
""")
for row in cur.fetchall():
    col_name, data_type, max_len, nullable = row
    length = f"({max_len})" if max_len else ""
    null_info = "NULL" if nullable == "YES" else "NOT NULL"
    print(f'  • {col_name:<20} {data_type}{length:<15} {null_info}')

# Check borrowings table structure
print('\n' + '='*60)
print('📖 STRUKTUR TABEL: BORROWINGS')
print('='*60)
cur.execute("""
    SELECT column_name, data_type, character_maximum_length, is_nullable 
    FROM information_schema.columns 
    WHERE table_name='borrowings' 
    ORDER BY ordinal_position
""")
for row in cur.fetchall():
    col_name, data_type, max_len, nullable = row
    length = f"({max_len})" if max_len else ""
    null_info = "NULL" if nullable == "YES" else "NOT NULL"
    print(f'  • {col_name:<20} {data_type}{length:<15} {null_info}')

# Check current data counts
print('\n' + '='*60)
print('📈 JUMLAH DATA')
print('='*60)
cur.execute("SELECT COUNT(*) FROM users")
users_count = cur.fetchone()[0]
print(f'  Users:      {users_count} record')

cur.execute("SELECT COUNT(*) FROM books")
books_count = cur.fetchone()[0]
print(f'  Books:      {books_count} record')

cur.execute("SELECT COUNT(*) FROM borrowings")
borrowings_count = cur.fetchone()[0]
print(f'  Borrowings: {borrowings_count} record')

# Check alembic version
print('\n' + '='*60)
print('🔧 VERSI MIGRASI DATABASE')
print('='*60)
cur.execute("SELECT version_num FROM alembic_version")
version = cur.fetchone()
if version:
    print(f'  Current Version: {version[0]}')
else:
    print('  No migration applied yet')

print('\n' + '='*60)
print('✅ DATABASE SIAP DIGUNAKAN!')
print('='*60)
print(f'\nConnection String: postgresql://postgres:postgres@localhost:5432/library_db')
print(f'Timestamp: {datetime.now().strftime("%Y-%m-%d %H:%M:%S")}')

conn.close()
