import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getTaskById, updateTask, deleteTask } from "../api";
import HierarchyTree from "../components/HierarchyTree";

const TaskDetails = () => {
    const { taskId } = useParams();
    const navigate = useNavigate();
    const [task, setTask] = useState(null);
    const [sections, setSections] = useState([]);
    const [error, setError] = useState(null);
    const [formData, setFormData] = useState({});

    useEffect(() => {
        const fetchTaskAndSections = async () => {
            try {
                const taskData = await getTaskById(taskId);
                setTask(taskData);
                setFormData(taskData);
            } catch (err) {
                setError("Failed to fetch task data.");
                console.error(err);
                return;
            }

            try {
                const response = await fetch("http://localhost:8000/sections");
                if (!response.ok) throw new Error("Failed to fetch sections.");
                const sectionsData = await response.json();
                setSections(sectionsData);
            } catch (err) {
                setError("Failed to fetch sections.");
                console.error(err);
            }
        };

        fetchTaskAndSections();
    }, [taskId]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleDelete = async () => {
        if (window.confirm("Are you sure you want to delete this task?")) {
            try {
                await deleteTask(taskId);
                alert("Task deleted successfully!");
                navigate(-1);
            } catch (error) {
                console.error("Failed to delete task:", error);
                alert("Failed to delete task.");
            }
        }
    };

    const handleCheckboxChange = (e) => {
        const { name, checked } = e.target;
        setFormData({ ...formData, [name]: checked });
    };

    const handleUpdate = async () => {
        try {
            await updateTask(
                taskId,
                formData.content,
                formData.section_id,
                formData.due_date || null,
                formData.should_repeat,
                formData.delete_on_complete,
                formData.completed
            );
            alert("Task updated successfully!");
        } catch (error) {
            console.error("Failed to update task:", error);
            alert("Failed to update task.");
        }
    };

    const handleSelect = (item) => {
        console.log("Selected item:", item);
    };

    if (error) {
        return <div style={styles.error}>{error}</div>;
    }

    if (!task) {
        return <div style={styles.loading}>Loading...</div>;
    }

    return (
        <div style={styles.layout}>
            <HierarchyTree onSelect={handleSelect} />
            <div style={styles.content}>
                <div style={styles.frame}>
                    <h1 style={styles.title}>Edit Task</h1>
                    <div style={styles.field}>
                        <label>Content:</label>
                        <input
                            type="text"
                            name="content"
                            value={formData.content || ""}
                            onChange={handleInputChange}
                            style={styles.input}
                        />
                    </div>
                    <div style={styles.field}>
                        <label>Due Date:</label>
                        <input
                            type="date"
                            name="due_date"
                            value={formData.due_date || ""}
                            onChange={handleInputChange}
                            style={styles.input}
                        />
                    </div>
                    <div style={styles.field}>
                        <label>Section:</label>
                        <select
                            name="section_id"
                            value={formData.section_id || ""}
                            onChange={handleInputChange}
                            style={styles.input}
                        >
                            <option value="">No Section</option>
                            {sections.map((section) => (
                                <option key={section.id} value={section.id}>
                                    {section.name}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div style={styles.field}>
                        <label>Should Repeat:</label>
                        <input
                            type="checkbox"
                            name="should_repeat"
                            checked={formData.should_repeat || false}
                            onChange={handleCheckboxChange}
                            style={styles.checkbox}
                        />
                    </div>
                    <div style={styles.field}>
                        <label>Delete on Complete:</label>
                        <input
                            type="checkbox"
                            name="delete_on_complete"
                            checked={formData.delete_on_complete || false}
                            onChange={handleCheckboxChange}
                            style={styles.checkbox}
                        />
                    </div>
                    <div style={styles.field}>
                        <label>Completed:</label>
                        <input
                            type="checkbox"
                            name="completed"
                            checked={formData.completed || false}
                            onChange={handleCheckboxChange}
                            style={styles.checkbox}
                        />
                    </div>
                    <div style={styles.buttonContainer}>
                        <button style={styles.button} onClick={handleUpdate}>
                            Update
                        </button>
                        <button style={styles.button} onClick={handleDelete}>
                            Delete
                        </button>
                        <button style={styles.button} onClick={() => navigate(-1)}>
                            Back
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

const styles = {
    layout: {
        display: "flex",
    },
    content: {
        flex: 1,
        padding: "20px",
    },
    frame: {
        padding: "20px",
        border: "2px solid goldenrod",
        borderRadius: "10px",
        backgroundColor: "#2e2e3f",
        display: "inline-block",
        textAlign: "left",
    },
    title: {
        fontSize: "2rem",
        marginBottom: "20px",
        textAlign: "center",
    },
    field: {
        marginBottom: "15px",
    },
    input: {
        width: "100%",
        padding: "10px",
        fontSize: "1rem",
        borderRadius: "5px",
        border: "1px solid #ccc",
    },
    checkbox: {
        marginLeft: "10px",
    },
    buttonContainer: {
        marginTop: "20px",
        textAlign: "center",
    },
    button: {
        margin: "0 10px",
        padding: "10px 20px",
        fontSize: "1rem",
        backgroundColor: "goldenrod",
        color: "#1e1e2f",
        border: "none",
        borderRadius: "5px",
        cursor: "pointer",
    },
    error: {
        color: "red",
        textAlign: "center",
    },
    loading: {
        color: "goldenrod",
        textAlign: "center",
    },
};

export default TaskDetails;