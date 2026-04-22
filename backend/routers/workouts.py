from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
from models import Workout, User, PersonalRecord
from schemas import WorkoutCreate, WorkoutResponse
from auth import verify_token
from typing import List

router = APIRouter()

# log a new workout
@router.post("/", response_model=WorkoutResponse)
def log_workout(workout: WorkoutCreate, db: Session = Depends(get_db), current_user: User = Depends(verify_token)):
    new_workout = Workout(
        user_id=current_user.id,
        exercise=workout.exercise,
        sets=workout.sets,
        reps=workout.reps,
        weight=workout.weight
    )
    db.add(new_workout)
    db.commit()
    db.refresh(new_workout)

    # check if this is a new PR for this exercise
    existing_pr = db.query(PersonalRecord).filter(
        PersonalRecord.user_id == current_user.id,
        PersonalRecord.exercise == workout.exercise
    ).first()

    if existing_pr is None:
        # first time logging this exercise (auto PR)
        new_pr = PersonalRecord(
            user_id=current_user.id,
            exercise=workout.exercise,
            weight=workout.weight
        )
        db.add(new_pr)
        db.commit()
    elif workout.weight > existing_pr.weight:
        # new weight is higher (update PR)
        existing_pr.weight = workout.weight
        existing_pr.achieved_at = new_workout.logged_at
        db.commit()
    
    return new_workout

# get all workouts for the logged in user
@router.get("/", response_model=List[WorkoutResponse])
def get_my_workouts(db: Session = Depends(get_db), current_user: User = Depends(verify_token)):
    workouts = db.query(Workout).filter(Workout.user_id == current_user.id).all()
    return workouts

# get all workouts for a specific exercise
@router.get("/{exercise}", response_model=List[WorkoutResponse])
def get_exercise_history(exercise: str, db: Session = Depends(get_db), current_user: User = Depends(verify_token)):
    workouts = db.query(Workout).filter(
        Workout.user_id == current_user.id,
        Workout.exercise == exercise
    ).all()
    if not workouts:
        raise HTTPException(status_code=404, detail="No workouts found for this exercise")
    return workouts