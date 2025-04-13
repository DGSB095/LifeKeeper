const API_URL = process.env.REACT_APP_API_URL;

export const getTasks = async () => {
    const response = await fetch(`${API_URL}/tasks`);
    if (!response.ok) throw new Error("Failed to fetch tasks");
    return response.json();
};

export const addTask = async (task) => {
    const response = await fetch(`${API_URL}/tasks`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(task),
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