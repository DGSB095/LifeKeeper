import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const HierarchyTree = ({ onSelect }) => {
    const [sections, setSections] = useState([]);
    const [tasks, setTasks] = useState([]);
    const [expanded, setExpanded] = useState({});
    const navigate = useNavigate();

    useEffect(() => {
        fetch("http://localhost:8000/sections")
            .then((res) => res.json())
            .then((data) => setSections(data))
            .catch((err) => console.error("Failed to fetch sections:", err));
        fetch("http://localhost:8000/tasks")
            .then((res) => res.json())
            .then((data) => setTasks(data))
            .catch((err) => console.error("Failed to fetch tasks:", err));
    }, []);

    const toggleExpand = (id) => {
        setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));
    };

    const handleTaskClick = (task) => {
        navigate(`/tasks/${task.id}`);
    };

    const renderTree = () => {
        return (
            <>
                {sections.map((section) => (
                    <div key={section.id} style={{ marginLeft: "10px" }}>
                        <div
                            style={{ cursor: "pointer", fontWeight: "bold" }}
                            onClick={() => toggleExpand(section.id)}
                        >
                            {expanded[section.id] ? "▼" : "▶"} {section.name}
                        </div>
                        {expanded[section.id] &&
                            tasks
                                .filter((task) => task.section_id === section.id)
                                .map((task) => (
                                    <div
                                        key={task.id}
                                        style={{ marginLeft: "20px", cursor: "pointer" }}
                                        onClick={() => handleTaskClick(task)}
                                    >
                                        {task.content}
                                    </div>
                                ))}
                    </div>
                ))}
                {/* No Section */}
                <div style={{ marginLeft: "10px", marginTop: "20px" }}>
                    <div style={{ fontWeight: "bold" }}>No Section</div>
                    {tasks
                        .filter((task) => task.section_id === null)
                        .map((task) => (
                            <div
                                key={task.id}
                                style={{ marginLeft: "20px", cursor: "pointer" }}
                                onClick={() => handleTaskClick(task)}
                            >
                                {task.content}
                            </div>
                        ))}
                </div>
            </>
        );
    };

    return (
        <div style={styles.container}>
            <h3>Hierarchy</h3>
            {renderTree()}
        </div>
    );
};

const styles = {
    container: {
        width: "250px",
        backgroundColor: "#2e2e3f",
        color: "goldenrod",
        padding: "10px",
        borderRight: "3px solid goldenrod",
        overflowY: "auto",
        height: "100vh",
    },
};

export default HierarchyTree;