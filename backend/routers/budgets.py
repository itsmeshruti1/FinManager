import uuid
from fastapi import APIRouter, HTTPException
from schemas import BudgetCreate, Budget
from database import execute_query
from typing import List

router = APIRouter(prefix="/budgets", tags=["Budgets"])

@router.post("/", response_model=Budget)
def create_budget(budget: BudgetCreate):
    existing = execute_query(
        "SELECT * FROM Budgets WHERE user_id = ? AND category_id = ? AND month = ?",
        (budget.user_id, budget.category_id, budget.month),
        fetchone=True
    )
    if existing:
        raise HTTPException(status_code=400, detail="Budget already exists for this category and month")
    
    new_id = str(uuid.uuid4())
    execute_query(
        "INSERT INTO Budgets (id, user_id, category_id, monthly_limit, month) VALUES (?, ?, ?, ?, ?)",
        (new_id, budget.user_id, budget.category_id, budget.monthly_limit, budget.month),
        commit=True
    )
    return execute_query("SELECT * FROM Budgets WHERE id = ?", (new_id,), fetchone=True)

@router.get("/user/{user_id}", response_model=List[Budget])
def get_budgets(user_id: str, month: str = None):
    if month:
        return execute_query("SELECT * FROM Budgets WHERE user_id = ? AND month = ?", (user_id, month), fetchall=True)
    return execute_query("SELECT * FROM Budgets WHERE user_id = ?", (user_id,), fetchall=True)
