import React, { useState } from 'react'
import { Link } from 'react-router-dom';

const Register = () => {
    const [formData, setFormData] = useState({
        username: '',
        password: '',
        email: '',
        role: 'student', // Default to 'student'
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('/api/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });
    
            const data = await response.json();
            if (response.ok) {
                alert('Registration successful');
            } else {
                alert(`Registration failed: ${data.message}`);
            }
        } catch (err) {
            alert('Error registering user: ' + err.message);
        }
    };
    return (
        <>
        <nav className="bg-blue-600 text-white shadow p-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold">Attendance Management System</h1>
        
      </nav>
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <form
                onSubmit={handleSubmit}
                className="w-full max-w-md bg-white p-8 rounded-lg shadow-lg"
            >
                <h2 className="text-2xl font-semibold text-center text-gray-700 mb-6">Register</h2>
                <input
                    type="text"
                    placeholder="Username"
                    value={formData.username}
                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                    className="w-full px-4 py-2 mb-4 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                />
                <input
                    type="email"
                    placeholder="Email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-2 mb-4 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="w-full px-4 py-2 mb-4 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                />
                <select
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    className="w-full px-4 py-2 mb-6 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                >
                    <option value="student">Student</option>
                    <option value="admin">Admin</option>
                </select>
                <button
                    type="submit"
                    className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition duration-200"
                >
                    Register
                </button>
                <p className="justify-center text-lg font-semibold mt-2 ml-11">
            Already have an account?{" "}
            <Link to="/login" className=" font-normal text-blue-600">
              Log In
            </Link>
          </p>
            </form>
            
        </div>
        </>
    );
}

export default Register