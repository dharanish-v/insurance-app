# Insurance Policies Full-Stack Application

## Overview
This is a full-stack web application for viewing and filtering insurance policies, built as part of a take-home challenge.

## Technologies Used
- **Frontend**: React, TypeScript, Vite
- **Backend**: Python, Flask
- **Testing**: Vitest (frontend)

## Prerequisites
- Python 3.8+
- Node.js 14+
- pip
- npm or yarn

## Backend Setup (FastAPI)

### Prerequisites
- Python 3.8+
- pip

### Installation
1. Create a virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows, use `venv\Scripts\activate`
   ```

2. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

### Running the Server
```bash
# Using uvicorn directly
uvicorn main:app --reload --port 8000

# Or using Python
python main.py
```

### API Endpoints
- `GET /api/policies`: Retrieve and filter insurance policies
  - Query Parameters:
    - `name`: Search by policy name
    - `type`: Filter by policy type
    - `min_premium`: Minimum premium
    - `max_premium`: Maximum premium
    - `min_coverage`: Minimum coverage
    - `sort`: Sort by premium (asc/desc)

- `GET /api/policy-types`: Get available policy types

### Swagger Documentation
When the server is running, you can view the interactive API documentation:
- Swagger UI: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc`

## Frontend Setup
1. Navigate to the frontend directory
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the development server:
   ```bash
   npm run dev
   ```
   The frontend will start on `http://localhost:5173`

## Running Tests
Frontend tests:
```bash
npm run test
```

## Features
- Search policies by name
- Filter by policy type
- Filter by premium range
- Filter by minimum coverage
- Sort policies by premium
- Responsive design

## Assumptions and Trade-offs
- Used a simple in-memory dataset
- No persistent database
- Basic error handling
- Minimal styling for clarity

## Potential Improvements
- Add more comprehensive error handling
- Implement pagination
- Add more advanced filtering
- Create more robust unit tests
- Implement user authentication

## License
MIT License