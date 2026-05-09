from pydantic import BaseModel
from typing import Optional
from datetime import datetime, date

class UserBase(BaseModel):
    email: str

class UserCreate(UserBase):
    pass

class User(UserBase):
    id: str
    created_at: datetime
    class Config:
        from_attributes = True

class CategoryBase(BaseModel):
    name: str
    type: str # 'income' or 'expense'

class CategoryCreate(CategoryBase):
    user_id: str

class Category(CategoryBase):
    id: str
    user_id: str
    created_at: datetime
    class Config:
        from_attributes = True

class BudgetBase(BaseModel):
    monthly_limit: float
    month: str

class BudgetCreate(BudgetBase):
    user_id: str
    category_id: str

class Budget(BudgetBase):
    id: str
    user_id: str
    category_id: str
    created_at: datetime
    class Config:
        from_attributes = True

class TransactionBase(BaseModel):
    amount: float
    type: str # 'income' or 'expense'
    date: date
    description: Optional[str] = None

class TransactionCreate(TransactionBase):
    user_id: str
    category_id: Optional[str] = None

class Transaction(TransactionBase):
    id: str
    user_id: str
    category_id: Optional[str]
    created_at: datetime
    class Config:
        from_attributes = True
