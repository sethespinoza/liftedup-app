import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import LogWorkout from './pages/LogWorkout';
import Rankings from './pages/Rankings';

function App() {
    const isLoggedIn = !!localStorage.getItem('token');

    return (
        <BrowserRouter>
            <Routes>
                {/* public routes */}
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />

                {/* protected routes — redirect to login if not logged in */}
                <Route path="/dashboard" element={isLoggedIn ? <Dashboard /> : <Navigate to="/login" />} />
                <Route path="/log" element={isLoggedIn ? <LogWorkout /> : <Navigate to="/login" />} />
                <Route path="/rankings" element={isLoggedIn ? <Rankings /> : <Navigate to="/login" />} />

                {/* default route */}
                <Route path="/" element={<Navigate to={isLoggedIn ? "/dashboard" : "/login"} />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;