import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const CreateTaskOrSection = () => {
    const [sectionDescription, setSectionDescription] = useState("");
    const [sections, setSections] = useState([]);
    const [taskContent, setTaskContent] = useState("");
    const [selectedSection, setSelectedSection] = useState(null);
    const [dueDate, setDueDate] = useState("");
    const [shouldRepeat, setShouldRepeat] = useState(false);
    const [deleteOnComplete, setDeleteOnComplete] = useState(false);
    const [sectionName, setSectionName] = useState("");
    const [isCreatingTask, setIsCreatingTask] = useState(true); // Toggle between task and section creation
    const navigate = useNavigate();

    useEffect(() => {
        fetchSections();
    }, []);

    const fetchSections = async () => {
        try {
            const response = await fetch("http://localhost:8000/sections");
            const data = await response.json();
            setSections(data);
        } catch (error) {
            console.error("Error fetching sections:", error);
        }
    };

    const handleAddTask = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch("http://localhost:8000/tasks", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    content: taskContent,
                    section_id: selectedSection || null,
                    due_date: dueDate || null,
                    should_repeat: shouldRepeat,
                    delete_on_complete: deleteOnComplete,
                }),
            });
            if (response.ok) {
                alert("Task added successfully!");
                navigate("/tasks"); // Redirect to tasks page
            } else {
                const error = await response.json();
                alert(`Error: ${error.detail}`);
            }
        } catch (error) {
            console.error("Error adding task:", error);
        }
    };

    const handleAddSection = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch("http://localhost:8000/sections", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    name: sectionName,
                    description: sectionDescription || null,
                }),
            });
            if (response.ok) {
                alert("Section added successfully!");
                const updatedSections = await fetch("http://localhost:8000/sections");
                setSections(await updatedSections.json()); // Refresh sections
            } else {
                const error = await response.json();
                alert(`Error: ${error.detail}`);
            }
        } catch (error) {
            console.error("Error adding section:", error);
        }
    };

    return (
        <div>
            <h1>{isCreatingTask ? "Create Task" : "Create Section"}</h1>
            <button onClick={() => setIsCreatingTask(true)}>Create Task</button>
            <button onClick={() => setIsCreatingTask(false)}>Create Section</button>

            {isCreatingTask ? (
                <form onSubmit={handleAddTask}>
                    <input
                        type="text"
                        placeholder="Task content"
                        value={taskContent}
                        onChange={(e) => setTaskContent(e.target.value)}
                        required
                    />
                    <select
                        value={selectedSection}
                        onChange={(e) => setSelectedSection(e.target.value || null)}
                    >
                        <option value={null}>No Section</option>
                        {sections.map((section) => (
                            <option key={section.id} value={section.id}>
                                {section.name}
                            </option>
                        ))}
                    </select>
                    <input
                        type="date"
                        value={dueDate}
                        onChange={(e) => setDueDate(e.target.value)}
                    />
                    <label>
                        <input
                            type="checkbox"
                            checked={shouldRepeat}
                            onChange={(e) => setShouldRepeat(e.target.checked)}
                        />
                        Should Repeat
                    </label>
                    <label>
                        <input
                            type="checkbox"
                            checked={deleteOnComplete}
                            onChange={(e) => setDeleteOnComplete(e.target.checked)}
                        />
                        Delete on Complete
                    </label>
                    <button type="submit">Add Task</button>
                </form>
            ) : (
                <form onSubmit={handleAddSection}>
                    <input
                        type="text"
                        placeholder="Section name"
                        value={sectionName}
                        onChange={(e) => setSectionName(e.target.value)}
                        required
                    />
                    <textarea
                        placeholder="Section description (optional)"
                        value={sectionDescription}
                        onChange={(e) => setSectionDescription(e.target.value)}
                    />
                    <button type="submit">Add Section</button>
                </form>
            )}
        </div>
    );
};

export default CreateTaskOrSection;