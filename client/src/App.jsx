import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import CreateActivity from './pages/CreateActivity';
import ActivityDetails from './pages/ActivityDetails';
import MyActivities from './pages/MyActivities';
import Profile from './pages/Profile';
import EditActivity from './pages/EditActivity';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen text-slate-900">
          <Navbar />
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/create-activity" element={<CreateActivity />} />
            <Route path="/activities/:id" element={<ActivityDetails />} />
            <Route path="/activities/:id/edit" element={<EditActivity />} />
            <Route path="/my-activities" element={<MyActivities />} />
            <Route path="/profile" element={<Profile />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
