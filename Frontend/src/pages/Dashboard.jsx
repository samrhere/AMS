import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { useDispatch } from 'react-redux';
import { logoutSuccess } from '../store/userSlice';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const { currentUser } = useSelector((state) => state.user);
  const userId = currentUser?._id; // Use optional chaining to avoid errors if currentUser is undefined
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [leaveRecords, setLeaveRecords] = useState([]);
  const [attendanceStatus, setAttendanceStatus] = useState('');
  const [leaveReason, setLeaveReason] = useState('');
  const [loading, setLoading] = useState(true);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [grade, setGrade] = useState(null);

  useEffect(() => {
    const fetchAttendanceRecords = async () => {
      try {
        const res = await fetch('/api/attendance/get-record');
        const attendanceData = await res.json();

        if (attendanceData.success && Array.isArray(attendanceData.data)) {
          setAttendanceRecords(attendanceData.data);
        } else {
          console.log('attendance data received:', attendanceData);
        }
      } catch (error) {
        console.error('Error fetching attendance records:', error);
      }
    };

    const fetchLeaveRecords = async () => {
      try {
        const res = await fetch('/api/leave/get-leave-record');
        const leaveData = await res.json();
        

        if (leaveData.success && Array.isArray(leaveData.data)) {
          setLeaveRecords(leaveData.data);
        } else {
          console.log('leave data received:', leaveData);
        }
      } catch (error) {
        console.error('Error fetching leave records:', error);
      }
    };

    const fetchGrade = async () => {
      try {
        const res = await fetch('/api/grade/get-student-grades');
        const gradeData = await res.json();
        console.log("Grade data :::: ", gradeData);

        if (gradeData.success && gradeData.data !== undefined) {
          setGrade(gradeData.data);
        } else {
          console.log('Error fetching grade data:', gradeData);
          alert('Failed to fetch grade data');
        }
      } catch (error) {
        console.log('Error fetching grade:', error);
        if (error instanceof SyntaxError) {
          toast.error('Server returned unexpected data. Please try again later.');
        } else {
          toast.error('An error occurred while fetching grades. Please try again.');
        }
      }
    };

    Promise.all([fetchAttendanceRecords(), fetchLeaveRecords(), fetchGrade()])
      .then(() => setLoading(false))
      .catch((err) => {
        console.error('Error loading data:', err);
        toast.error('Failed to load dashboard data');
      });
  }, [userId]);

  const handleMarkAttendance = async () => {
    try {
      const res = await fetch('/api/attendance/mark-attendance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: attendanceStatus, date: new Date().toISOString().split('T')[0] }),
      });

      const data = await res.json();
      

      if (data.success && Array.isArray(data.record)) {
        setAttendanceRecords(prev => [...prev, ...data.record]);
        setAttendanceStatus('');
        alert('Attendance marked successfully!');
      } else {
        console.log('data received:', data);
        toast.error('Error marking attendance: Invalid data received');
      }
    } catch (error) {
      console.log('Error marking attendance:', error);
      toast.error('Failed to mark attendance');
    }
  };

  const handleRequestLeave = async (e) => {
    e.preventDefault();

    const res = await fetch('/api/leave/request-leave', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ reason: leaveReason, LeaveDate: new Date().toISOString().split('T')[0] }),
    });

    const data = await res.json();
    

    if (data.success) {
      setLeaveRecords(prev => [...prev, data.record]);
      setLeaveReason('');
      alert('Leave requested successfully!');
    } else {
      alert(`Error requesting leave: ${data.message}`);
    }
  };

  const handleLogout = async () => {
    try {
      const res = await fetch("/api/auth/logout", {
        method: "POST",
      });
      const data = await res.json();

      if (res.ok) {
        dispatch(logoutSuccess());
        alert("Logging out...");
        navigate("/");
      } else {
        toast.error(data.message || 'Logout failed');
      }
    } catch (error) {
      toast.error(error.message);
    }
  }

  if (loading) {
    return <div className="min-h-screen p-8 bg-gray-100">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navbar */}
      <nav className="bg-blue-600 text-white shadow p-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold">Attendance Management System</h1>
        <div className="relative">
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="text-sm border border-white py-2 px-4 rounded-lg hover:bg-blue-500 "
          >
            Profile
          </button>
          {isMenuOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white text-gray-800 shadow-lg rounded-lg">
              <Link
                to="/edit-profile"
                className="block px-4 py-2 hover:bg-gray-200"
              >
                Edit Profile
              </Link>
              <Link
                to="/"
                className="block px-4 py-2 hover:bg-gray-200"
                onClick={handleLogout}
              >
                Logout
              </Link>
            </div>
          )}
        </div>
      </nav>

      <div className="min-h-screen p-8 bg-gray-100">
        <h1 className="text-3xl font-bold mb-6">User Dashboard</h1>

        {/* Mark Attendance Section */}
        <div className="bg-white p-6 rounded-lg shadow mb-6">
          <h2 className="text-2xl font-semibold mb-4">Mark Attendance</h2>
          <div className="flex items-center space-x-4">
            <select
              className="border border-gray-300 rounded-md p-2 focus:outline-none focus:ring focus:ring-blue-200"
              value={attendanceStatus}
              onChange={(e) => setAttendanceStatus(e.target.value)}
            >
              <option value="" disabled>Select Status</option>
              <option value="Present">Present</option>
              <option value="Absent">Absent</option>
              <option value="Late">Late</option>
            </select>
            <button
              onClick={handleMarkAttendance}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-300"
            >
              Mark Attendance
            </button>
          </div>
        </div>

        {/* Request Leave Section */}
        <div className="bg-white p-6 rounded-lg shadow mb-6">
          <h2 className="text-2xl font-semibold mb-4">Request Leave</h2>
          <form onSubmit={handleRequestLeave} className="space-y-4">
            <textarea
              className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring focus:ring-yellow-200"
              placeholder="Reason for leave"
              value={leaveReason}
              onChange={(e) => setLeaveReason(e.target.value)}
            ></textarea>
            <button
              type="submit"
              className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600 transition duration-300"
            >
              Request Leave
            </button>
          </form>
        </div>

        {/* Attendance Records Section */}
        <div className="bg-white p-6 rounded-lg shadow mb-6">
          <h2 className="text-2xl font-semibold mb-4">Attendance Records</h2>
          {Array.isArray(attendanceRecords) && attendanceRecords.length > 0 ? (
            <ul className="space-y-3">
              {attendanceRecords.map((record, index) => (
                <li key={index} className="p-3 bg-gray-50 rounded shadow">
                  Date: {record.date ? new Date(record.date).toLocaleDateString() : 'N/A'} - Status: {record.status}
                </li>
              ))}
            </ul>
          ) : (
            <p>No attendance records found.</p>
          )}
        </div>

        {/* Leave Records Section */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-2xl font-semibold mb-4">Leave Records</h2>
          {Array.isArray(leaveRecords) && leaveRecords.length > 0 ? (
            <ul className="space-y-3">
              {leaveRecords.map((record, index) => (
                <li key={index} className="p-3 bg-gray-50 rounded shadow">
                  Date: {record.createdAt ? new Date(record.createdAt).toLocaleDateString() : 'N/A'} - Reason: {record.reason}
                </li>
              ))}
            </ul>
          ) : (
            <p>No leave records found.</p>
          )}
        </div>

        {/* Grades Section */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-2xl font-semibold mb-4">Student Grades</h2>
          {grade ? (
            <div className="p-3 bg-gray-50 rounded shadow">
              <p>Grade: {grade.grade}</p>
              <p>Attendance Percentage: {grade.attendancePercentage}%</p>
              <p>Attended Classes: {grade.attendedClasses}</p>
              <p>Total Classes: {grade.totalClasses}</p>
            </div>
          ) : (
            <p>No grades found.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
