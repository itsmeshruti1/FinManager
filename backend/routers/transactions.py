import uuid
from fastapi import APIRouter, HTTPException
from schemas import TransactionCreate, Transaction
from database import execute_query
from typing import List

router = APIRouter(prefix="/transactions", tags=["Transactions"])

@router.post("/", response_model=Transaction)
def create_transaction(transaction: TransactionCreate):
    new_id = str(uuid.uuid4())
    date_str = transaction.date.isoformat()
    execute_query(
        "INSERT INTO Transactions (id, user_id, category_id, amount, type, date, description) VALUES (?, ?, ?, ?, ?, ?, ?)",
        (new_id, transaction.user_id, transaction.category_id, transaction.amount, transaction.type, date_str, transaction.description),
        commit=True
    )
    return execute_query("SELECT * FROM Transactions WHERE id = ?", (new_id,), fetchone=True)

@router.get("/user/{user_id}", response_model=List[Transaction])
def get_transactions(user_id: str):
    return execute_query("SELECT * FROM Transactions WHERE user_id = ? ORDER BY date DESC", (user_id,), fetchall=True)

@router.delete("/{transaction_id}")
def delete_transaction(transaction_id: str):
    execute_query("DELETE FROM Transactions WHERE id = ?", (transaction_id,), commit=True)
    return {"message": "Transaction deleted successfully"}
