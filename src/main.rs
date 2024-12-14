mod tasks;
mod password_manager;
mod subscriptions;
mod documents;
mod ui;
mod utils;

use chrono::NaiveDate;
use tasks::{TaskManager, Task};

fn main() {
    let mut task_manager = TaskManager::new();

    // Добавление задач
    let time = NaiveDate::from_ymd_opt(2024, 12, 20);
    task_manager.add_task("Complete the project".to_string(), NaiveDate::from_ymd_opt(2024, 12, 20))  ;
    task_manager.add_task("Check email".to_string(), None);

    // Получение всех задач
    let tasks = task_manager.get_all_tasks();
    for task in tasks {
        println!("{:?}", task);
    }

    // Завершение задачи
    task_manager.complete_task(1);

    // Удаление задачи
    task_manager.remove_task(2);
}