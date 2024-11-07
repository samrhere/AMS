import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Provider } from 'react-redux'; // Import the Provider component
import store from './store/store'; // Import your Redux store
import Register from './Auth/Register';
import Login from './Auth/Login';
import Dashboard from './pages/dashboard';
import EditProfile from './components/EditProfile';
import AdminDashboard from './pages/AdminDashboard';
import WelcomePage from './pages/WelcomePage';

const App = () => {
  return (
    <Provider store={store}> {/* Wrap everything with the Provider */}
      <Router>
        <Routes>
          <Route path="/" element={<WelcomePage />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/student-dashboard" element={<Dashboard />} />
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
          <Route path="/edit-profile" element={<EditProfile/>} />
        </Routes>
      </Router>
    </Provider>
  );
};

export default App;
