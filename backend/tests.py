from sqlalchemy import create_engine


db_url = "postgresql://dgsb:12345pass@db:5432/dgsb_notes"
engine = create_engine(db_url)

try:
    connection = engine.connect()
    print("Connection successful!")
    connection.close()
except Exception as e:
    print(f"Connection failed: {e}")