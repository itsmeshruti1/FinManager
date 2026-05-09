import uuid
from fastapi import APIRouter, HTTPException
from schemas import CategoryCreate, Category
from database import execute_query
from typing import List

router = APIRouter(prefix="/categories", tags=["Categories"])

@router.post("/", response_model=Category)
def create_category(category: CategoryCreate):
    new_id = str(uuid.uuid4())
    execute_query(
        "INSERT INTO Categories (id, user_id, name, type) VALUES (?, ?, ?, ?)",
        (new_id, category.user_id, category.name, category.type),
        commit=True
    )
    return execute_query("SELECT * FROM Categories WHERE id = ?", (new_id,), fetchone=True)

@router.get("/user/{user_id}", response_model=List[Category])
def get_categories(user_id: str):
    return execute_query("SELECT * FROM Categories WHERE user_id = ?", (user_id,), fetchall=True)
