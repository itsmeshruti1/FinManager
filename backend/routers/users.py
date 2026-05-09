import uuid
from fastapi import APIRouter, HTTPException
from schemas import UserCreate, User
from database import execute_query

router = APIRouter(prefix="/users", tags=["Users"])

@router.post("/", response_model=User)
def create_user(user: UserCreate):
    new_id = str(uuid.uuid4())
    try:
        execute_query("INSERT INTO Users (id, email) VALUES (?, ?)", (new_id, user.email), commit=True)
    except Exception as e:
        existing = execute_query("SELECT * FROM Users WHERE email = ?", (user.email,), fetchone=True)
        if existing:
            return existing
        raise HTTPException(status_code=400, detail="Error creating user")
    
    return execute_query("SELECT * FROM Users WHERE id = ?", (new_id,), fetchone=True)

@router.get("/{user_id}", response_model=User)
def get_user(user_id: str):
    user = execute_query("SELECT * FROM Users WHERE id = ?", (user_id,), fetchone=True)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user
