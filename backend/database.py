import sqlite3
from typing import List, Dict, Any

DB_FILE = "finance.db"

def dict_factory(cursor, row):
    d = {}
    for idx, col in enumerate(cursor.description):
        d[col[0]] = row[idx]
    return d

def get_db():
    conn = sqlite3.connect(DB_FILE, check_same_thread=False)
    conn.row_factory = dict_factory
    return conn

def init_db():
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS Users (
            id TEXT PRIMARY KEY,
            email TEXT UNIQUE NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    """)

    cursor.execute("""
        CREATE TABLE IF NOT EXISTS Categories (
            id TEXT PRIMARY KEY,
            user_id TEXT,
            name TEXT NOT NULL,
            type TEXT NOT NULL CHECK(type IN ('income', 'expense')),
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY(user_id) REFERENCES Users(id) ON DELETE CASCADE
        )
    """)
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS Budgets (
            id TEXT PRIMARY KEY,
            user_id TEXT,
            category_id TEXT,
            monthly_limit REAL NOT NULL,
            month TEXT NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY(user_id) REFERENCES Users(id) ON DELETE CASCADE,
            FOREIGN KEY(category_id) REFERENCES Categories(id) ON DELETE CASCADE,
            UNIQUE(user_id, category_id, month)
        )
    """)
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS Transactions (
            id TEXT PRIMARY KEY,
            user_id TEXT,
            category_id TEXT,
            amount REAL NOT NULL,
            type TEXT NOT NULL CHECK(type IN ('income', 'expense')),
            date TEXT NOT NULL,
            description TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY(user_id) REFERENCES Users(id) ON DELETE CASCADE,
            FOREIGN KEY(category_id) REFERENCES Categories(id) ON DELETE SET NULL
        )
    """)
    conn.commit()
    conn.close()

def execute_query(query: str, params: tuple = (), fetchone: bool = False, fetchall: bool = False, commit: bool = False):
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute(query, params)
    result = None
    if fetchone:
        result = cursor.fetchone()
    elif fetchall:
        result = cursor.fetchall()
    
    if commit:
        conn.commit()
    conn.close()
    return result

init_db()
