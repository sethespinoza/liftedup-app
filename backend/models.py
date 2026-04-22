from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime
from database import Base

# class = table in db, variable = column in table
class User(Base):
    __tablename__ = "users" # table name in db

    id = Column(Integer, primary_key=True, index=True) # every user gets unique ID
    username = Column(String, unique=True, index=True) # no 2 users can have same username
    email = Column(String, unique=True, index=True)
    hashed_password = Column(String) # hash passwords
    created_at = Column(DateTime, default=datetime.utcnow) # auto set when users sign up
    bodyweight = Column(Float, nullable=True) # in lbs
    gender = Column(String, nullable=True) # "male" or "female"

    # links user to their workouts (multiple possible for one user)
    workouts = relationship("Workout", back_populates="user")
    
    personal_records = relationship("PersonalRecord", back_populates="user")


class Workout(Base):
    __tablename__ = "workouts"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id")) # ties each workout to specific user
    exercise = Column(String) # e.g. "bench press"
    sets = Column(Integer) # e.g. 3
    reps = Column(Integer) # e.g. 8
    weight = Column(Float) # e.g. 185.0 lbs
    logged_at = Column(DateTime, default=datetime.utcnow)

    # each workout knows who it belongs to
    user = relationship("User", back_populates="workouts")

class PersonalRecord(Base):
    __tablename__ = "personal_records"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    exercise = Column(String)
    weight = Column(Float) # best weight logged for this exercise
    achieved_at = Column(DateTime, default=datetime.utcnow)

    # each PR knows who it belongs to
    user = relationship("User", back_populates="personal_records")
