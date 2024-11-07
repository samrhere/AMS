import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";

const AdminDashboard = () => {
    const { currentUser } = useSelector((state) => state.user);
    console.log(currentUser);

    const [attendances, setAttendances] = useState([]);
    const [leaveRequests, setLeaveRequests] = useState([]);
    const [grades, setGrades] = useState([]);

    const fetchAttendanceRecords = async () => {
        try {
            const response = await fetch("/api/attendance/get-attendances");
            if (!response.ok) {
                throw new Error("Failed to fetch attendance records");
            }
            const data = await response.json();
            if (typeof data === 'object' && Array.isArray(data.data)) {
                setAttendances(data.data);
            } else {
                console.log('data received:', data);
                setAttendances([]);
            }
        } catch (error) {
            console.error(error.message);
            setAttendances([]);
        }
    };

    const fetchLeaveRequests = async () => {
        try {
            const response = await fetch("/api/leave/get-leave-requests");
            if (!response.ok) {
                throw new Error("Failed to fetch leave requests");
            }
            const data = await response.json();
            if (typeof data === 'object' && Array.isArray(data.data)) {
                setLeaveRequests(data.data);
            } else {
                console.log('data received:', data);
                setLeaveRequests([]);
            }
        } catch (error) {
            console.error(error.message);
            setLeaveRequests([]);
        }
    };

    const fetchGrades = async () => {
        try {
            const response = await fetch("/api/grade/get-grades");
            if (!response.ok) {
                throw new Error("Failed to fetch grade records");
            }
            const data = await response.json();
            if (typeof data === 'object' && Array.isArray(data.data)) {
                setGrades(data.data);
            } else {
                console.log('data received:', data);
                setGrades([]);
            }
        } catch (error) {
            console.error(error.message);
            setGrades([]);
        }
    };

    const handleLeaveAction = async (id, action) => {
        try {
            const response = await fetch(`/api/leave/update-status/${id}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ status: action }),
            });
            if (!response.ok) {
                throw new Error('Failed to update leave request');
            }
            const result = await response.json();

            // Refresh the leave requests after updating
            fetchLeaveRequests();
        } catch (error) {
            console.error('Error updating leave request:', error.message);
        }
    };

    useEffect(() => {
        fetchAttendanceRecords();
        fetchLeaveRequests();
        fetchGrades();
    }, []);


    const handleLogout = async () => {
        try {
            const res = await fetch("/api/auth/logout", {
                method: "POST",
            });
            const data = await res.json();

            if (data.success === false) {
                toast.error(data.message);
            }

            dispatch(logoutSuccess());



        } catch (error) {
            toast.error(error.message);
        }
    }

    return (
        <>
            {/* Navbar */}
            <nav className="bg-blue-600 text-white shadow p-4 flex justify-between items-center">
                <h1 className="text-2xl font-bold">Attendance Management System</h1>
                <div className="relative">
                    <Link to="/">
                        <button
                            onClick={handleLogout}
                            className="text-sm border border-white py-2 px-4 rounded-lg hover:bg-blue-500 "
                        >
                            Log out
                        </button>
                    </Link>
                </div>
            </nav>
            <div className="min-h-screen bg-gray-100 p-6">
                <h1 className="text-3xl font-bold mb-4">Admin Dashboard</h1>
                <div className="mb-6">
                    <h2 className="text-2xl mb-2">Attendance Records</h2>
                    <div className="overflow-x-auto">
                        <table className="min-w-full bg-white border">
                            <thead>
                                <tr>
                                    <th className="px-4 py-2 border">Student Name</th>
                                    <th className="px-4 py-2 border">Date</th>
                                    <th className="px-4 py-2 border">Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {Array.isArray(attendances) ? (
                                    attendances.map((record) => (
                                        <tr key={record._id}>
                                            <td className="px-4 py-2 border">{record.studentId?.username || 'Unknown Student'}</td>
                                            <td className="px-4 py-2 border">{record.date ? new Date(record.date).toLocaleDateString() : 'N/A'}</td>
                                            <td className="px-4 py-2 border">{record.status}</td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="3" className="px-4 py-2 border text-center">
                                            No attendance records available
                                        </td>
                                    </tr>
                                )}
                            </tbody>

                        </table>
                    </div>
                </div>

                <div>
                    <h2 className="text-2xl mb-2">Leave Requests</h2>
                    <div className="overflow-x-auto">
                        <table className="min-w-full bg-white border">
                            <thead>
                                <tr>
                                    <th className="px-4 py-2 border">Student Name</th>
                                    <th className="px-4 py-2 border">Date</th>
                                    <th className="px-4 py-2 border">Reason</th>
                                    <th className="px-4 py-2 border">Status</th>
                                    <th className="px-4 py-2 border">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {Array.isArray(leaveRequests) ? (
                                    leaveRequests.map((request) => (
                                        <tr key={request._id}>
                                            <td className="px-4 py-2 border">{request.studentId?.username || 'Unknown Student'}</td>
                                            <td className="px-4 py-2 border">{request.createdAt ? new Date(request.createdAt).toLocaleDateString() : 'N/A'}</td>
                                            <td className="px-4 py-2 border">{request.reason}</td>
                                            <td className="px-4 py-2 border">{request.status}</td>
                                            <td className="px-4 py-2 border flex gap-2">
                                                {request.status === 'Pending' ? (
                                                    <>
                                                        <button
                                                            className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                                                            onClick={() => handleLeaveAction(request._id, 'Approved')}
                                                        >
                                                            Approve
                                                        </button>
                                                        <button
                                                            className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                                                            onClick={() => handleLeaveAction(request._id, 'Rejected')}
                                                        >
                                                            Reject
                                                        </button>
                                                    </>
                                                ) : (
                                                    <span className="text-gray-500">{request.status}</span> // Show current status if not pending
                                                )}
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="5" className="px-4 py-2 border text-center">
                                            No leave requests available
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Grade Records Section */}
            <div>
                <h2 className="text-2xl mb-2">Grade Records</h2>
                <div className="overflow-x-auto">
                    <table className="min-w-full bg-white border">
                        <thead>
                            <tr>
                                <th className="px-4 py-2 border">Student Name</th>
                                <th className="px-4 py-2 border">Attendance Percentage</th>
                                <th className="px-4 py-2 border">Attended classes</th>
                                <th className="px-4 py-2 border">Total classes</th>
                                <th className="px-4 py-2 border">Grade</th>
                            </tr>
                        </thead>
                        <tbody>
                            {Array.isArray(grades) ? (
                                grades.map((record) => {
                                    if (!record.studentId) {
                                        console.warn('Grade record without studentId:', record);
                                    }
                                    return (
                                        <tr key={record._id}>
                                            <td className="px-4 py-2 border">{record.studentId?.username || 'Unknown Student'}</td>
                                            <td className="px-4 py-2 border">{record.attendancePercentage}</td>
                                            <td className="px-4 py-2 border">{record.attendedClasses}</td>
                                            <td className="px-4 py-2 border">{record.totalClasses}</td>
                                            <td className="px-4 py-2 border">{record.grade}</td>
                                        </tr>
                                    );
                                })
                            ) : (
                                <tr>
                                    <td colSpan="5" className="px-4 py-2 border text-center">
                                        No grade records available
                                    </td>
                                </tr>
                            )}
                        </tbody>

                    </table>
                </div>
            </div>
        </>
    );
};

export default AdminDashboard;

