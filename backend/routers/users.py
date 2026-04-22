from fastapi import APIRouter, Depends, HTTPException
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from database import get_db
from models import User
from schemas import UserCreate, UserResponse, Token, UserUpdate, UserProfileResponse
from auth import hash_password, verify_password, create_access_token, verify_token

router = APIRouter()

# signup endpoint
@router.post("/signup", response_model=UserResponse)
def signup(user: UserCreate, db: Session = Depends(get_db)):
    # check if username already exists
    existing = db.query(User).filter(User.username == user.username).first()
    if existing:
        raise HTTPException(status_code=400, detail="Username already taken")
    # hash password before saving
    new_user = User(
        username=user.username,
        email=user.email,
        hashed_password=hash_password(user.password)
    )
    # save to database
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user

# login endpoint
# OAuth2PasswordRequestForm reads username and password from form data instead of JSON
@router.post("/login", response_model=Token)
def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    # find user in database
    db_user = db.query(User).filter(User.username == form_data.username).first()
    # if user doesn't exist or password is wrong, return error
    if not db_user or not verify_password(form_data.password, db_user.hashed_password):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    # create and return token
    token = create_access_token(data={"sub": db_user.username})
    return {"access_token": token, "token_type": "bearer"}

# update profile endpoint
@router.put("/profile", response_model=UserProfileResponse)
def update_profile(updates: UserUpdate, db: Session = Depends(get_db), current_user: User = Depends(verify_token)):
    # update current user's bodyweight & gender
    current_user.bodyweight = updates.bodyweight
    current_user.gender = updates.gender
    db.commit()
    db.refresh(current_user)
    return current_user