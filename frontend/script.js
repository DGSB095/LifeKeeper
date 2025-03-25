document.addEventListener("DOMContentLoaded", () => {
    const taskForm = document.getElementById("task-form");
    const taskContent = document.getElementById("task-content");
    const tasksDiv = document.getElementById("tasks");

    async function fetchTasks() {
        const response = await fetch("/tasks");
        const tasks = await response.json();
        displayTasks(tasks);
    }

    function displayTasks(tasks) {
        tasksDiv.innerHTML = "";
        tasks.forEach(task => {
            const taskCard = document.createElement("div");
            taskCard.className = "task-card";
            taskCard.textContent = task.content;
            tasksDiv.appendChild(taskCard);
        });
    }

    async function addTask(event) {
        event.preventDefault();
        const content = taskContent.value;
        const response = await fetch("/tasks", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ content })
        });
        if (response.ok) {
            taskContent.value = "";
            fetchTasks();
        }
    }

    taskForm.addEventListener("submit", addTask);
    fetchTasks();
});