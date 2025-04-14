import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { resetTmanager } from '../api'; // Import the reset function

const Home = () => {
    const navigate = useNavigate(); // Initialize navigate

    const handleReset = async (e) => {
        e.preventDefault(); // Prevent default link behavior
        try {
            await resetTmanager(); // Call the reset function
            navigate('/tasks'); // Redirect to tasks page
        } catch (error) {
            console.error('Failed to reset database:', error);
        }
    };

    return (
        <div id="root">
            <header>
                <nav className="navbar">
                    <div className="logo">
                        <Link to="/">
                            <img src="test_logo.png" alt="LifeKeeperLogo" />
                            <span>LifeKeeper</span>
                        </Link>
                    </div>
                    <ul className="nav-links">
                        <li><Link to="/tasks">Open a tmanager</Link></li>
                        <li><a onClick={handleReset} href="/tasks">Create a new tmanager</a></li>
                        <li><a href="https://github.com/DGSB095/LifeKeeper/blob/SQL/documentation.md">Documentation</a></li>
                    </ul>
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
                        <h2 className="lifekeeper">LifeKeeper</h2>
                        <p className="lifekeeper-p">LifeKeeper is a simple task manager that helps you keep track of your tasks and manage your time effectively.</p>
                    </div>
                    <ul className="vault-nav-actions">
                        <li><a href="/tasks" onClick={handleReset} className="nav-item"><div className="icon-container"><img className="folder-icon file-icon plus-icon" src="icons/plus.png" alt="Folder Icon" /></div> Create a new tmanager</a></li>
                        <li><a href="tasks/" className="nav-item" onClick={handleReset}><div className="icon-container"><img className="folder-icon file-icon" src="icons/folder.png" alt="Folder Icon" /></div> Create a new tmanager</a></li>
                    </ul>
                </div>
            </main>
        </div>
    );
};

export default Home;