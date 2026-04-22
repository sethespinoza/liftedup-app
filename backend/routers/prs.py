from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
from models import PersonalRecord, User
from schemas import PRResponse
from auth import verify_token
from typing import List

router = APIRouter()

# get all personal records for the logged in user
@router.get("/", response_model=List[PRResponse])
def get_my_prs(db: Session = Depends(get_db), current_user: User = Depends(verify_token)):
    prs = db.query(PersonalRecord).filter(PersonalRecord.user_id == current_user.id).all()
    return prs

# get PR for a specific exercise
@router.get("/{exercise}", response_model=PRResponse)
def get_pr_for_exercise(exercise: str, db: Session = Depends(get_db), current_user: User = Depends(verify_token)):
    pr = db.query(PersonalRecord).filter(
        PersonalRecord.user_id == current_user.id,
        PersonalRecord.exercise == exercise
    ).first()
    if not pr:
        raise HTTPException(status_code=404, detail="No PR found for this exercise")
    return pr