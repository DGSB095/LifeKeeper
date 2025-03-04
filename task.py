import json
import pathlib
import sqlite3
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List, Optional

app = FastAPI()

class Task(BaseModel):
    id: int
    content: str
    section: int
    due_date: Optional[str] = None
    should_repeat: Optional[str] = None
    completed: bool = False
    delete_on_complete: bool = True

class Section(BaseModel):
    name: str

class TaskManager:
    def __init__(self):
        self.tasks = []
        self.sections = []
        self.next_id = 0

    def add_task(self, task: Task):
        self.tasks.append(task)
        self.next_id += 1

    def remove_task(self, id: int):
        self.tasks = [task for task in self.tasks if task.id != id]

    def get_task(self, id: int) -> Optional[Task]:
        for task in self.tasks:
            if task.id == id:
                return task
        return None

    def get_tasks(self) -> List[Task]:
        return self.tasks

    def add_section(self, section: str):
        if section not in self.sections:
            self.sections.append(section)

    def remove_section(self, section_id: int):
        if 0 <= section_id < len(self.sections):
            self.sections.pop(section_id)

    def edit_section(self, section_id: int, new_section: str):
        if 0 <= section_id < len(self.sections):
            self.sections[section_id] = new_section

    def read_data_from_tmanager_file(self, path_to_vault):
        dotlifekeeper_path = path_to_vault + "/.lifekeeper"
        tmanager_conn = sqlite3.connect(dotlifekeeper_path + "/tmanager.db")
        cursor = tmanager_conn.cursor()

        cursor.execute("SELECT section_name FROM Sections")
        self.sections = [row[0] for row in cursor.fetchall()]

        cursor.execute(
            "SELECT task_id, completed, task_name, task_content, section_id, due_date, should_repeat, delete_on_complete FROM Tasks")
        self.tasks = []
        for row in cursor.fetchall():
            task = Task(
                id=row[0],
                completed=row[1],
                content=row[3],
                section=row[4],
                due_date=row[5],
                should_repeat=row[6],
                delete_on_complete=row[7]
            )
            self.tasks.append(task)

        self.next_id = max(task.id for task in self.tasks) + 1 if self.tasks else 0

        tmanager_conn.close()
        
        

    def create_tmanager_file(self, path, tmanager_name):
            pathlib.Path(path + "/" + tmanager_name).mkdir(parents=True, exist_ok=False)
            pathlib.Path(path + "/" + tmanager_name + "/.lifekeeper").mkdir(parents=True, exist_ok=False)
            dotlifekeeper_path = path + "/" + tmanager_name + "/.lifekeeper"
            tmanager_con = sqlite3.connect(dotlifekeeper_path + "/tmanager.db")
            cursor = tmanager_con.cursor()
            cursor.execute('''
            CREATE TABLE IF NOT EXISTS Sections (
            section_name TEXT PRIMARY KEY)''')
            cursor.execute('''
            CREATE TABLE IF NOT EXISTS Tasks (
            task_id INTEGER PRIMARY KEY,
            completed BOOL,
            task_name TEXT,
            task_content TEXT,
            section_id INTEGER,
            due_date TEXT,
            should_repeat BOOL,
            delete_on_complete BOOL
            )''')
            tmanager_con.close()

    def write_data_to_tmanager_file(self, path_to_tmanager):
        dotlifekeeper_path = path_to_tmanager + "/.lifekeeper"
        tmanager_conn = sqlite3.connect(dotlifekeeper_path + "/tmanager.db")
        cursor = tmanager_conn.cursor()

        # Clear existing data
        cursor.execute("DELETE FROM Sections")
        cursor.execute("DELETE FROM Tasks")

        # Insert sections
        for section in self.sections:
            cursor.execute("INSERT INTO Sections (section_name) VALUES (?)", (section,))

        # Insert tasks
        for task in self.tasks:
            cursor.execute('''INSERT OR REPLACE INTO Tasks (task_id, completed, task_name, task_content, section_id, due_date, should_repeat, delete_on_complete)
                              VALUES (?, ?, ?, ?, ?, ?, ?, ?)''',
                           (task.id, task.completed, task.content, task.content, task.section, task.due_date,
                            task.should_repeat, task.delete_on_complete))

        tmanager_conn.commit()
        tmanager_conn.close()

tmanager = TaskManager()

@app.post("/tasks/")
def create_task(task: Task):
    tmanager.add_task(task)
    return task

@app.get("/tasks/", response_model=List[Task])
def read_tasks():
    return tmanager.get_tasks()

@app.get("/tasks/{task_id}", response_model=Task)
def read_task(task_id: int):
    task = tmanager.get_task(task_id)
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

@app.post("/sections/")
def create_section(section: Section):
    tmanager.add_section(section.name)
    return section

@app.get("/sections/", response_model=List[str])
def read_sections():
    return tmanager.sections

@app.delete("/sections/{section_id}")
def delete_section(section_id: int):
    if section_id >= len(tmanager.sections) or section_id < 0:
        raise HTTPException(status_code=404, detail="Section not found")
    tmanager.remove_section(section_id)
    return {"detail": "Section deleted"}

@app.put("/sections/{section_id}")
def update_section(section_id: int, section: Section):
    if section_id >= len(tmanager.sections) or section_id < 0:
        raise HTTPException(status_code=404, detail="Section not found")
    tmanager.edit_section(section_id, section.name)
    return section
