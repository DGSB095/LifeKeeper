# LifeKeeper

LifeKeeper is a simple task manager that helps you keep track of your tasks and manage your time effectively.

## Prerequisites

- Python 3.13
- Node.js and npm

## Backend Setup

1. **Clone the repository:**

    ```sh
    git clone https://github.com/DGSB095/LifeKeeper.git
    cd LifeKeeper
    ```

2. **Create and activate a virtual environment:**

    ```sh
    python -m venv venv
    source venv/bin/activate  # On Windows use `venv\Scripts\activate`
    ```

3. **Install the dependencies:**

    ```sh
    pip install -r requirements.txt
    ```

4. **Run the backend server:**

    ```sh
    python app.py
    ```

## Frontend Setup

1. **Navigate to the frontend directory:**

    ```sh
    cd frontend
    ```

2. **Install the dependencies:**

    ```sh
    npm install
    ```

3. **Run the frontend development server:**

    ```sh
    npm start
    ```

## Running Tests

1. **Backend tests:**

    ```sh
    pytest --cov=task_manager --cov-report=html
    ```

2. **Frontend tests:**

    ```sh
    npm test
    ```

## Code Quality

1. **Run Flake8 for linting:**

    ```sh
    flake8 .
    ```

2. **Run Black for code formatting:**

    ```sh
    black .
    ```

## Project Structure