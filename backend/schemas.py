from pydantic import BaseModel
from datetime import datetime

# what is expected when someone signs up
class UserCreate(BaseModel):
    username: str
    email: str
    password: str

# what is sent back after creating user
class UserResponse(BaseModel):
    id: int
    username: str
    email: str

    class Config:
        from_attributes = True

# what is sent back after successful login
class Token(BaseModel):
    access_token: str
    token_type: str

# what is expected when someone logs a workout
class WorkoutCreate(BaseModel):
    exercise: str
    sets: int
    reps: int
    weight: float

# what is sent back after logging a workout
class WorkoutResponse(BaseModel):
    id: int
    exercise: str
    sets: int
    reps: int
    weight: float
    logged_at: datetime

    class Config:
        from_attributes = True
    
class PRResponse(BaseModel):
    id: int
    exercise: str
    weight: float
    achieved_at: datetime

    class Config:
        from_attributes = True

class UserUpdate(BaseModel):
    bodyweight: float
    gender: str

class UserProfileResponse(BaseModel):
    id: int
    username: str
    email: str
    bodyweight: float | None
    gender: str | None

    class Config:
        from_attributes = True