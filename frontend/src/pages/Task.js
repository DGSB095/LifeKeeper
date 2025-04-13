import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getTaskById, updateTask } from "../api";

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

                const response = await fetch("http://localhost:8000/sections");
                const sectionsData = await response.json();
                setSections(sectionsData);
            } catch (err) {
                setError("Failed to fetch data.");
                console.error(err);
            }
        };

        fetchTaskAndSections();
    }, [taskId]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
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
                formData.due_date,
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

    if (error) {
        return <div style={styles.error}>{error}</div>;
    }

    if (!task) {
        return <div style={styles.loading}>Loading...</div>;
    }

    return (
        <div style={styles.container}>
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
                    <button style={styles.button} onClick={() => navigate(-1)}>
                        Back
                    </button>
                </div>
            </div>
        </div>
    );
};

const styles = {
    container: {
        padding: "20px",
        backgroundColor: "#1e1e2f",
        color: "goldenrod",
        borderRadius: "5px",
        textAlign: "center",
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