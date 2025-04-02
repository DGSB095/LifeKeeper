from fastapi import FastAPI, HTTPException
from models import Task
from task_manager import TaskManager

app = FastAPI()
tmanager = TaskManager()


@app.get("/")
def read_root():
    return {"Hello": "World"}


@app.get("/tasks", response_model=list[Task])
def get_tasks():
    return tmanager.get_tasks()


@app.post("/tasks", response_model=Task)
def add_task(task: Task):
    tmanager.add_task(task)
    return task


@app.get("/tasks/{task_id}", response_model=Task)
def read_task(task_id: int):
    task = tmanager.get_task(task_id)
    if task is None:
        raise HTTPException(status_code=404, detail="Task not found")
    return task


@app.put("/tasks/{task_id}", response_model=Task)
def update_task(task_id: int, updated_task: Task):
    task = tmanager.update_task(task_id, updated_task)
    if task is None:
        raise HTTPException(status_code=404, detail="Task not found")
    return task


@app.delete("/tasks/{task_id}")
def delete_task(task_id: int):
    task = tmanager.get_task(task_id)
    if task is None:
        raise HTTPException(status_code=404, detail="Task not found")
    tmanager.remove_task(task_id)
    return {"detail": "Task deleted"}


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="0.0.0.0", port=8000, reload=True)
