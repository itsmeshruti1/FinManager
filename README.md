<<<<<<< HEAD
# Personal Finance Manager

A modern, full-stack Personal Finance Manager built with a vanilla HTML/CSS/JS frontend and a FastAPI backend powered by Supabase.

## Features

- **Dashboard**: Visual summary of total balance, recent transactions, and spending breakdown (Chart.js).
- **Transactions**: Add, view, and delete income and expenses.
- **Budgets**: Set monthly spending limits per category.
- **Aesthetics**: Clean, minimalist design with a soft nude, crisp white, and ruby red color palette.

## Prerequisites

- Python 3.9+
- A [Supabase](https://supabase.com) account and project.

## Database Setup

1. Go to your Supabase project's SQL Editor.
2. Run the SQL script located in the implementation plan or create the tables manually (`Users`, `Categories`, `Budgets`, `Transactions`). Ensure RLS (Row Level Security) is either configured or disabled for local development.

## Backend Setup

1. Open your terminal and navigate to the `backend` directory:
   ```bash
   cd backend
   ```

2. Create a virtual environment (optional but recommended):
   ```bash
   python -m venv venv
   # Windows:
   venv\Scripts\activate
   # macOS/Linux:
   source venv/bin/activate
   ```

3. Install the required dependencies:
   ```bash
   pip install -r requirements.txt
   ```

4. Configure environment variables:
   - Duplicate the `.env` file or open it.
   - Replace the placeholder values with your actual Supabase URL and Anon Key (found in your Supabase project settings -> API).
   ```env
   SUPABASE_URL="https://your-project-id.supabase.co"
   SUPABASE_KEY="your-anon-key"
   ```

5. Run the server:
   ```bash
   uvicorn main:app --reload
   ```
   The backend API will be available at `http://localhost:8000`.

## Frontend Setup

The frontend is built with pure Vanilla JavaScript, HTML, and CSS, so no build step or node package installation is required.

1. You can serve the `frontend` folder using any simple static file server. For example, using Python's built-in HTTP server:
   ```bash
   cd frontend
   python -m http.server 5500
   ```
2. Open your browser and navigate to `http://localhost:5500/index.html`.

Enjoy managing your finances!
=======
# FinManager
Personal Finance Manager: A modern, fast, and elegantly designed Personal Finance Manager built to help you regain control of your financial health.  Featuring a minimalist, responsive UI and a robust API, this application makes it effortless to log transactions, monitor category-based budgets, and visualize your spending habits in real-time.
>>>>>>> 238feb898d8d0acb0cd50682729fa6b2ae9abc53
