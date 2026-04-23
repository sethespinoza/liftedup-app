from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database import engine
from models import Base
from routers import users, workouts, prs, leaderboard

# reads models and create tables in db
Base.metadata.create_all(bind=engine)

# app instance
# all requests from the server are handled through this object
app = FastAPI()

# allow the frontend to talk to the backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# register routers w/ a prefix
app.include_router(users.router, prefix="/users", tags=["users"])
app.include_router(workouts.router, prefix="/workouts", tags=["workouts"])
app.include_router(prs.router, prefix="/prs", tags=["personal records"])
app.include_router(leaderboard.router, prefix="/leaderboard", tags=["leaderboard"])

# route
# maps URL to a function
@app.get("/")
def home():
    return {"message": "LiftedUp API is running!"}

# dynamic route with path parameter
@app.get("/users/{user_id}")
def get_user(user_id: int):
    return {
        "id": user_id,
        "username": "s3th",
        "flat_bench_pr": 170,
        "hack_squat_pr": 185
    }