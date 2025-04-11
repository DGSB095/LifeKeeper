import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import TasksAndSections from './pages/TasksAndSections';
import CreateTaskOrSection from './pages/CreateTaskOrSection';

const App = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/tasks" element={<TasksAndSections />} />
                <Route path="/create" element={<CreateTaskOrSection />} />
            </Routes>
        </Router>
    );
};

export default App;