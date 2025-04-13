import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../css/tmanager.css"; // Adjust the path as necessary

const TasksAndSections = () => {
    const navigate = useNavigate();
    const [sections, setSections] = useState([]);
    const [tasks, setTasks] = useState([]);
    const [collapsedSections, setCollapsedSections] = useState({});

    useEffect(() => {
        const fetchData = async () => {
            try {
                const sectionsResponse = await fetch("http://localhost:8000/sections");
                const tasksResponse = await fetch("http://localhost:8000/tasks");
                const sectionsData = await sectionsResponse.json();
                const tasksData = await tasksResponse.json();

                sectionsData.sort((a, b) => a.name.localeCompare(b.name));

                setSections(sectionsData);
                setTasks(tasksData);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        fetchData();
    }, []);

    const toggleSection = (sectionId) => {
        setCollapsedSections((prev) => ({
            ...prev,
            [sectionId]: !prev[sectionId],
        }));
    };

    const renderTasksForSection = (sectionId) => {
        return tasks
            .filter((task) => task.section_id === sectionId)
            .map((task) => (
                <li
                    key={task.id}
                    onClick={() => navigate(`/taskdetails/${task.id}`)}
                    style={{ cursor: "pointer", color: "goldenrod", textDecoration: "underline" }}
                >
                    <input type="checkbox" style={{ marginRight: "10px" }} />
                    {task.content} (Due: {task.due_date || "No due date"})
                </li>
            ));
    };

    return (
        <div style={styles.container}>
            <h1 style={styles.title}>Tasks and Sections</h1>
            <button style={styles.button} onClick={() => navigate("/create")}>Create</button>
            <ul style={styles.list}>
                {sections.map((section) => (
                    <li key={section.id} style={styles.listItem}>
                        <div onClick={() => toggleSection(section.id)} style={styles.sectionHeader}>
                            {collapsedSections[section.id] ? "▶" : "▼"} {section.name} - {section.description || "No description"}
                        </div>
                        {!collapsedSections[section.id] && (
                            <ul style={styles.subList}>{renderTasksForSection(section.id)}</ul>
                        )}
                    </li>
                ))}
            </ul>
        </div>
    );
};

const styles = {
    container: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
        backgroundColor: "#1e1e2f", // Updated to match the homepage background
        padding: "20px",
    },
    title: {
        fontSize: "2rem",
        marginBottom: "20px",
        color: "goldenrod", // Updated to match the homepage text color
    },
    button: {
        marginBottom: "20px",
        padding: "10px 20px",
        fontSize: "16px",
        border: "none",
        borderRadius: "5px",
        backgroundColor: "goldenrod", // Updated to match the homepage button color
        color: "#1e1e2f", // Updated to match the homepage button text color
        cursor: "pointer",
    },
    buttonHover: {
        backgroundColor: "#e0b052", // Updated to match the homepage hover effect
    },
    list: {
        listStyleType: "none",
        padding: 0,
        width: "50%",
        backgroundColor: "#1e1e2f", // Updated to match the homepage card background
        borderRadius: "5px",
        boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
    },
    listItem: {
        padding: "10px 15px",
        borderBottom: "1px solid goldenrod", // Updated to match the homepage border color
        color: "goldenrod", // Updated to match the homepage text color
    },
    sectionHeader: {
        cursor: "pointer",
        fontWeight: "bold",
        color: "goldenrod", // Updated to match the homepage accent color
    },
    subList: {
        listStyleType: "none",
        paddingLeft: "20px",
        marginTop: "10px",
        color: "#e0b052", // Updated to match the homepage subtle text color
    },
};

export default TasksAndSections;