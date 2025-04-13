const API_URL = process.env.REACT_APP_API_URL;

export const getTasks = async () => {
    const response = await fetch(`${API_URL}/tasks`);
    if (!response.ok) throw new Error("Failed to fetch tasks");
    return response.json();
};

export const getTaskById = async (taskId) => {
    try {
        const response = await fetch(`${API_URL}/tasks/${taskId}`);
        if (!response.ok) {
            throw new Error(`Error: ${response.statusText}`);
        }
        return await response.json();
    } catch (error) {
        console.error("Error fetching task by ID:", error);
        throw error;
    }
};

export const addTask = async (tcontent, section_id, due_date, should_repeat, delete_on_complete) => {
    const response = await fetch(`${API_URL}/tasks`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            content: tcontent,
            section_id: section_id || null,
            due_date: due_date || null,
            should_repeat: should_repeat || false,
            delete_on_complete: delete_on_complete || false,
            completed: false,
        }),
    });
    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to add task");
    }
    return response.json();
};

export const getSections = async () => {
    const response = await fetch(`${API_URL}/sections`);
    if (!response.ok) throw new Error("Failed to fetch sections");
    return response.json();
};

export const addSection = async (sectionName, sectionDescription) => {
    const response = await fetch(`${API_URL}/sections`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            name: sectionName,
            description: sectionDescription || null,
        }),
    });
    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to add section");
    }
    return response.json();
};

export const completeTask = async (taskId) => {
    try {
        const response = await fetch(`${API_URL}/tasks/${taskId}/complete`, {
            method: "PUT",
        });
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.detail || "Failed to complete task");
        }
        return await response.json();
    } catch (error) {
        console.error("Error completing task:", error);
        throw error;
    }
};

export const updateTask = async (taskId, tcontent, section_id, due_date, should_repeat, delete_on_complete, completed) => {
    try {
        const response = await fetch(`${API_URL}/tasks/${taskId}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                content: tcontent,
                section_id: section_id || null,
                due_date: due_date || null,
                should_repeat: should_repeat || false,
                delete_on_complete: delete_on_complete || false,
                completed: completed || false,
            }),
        });
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.detail || "Failed to update task");
        }
        return await response.json();
    } catch (error) {
        console.error("Error updating task:", error);
        throw error;
    }
};