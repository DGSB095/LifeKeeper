import React from "react";
import { useNavigate } from "react-router-dom";

const TasksAndSections = () => {
    const navigate = useNavigate();

    return (
        <div>
            <h1>Tasks and Sections</h1>
            <button onClick={() => navigate("/create")}>Create</button>
            {/* Add your tasks and sections display logic here */}
        </div>
    );
};

export default TasksAndSections;