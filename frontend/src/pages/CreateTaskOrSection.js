import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import HierarchyTree from "../components/HierarchyTree";

const CreateTaskOrSection = () => {
    const navigate = useNavigate(); // For navigation
    const treeRef = useRef();
    const [isCreatingTask, setIsCreatingTask] = useState(true);
    const [taskContent, setTaskContent] = useState("");
    const [selectedSection, setSelectedSection] = useState(null);
    const [dueDate, setDueDate] = useState("");
    const [shouldRepeat, setShouldRepeat] = useState(false);
    const [deleteOnComplete, setDeleteOnComplete] = useState(false);
    const [sectionName, setSectionName] = useState("");
    const [sectionDescription, setSectionDescription] = useState("");
    const [sections, setSections] = useState([]);

    useEffect(() => {
        const fetchSections = async () => {
            try {
                const response = await fetch("http://localhost:8000/sections");
                if (!response.ok) throw new Error("Failed to fetch sections.");
                const data = await response.json();
                setSections(data);
            } catch (error) {
                console.error("Error fetching sections:", error);
            }
        };

        fetchSections();
    }, []);

    const handleAddTask = async (e) => {
        e.preventDefault();
        try {
            await fetch("http://localhost:8000/tasks", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    content: taskContent,
                    section_id: selectedSection || null, // Convert empty string to null
                    due_date: dueDate || null,
                    should_repeat: shouldRepeat,
                    delete_on_complete: deleteOnComplete,
                }),
            });
            alert("Task added successfully!");
        } catch (error) {
            console.error("Error adding task:", error);
            alert("Failed to add task.");
        }
    };

    const handleAddSection = async (e) => {
        e.preventDefault();
        try {
            await fetch("http://localhost:8000/sections", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name: sectionName,
                    description: sectionDescription || null,
                }),
            });
            alert("Section added successfully!");
        } catch (error) {
            console.error("Error adding section:", error);
            alert("Failed to add section.");
        }
    };

    return (
        <div style={styles.layout}>
            <div style={styles.sidebar}>
                <HierarchyTree ref={treeRef} />
            </div>
            <div style={styles.content}>
                <button onClick={() => navigate(-1)} style={styles.backButton}>
                    Back
                </button>
                <h1 className="page-title">{isCreatingTask ? "Create Task" : "Create Section"}</h1>
                <div className="button-group">
                    <button
                        className={`primary-button ${isCreatingTask ? "active" : ""}`}
                        onClick={() => setIsCreatingTask(true)}
                    >
                        Create Task
                    </button>
                    <button
                        className={`primary-button ${!isCreatingTask ? "active" : ""}`}
                        onClick={() => setIsCreatingTask(false)}
                    >
                        Create Section
                    </button>
                </div>

                {isCreatingTask ? (
                    <form className="form-container" onSubmit={handleAddTask}>
                        <input
                            type="text"
                            placeholder="Task content"
                            value={taskContent}
                            onChange={(e) => setTaskContent(e.target.value)}
                            className="form-input"
                            required
                        />
                        <select
                            value={selectedSection}
                            onChange={(e) => setSelectedSection(e.target.value || null)}
                            className="form-input"
                        >
                            <option value="">No Section</option> {/* Set value to an empty string */}
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
                            className="form-input"
                        />
                        <label className="form-label">
                            <input
                                type="checkbox"
                                checked={shouldRepeat}
                                onChange={(e) => setShouldRepeat(e.target.checked)}
                            />
                            Should Repeat
                        </label>
                        <label className="form-label">
                            <input
                                type="checkbox"
                                checked={deleteOnComplete}
                                onChange={(e) => setDeleteOnComplete(e.target.checked)}
                            />
                            Delete on Complete
                        </label>
                        <button type="submit" className="primary-button">
                            Add Task
                        </button>
                    </form>
                ) : (
                    <form className="form-container" onSubmit={handleAddSection}>
                        <input
                            type="text"
                            placeholder="Section name"
                            value={sectionName}
                            onChange={(e) => setSectionName(e.target.value)}
                            className="form-input"
                            required
                        />
                        <textarea
                            placeholder="Section description (optional)"
                            value={sectionDescription}
                            onChange={(e) => setSectionDescription(e.target.value)}
                            className="form-input"
                        />
                        <button type="submit" className="primary-button">
                            Add Section
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
};

const styles = {
    layout: {
        display: "flex",
        height: "100vh",
    },
    sidebar: {
        width: "300px",
        backgroundColor: "#2e2e3f",
        color: "goldenrod",
        borderRight: "1px solid goldenrod",
        overflowY: "auto",
    },
    content: {
        flex: 1,
        padding: "20px",
        backgroundColor: "#1e1e2f",
        color: "goldenrod",
    },
    backButton: {
        marginBottom: "20px",
        padding: "10px 20px",
        fontSize: "1rem",
        backgroundColor: "goldenrod",
        color: "#1e1e2f",
        border: "none",
        borderRadius: "5px",
        cursor: "pointer",
    },
};

export default CreateTaskOrSection;