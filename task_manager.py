class TaskManager:
    def __init__(self):
        self.tasks = []
        self.sections = {1, 2, 3}  # Example sections

    def add_task(self, task):
        if task.section not in self.sections:
            raise ValueError(f"Section {task.section} does not exist")
        self.tasks.append(task)

    def get_tasks(self):
        return self.tasks

    def get_task(self, task_id):
        for task in self.tasks:
            if task.id == task_id:
                return task
        return None

    def remove_task(self, task_id):
        self.tasks = [task for task in self.tasks if task.id != task_id]

    def update_task(self, task_id, updated_task):
        for i, task in enumerate(self.tasks):
            if task.id == task_id:
                self.tasks[i] = updated_task
                break
