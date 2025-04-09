import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import TasksAndSections from './pages/TasksAndSections';

const App = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/tasks" element={<TasksAndSections />} />
            </Routes>
        </Router>
    );
};

export default App;