import os
import psycopg2
from dotenv import load_dotenv

load_dotenv()  # Load environment variables

def get_db_connection():
    if os.getenv("RAILWAY_DB_URL"):  # Check for Railway DB URL
        db_url = os.getenv("RAILWAY_DB_URL")
        print("🔗 Connecting to Railway DB...")  # Debug message
        return psycopg2.connect(db_url) 

    print("🖥️ Connecting to Local DB...")  # Debug message
    return psycopg2.connect(
        dbname=os.getenv("LOCAL_DB_NAME"),
        user=os.getenv("LOCAL_DB_USER"),
        password=os.getenv("LOCAL_DB_PASS"),
        host=os.getenv("LOCAL_DB_HOST"),
        port=os.getenv("LOCAL_DB_PORT")
    )

try:
    conn = get_db_connection()
    print("✅ Database connection successful!")
    conn.close()
except Exception as e:
    print("❌ Database connection failed:", str(e))
