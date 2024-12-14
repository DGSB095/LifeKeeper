use chrono::{NaiveDate, Local};

#[derive(Debug, Clone)]
pub struct Task {
    id: u32,
    title: String,
    due_date: Option<chrono::NaiveDate>,
    completed: bool,
}

impl Task {
    // Создание новой задачи
    pub fn new(id: u32, title: String, due_date: Option<NaiveDate>) -> Self {
        Self {
            id,
            title,
            due_date,
            completed: false,
        }
    }
    pub fn complete(&mut self) {
        self.completed = true;
    }
}

pub struct TaskManager {
    tasks: Vec<Task>,
    next_id: u32,
}

impl  TaskManager {
    // Creating a new task manager
    pub fn new() -> Self {
        Self {
            tasks: Vec::new(),
            next_id: 1,
        }
    }

    pub fn add_task(&mut self, title: String, due_date: Option<NaiveDate>) -> Task {
        let task = Task::new(self.next_id, title, due_date);
        self.tasks.push(task.clone());
        self.next_id += 1;
        task
    }

    pub fn get_all_tasks(&self) -> Vec<Task> {
        self.tasks.clone()
    }

    pub fn complete_task(&mut self, task_id: u32) {
        if let Some(task) = self.tasks.iter_mut().find(|task| task.id == task_id) {
            task.complete();
        }
    }

    pub fn remove_task(&mut self, task_id: u32) {
        self.tasks.retain(|task| task.id != task_id);
    }
}