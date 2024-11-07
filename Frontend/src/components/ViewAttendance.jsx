import React, { useState, useEffect } from 'react';
//import api from '../api';

function ViewAttendance() {
  const [attendanceRecords, setAttendanceRecords] = useState([]);

  useEffect(() => {
    const fetchAttendance = async () => {
      try {
        //const response = await api.get('/attendance');
        setAttendanceRecords(response.data);
      } catch (error) {
        alert('Error fetching attendance records');
      }
    };

    fetchAttendance();
  }, []);

  return (
    <div className="min-h-screen p-8 bg-gray-100">
      <h2 className="text-2xl font-bold mb-4">Attendance Records</h2>
      <table className="w-full bg-white shadow-lg rounded-lg">
        <thead>
          <tr className="bg-gray-200">
            <th className="p-4 text-left">Date</th>
            <th className="p-4 text-left">Status</th>
          </tr>
        </thead>
        <tbody>
          {attendanceRecords.map((record, index) => (
            <tr key={index} className="border-b">
              <td className="p-4">{record.date}</td>
              <td className="p-4">{record.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ViewAttendance;
