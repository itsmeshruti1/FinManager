from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import users, categories, budgets, transactions

app = FastAPI(title="Personal Finance Manager API")

# Setup CORS for frontend to communicate with backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins for development
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

import os
from fastapi.staticfiles import StaticFiles

# Include routers
app.include_router(users.router)
app.include_router(categories.router)
app.include_router(budgets.router)
app.include_router(transactions.router)

# Serve static frontend files
frontend_path = os.path.join(os.path.dirname(__file__), "..", "frontend")
app.mount("/", StaticFiles(directory=frontend_path, html=True), name="frontend")

if __name__ == "__main__":
    import uvicorn
    port = int(os.environ.get("PORT", 8080))
    uvicorn.run("main:app", host="0.0.0.0", port=port)
