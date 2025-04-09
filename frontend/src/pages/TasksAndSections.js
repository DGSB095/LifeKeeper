import React, { useEffect, useState } from 'react';
import * as api from '../api';

const TasksAndSections = () => {
    const [tasks, setTasks] = useState([]);
    const [sections, setSections] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const tasksData = await api.getTasks();
                const sectionsData = await api.getSections();
                setTasks(tasksData);
                setSections(sectionsData);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };
        fetchData();
    }, []);

    return (
        <div id="root">
            <header>
                <nav className="navbar">
                    <div className="logo">
                        <Link to="/">
                            <img src="test_logo.png" alt="ProjectHub Logo" />
                            <span>LifeKeeper</span>
                        </Link>
                    </div>
                    <div className="nav-actions">
                        <button className="sign-in-btn">Sign In</button>
                        <div className="icons">
                            <a href="https://github.com/DGSB095/LifeKeeper" className="github"><img className="github_icon" src="icons/github-mark-white.png" alt="GitHub" /></a>
                            <a href="https://discord.gg/gH9Psux4Yn" className="icon-settings"><img className="discord_icon" src="icons/discord_icon.png" alt="Discord" /></a>
                            <a href="https://x.com/DGSB_DEV" className="icon-group"><img className="x_icon" src="icons/twitter.png" alt="X" /></a>
                            <a href="#" className="icon-bell"><img className="settings_icon" src="icons/setting.png" alt="Settings" /></a>
                        </div>
                    </div>
                </nav>
            </header>
            <main>
                <div className="vault-nav-section">
                    <div className="vault-nav-header">
                        <h2 className="lifekeeper">Tasks and Sections</h2>
                        <p className="lifekeeper-p">View and manage your tasks and sections below.</p>
                    </div>
                    <ul className="vault-nav-actions">
                        <h3>Tasks</h3>
                        {tasks.map((task) => (
                            <li key={task.id}>
                                <a className="nav-item">
                                    <div className="icon-container">
                                        <img className="folder-icon file-icon" src="icons/task.png" alt="Task Icon" />
                                    </div>
                                    {task.name}
                                </a>
                            </li>
                        ))}
                        <h3>Sections</h3>
                        {sections.map((section) => (
                            <li key={section.id}>
                                <a className="nav-item">
                                    <div className="icon-container">
                                        <img className="folder-icon file-icon" src="icons/section.png" alt="Section Icon" />
                                    </div>
                                    {section.name}
                                </a>
                            </li>
                        ))}
                    </ul>
                </div>
            </main>
        </div>
    );
};

export default TasksAndSections;