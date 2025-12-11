import psycopg2

try:
    conn = psycopg2.connect('postgresql://postgres:postgres@localhost:5432/library_db')
    cur = conn.cursor()
    cur.execute("SELECT table_name FROM information_schema.tables WHERE table_schema='public'")
    tables = [row[0] for row in cur.fetchall()]
    
    print('✅ DATABASE library_db AKTIF!')
    print('📊 Tabel yang ada:', tables if tables else 'BELUM ADA (perlu migrasi)')
    
    if tables:
        print('\n📋 Detail tabel:')
        for table in tables:
            print(f'  - {table}')
    
    conn.close()
except psycopg2.OperationalError as e:
    print('❌ PostgreSQL belum running atau database belum dibuat!')
    print(f'Error: {e}')
    print('\nLangkah-langkah:')
    print('1. Install PostgreSQL dari: https://www.postgresql.org/download/windows/')
    print('2. Buat database: psql -U postgres -c "CREATE DATABASE library_db;"')
