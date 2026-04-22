from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base
from sqlalchemy.orm import sessionmaker

# all data lives in this file
DATABASE_URL = "sqlite:///./liftedup.db"

# opens file and runs operations
engine = create_engine(
    DATABASE_URL, connect_args={"check_same_thread": False}
)

# create new sessions when needed
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# what data models will inherit from
Base = declarative_base()

# helper func routes will use for a db session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
