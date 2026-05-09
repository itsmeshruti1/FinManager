FROM python:3.11-slim

WORKDIR /app

# Copy requirements and install
COPY backend/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy backend and frontend folders
COPY backend/ ./backend/
COPY frontend/ ./frontend/

WORKDIR /app/backend

# Cloud Run injects the PORT environment variable
ENV PORT=8080
EXPOSE $PORT

# Start via Python directly to handle signals correctly
CMD ["python", "main.py"]
