from fastapi.middleware.cors import CORSMiddleware
from task_manager import TaskManager
from fastapi import FastAPI, HTTPException
from schemas import TaskSchema, SectionSchema

app = FastAPI()

tmanager = TaskManager()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Frontend URL
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"Hello": "World"}

@app.get("/tasks", response_model=list[dict])
def get_tasks():
    return tmanager.get_tasks()


@app.post("/tasks", response_model=dict)
async def add_task(task: TaskSchema):
    try:
        created_task = tmanager.add_task(task)
        return created_task
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail="Internal Server Error")

@app.get("/tasks/{task_id}", response_model=dict)
def read_task(task_id: int):
    try:
        task = tmanager.get_task(task_id)
        return task
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))

@app.put("/tasks/{task_id}")
def update_task(task_id: int, updated_task: TaskSchema):
    task = tmanager.update_task(task_id, updated_task)
    if task is None:
        raise HTTPException(status_code=404, detail="Task not found")

@app.put("/tasks/{task_id}/complete")
def complete_task(task_id: int):
    try:
        tmanager.complete_task(task_id)
        return {"detail": "Task marked as complete"}
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail="Internal Server Error")

@app.delete("/tasks/{task_id}")
def delete_task(task_id: int):
    task = tmanager.get_task(task_id)
    if task is None:
        raise HTTPException(status_code=404, detail="Task not found")
    tmanager.remove_task(task_id)
    return {"detail": "Task deleted"}

@app.delete("/reset")
def reset():
    try:
        tmanager.reset()
        return {"detail": "Database reset successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail="Internal Server Error")

@app.get("/sections", response_model=list[dict])
def get_sections():
    sections = tmanager.get_sections()
    return [
        {
            "id": section.id,
            "name": section.name,
            "description": section.description,
        }
        for section in sections
    ]

@app.post("/sections")
def create_section(section: SectionSchema):
    try:
        tmanager.add_section(section_name=section.name, section_description=section.description)
        return {"message": "Section created successfully"}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.delete("/sections/{section_name}")
def delete_section(section_name: str):
    tmanager.remove_section(section_name)
    return {"detail": "Section deleted"}

if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="0.0.0.0", port=8000, reload=True)