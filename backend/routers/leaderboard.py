from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
from models import PersonalRecord, User
from auth import verify_token

router = APIRouter()

# strength standards by bodyweight & gender
# format: (max_bodyweight, beginner, novice, intermediate, advanced, elite)
BENCH_STANDARDS_MALE = [
    (110, 53, 84, 125, 173, 226),
    (120, 63, 97, 140, 191, 247),
    (130, 73, 109, 154, 208, 266),
    (140, 83, 121, 169, 224, 285),
    (150, 93, 133, 182, 240, 302),
    (160, 102, 144, 196, 255, 319),
    (170, 112, 155, 209, 270, 336),
    (180, 121, 166, 221, 284, 352),
    (190, 130, 177, 234, 298, 367),
    (200, 139, 187, 246, 312, 382),
    (210, 148, 197, 257, 325, 397),
    (220, 156, 207, 269, 338, 411),
    (230, 165, 217, 280, 350, 425),
    (240, 173, 227, 291, 362, 438),
    (250, 181, 236, 301, 374, 451),
    (260, 190, 245, 312, 386, 464),
    (270, 197, 254, 322, 397, 476),
    (280, 205, 263, 332, 408, 488),
    (290, 213, 272, 341, 419, 500),
    (300, 220, 280, 351, 429, 511),
    (310, 228, 289, 360, 439, 523),
]

BENCH_STANDARDS_FEMALE = [
    (90, 19, 40, 71, 111, 157),
    (100, 23, 46, 79, 121, 169),
    (110, 27, 52, 87, 130, 180),
    (120, 32, 58, 94, 139, 190),
    (130, 36, 63, 101, 148, 200),
    (140, 40, 69, 108, 156, 209),
    (150, 43, 74, 114, 163, 218),
    (160, 47, 79, 120, 170, 227),
    (170, 51, 83, 126, 177, 235),
    (180, 55, 88, 132, 184, 242),
    (190, 58, 93, 137, 191, 250),
    (200, 62, 97, 143, 197, 257),
    (210, 65, 101, 148, 203, 264),
    (220, 68, 105, 153, 209, 270),
    (230, 72, 109, 157, 214, 277),
    (240, 75, 113, 162, 220, 283),
    (250, 78, 117, 167, 225, 289),
    (260, 81, 121, 171, 230, 295),
]

# map exercise names to their standards tables
STANDARDS_MAP = {
    "bench press": (BENCH_STANDARDS_MALE, BENCH_STANDARDS_FEMALE),
}

def get_percentile(weight: float, bodyweight: float, gender: str, exercise: str) -> dict:
    # check if we have standards for this exercise
    exercise_lower = exercise.lower()
    if exercise_lower not in STANDARDS_MAP:
        return None

    male_standards, female_standards = STANDARDS_MAP[exercise_lower]
    standards = male_standards if gender.lower() == "male" else female_standards

    # find the right row based on bodyweight
    row = None
    for standard in standards:
        if bodyweight <= standard[0]:
            row = standard
            break

    if not row:
        return None

    # unpack the standards for this bodyweight
    _, beginner, novice, intermediate, advanced, elite = row

    # calculate percentile based on where weight falls in the standards
    if weight < beginner:
        percentile = round((weight / beginner) * 10, 1)
        level = "below beginner"
    elif weight < novice:
        percentile = round(10 + ((weight - beginner) / (novice - beginner)) * 20, 1)
        level = "beginner"
    elif weight < intermediate:
        percentile = round(30 + ((weight - novice) / (intermediate - novice)) * 20, 1)
        level = "novice"
    elif weight < advanced:
        percentile = round(50 + ((weight - intermediate) / (advanced - intermediate)) * 25, 1)
        level = "intermediate"
    elif weight < elite:
        percentile = round(75 + ((weight - advanced) / (elite - advanced)) * 20, 1)
        level = "advanced"
    else:
        percentile = round(min(95 + ((weight - elite) / elite) * 5, 99), 1)
        level = "elite"

    return {
        "percentile": percentile,
        "level": level,
        "standards": {
            "beginner": beginner,
            "novice": novice,
            "intermediate": intermediate,
            "advanced": advanced,
            "elite": elite
        }
    }

# get percentile ranking for a specific exercise
@router.get("/percentile/{exercise}")
def get_percentile_ranking(
    exercise: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(verify_token)
):
    # user needs bodyweight and gender set for accurate comparison
    if not current_user.bodyweight or not current_user.gender:
        raise HTTPException(
            status_code=400,
            detail="Please update your profile with bodyweight and gender first"
        )

    # get their PR for this exercise
    pr = db.query(PersonalRecord).filter(
        PersonalRecord.user_id == current_user.id,
        PersonalRecord.exercise == exercise.lower()
    ).first()

    if not pr:
        raise HTTPException(
            status_code=404,
            detail=f"No PR found for {exercise} — log a workout first"
        )

    ranking = get_percentile(pr.weight, current_user.bodyweight, current_user.gender, exercise)

    if not ranking:
        raise HTTPException(
            status_code=400,
            detail=f"No strength standards available for {exercise}."
        )

    return {
        "exercise": exercise,
        "your_pr": pr.weight,
        "bodyweight": current_user.bodyweight,
        "gender": current_user.gender,
        "percentile": ranking["percentile"],
        "level": ranking["level"],
        "standards": ranking["standards"]
    }