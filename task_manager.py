from typing import List, Optional
from models import Task

class TaskManager:
    def __init__(self):
        self.tasks = []
        self.next_id = 0

    def add_task(self, task: Task):
        task.id = self.next_id
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

    def update_task(self, id: int, updated_task: Task) -> Optional[Task]:
        for index, task in enumerate(self.tasks):
            if task.id == id:
                self.tasks[index] = updated_task
                return updated_task
        return None