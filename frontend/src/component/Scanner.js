import React, { useEffect, useState } from 'react';
import { Html5QrcodeScanner } from "html5-qrcode";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import ROLE from '../common/role';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from 'recharts';

function Scanner() {
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
    const [attendanceRecords, setAttendanceRecords] = useState([]);
    const [scanResults, setScanResults] = useState(new Set());
    const [chartData, setChartData] = useState([]);
    const user = useSelector(state => state?.user?.user);
    const navigate = useNavigate();

    // Fetch attendance based on selected date
    async function fetchAttendance() {
        try {
            const response = await fetch(`http://localhost:8080/api/attendance/records/${selectedDate}`);
            const data = await response.json();
            if (response.ok) {
                setAttendanceRecords(data);
            } else {
                toast.error("Failed to fetch attendance records");
            }
        } catch (error) {
            toast.error("Server error. Try again!");
        }
    }

    // Fetch chart data for the past 30 days
    async function fetchChartData() {
        try {
            const days = 30;
            const chartTemp = [];

            for (let i = 0; i < days; i++) {
                const date = new Date();
                date.setDate(date.getDate() - i);
                const formattedDate = date.toISOString().split('T')[0];

                const res = await fetch(`http://localhost:8080/api/attendance/records/${formattedDate}`);
                const data = await res.json();

                chartTemp.push({
                    date: formattedDate,
                    count: res.ok ? data.length : 0,
                });
            }

            setChartData(chartTemp.reverse());
        } catch (error) {
            console.error("Error fetching chart data:", error);
        }
    }
    useEffect(() => {
    if (user?.role == ROLE.INSTRUCTOR) {
      toast.error("You are not authorized to access this page");
      navigate('/admin-panel');
    }
  }, [user, navigate]);


    useEffect(() => {
        fetchAttendance();
        fetchChartData();
    }, [selectedDate]);

    useEffect(() => {
        const scanner = new Html5QrcodeScanner('reader', {
            qrbox: { width: 350, height: 350 },
            fps: 5,
        });

        scanner.render(success, error);

        async function success(result) {
            const scanTime = new Date().toLocaleString();

            if (!scanResults.has(result)) {
                scanResults.add(result);
                setScanResults(new Set(scanResults));

                try {
                    const response = await fetch('http://localhost:8080/api/attendance/mark', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ memberId: result }),
                    });

                    const data = await response.json();
                    if (response.ok) {
                        toast.success(`Attendance marked for ${result}`, {
                            position: "top-right",
                            autoClose: 3000
                        });
                        const beepSound = new Audio('/welcome.wav');
                        beepSound.play();
                    } else {
                        toast.error(data.message || "Error marking attendance");
                    }

                    fetchAttendance();
                    fetchChartData();
                } catch (error) {
                    toast.error("Server error. Try again!");
                }
            }
        }

        function error(err) {
            console.warn(err);
        }

        return () => {
            scanner.clear();
        };
    }, []);

    const downloadReport = () => {
        const doc = new jsPDF();

        const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 15;

  // Header
  // Header styling
    doc.setDrawColor(100, 100, 255);
    doc.setFillColor(245, 245, 255);
    doc.rect(0, 0, pageWidth, 40, 'F');
    
    // Gym information
    doc.setFontSize(16);
    doc.setTextColor(60, 60, 200);
    doc.setFont('helvetica', 'bold');
    doc.text('REAL FITNESS CENTER', margin, 15);
    
    doc.setFontSize(9);
    doc.setTextColor(100, 100, 100);
    doc.setFont('helvetica', 'normal');
    doc.text('No-29/1/1, Light House Road, Dondra', margin, 22);
    doc.text('Phone: 0763356041 | Email: realfitnesscenter@gmail.com', margin, 28);

    // Report title
    doc.setFontSize(14);
    doc.setTextColor(40, 40, 40);
    doc.setFont('helvetica', 'bold');
    doc.text('Supply Maintenance Report', pageWidth - margin, 15, { align: 'right' });




        const tableColumn = ["No.", "Member ID", "Scan Time"];
        const tableRows = attendanceRecords.map((entry, index) => [
            index + 1,
            entry.memberId,
            new Date(entry.scanTime).toLocaleString()
        ]);

        autoTable(doc, { startY: 35, head: [tableColumn], body: tableRows });
        doc.save(`Attendance_Report_${selectedDate}.pdf`);
    };

    return (
        <div className="flex flex-col items-center p-4 bg-gray-100 min-h-screen">
            <h2 className="text-2xl font-semibold mb-4">QR Code Scanner</h2>

            <div id="reader" className="mb-6 w-96 h-96 border-2 border-gray-300 shadow-md rounded-lg"></div>

            <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="mb-4 p-2 border border-gray-300 rounded-lg shadow-sm mt-10"
            />

            <h3 className="text-lg font-semibold mb-2">Attendance for {selectedDate}</h3>
            {attendanceRecords.length === 0 ? (
                <p className="text-gray-500">No attendance records for this date.</p>
            ) : (
                <table className="w-full max-w-lg border-collapse border border-gray-300 shadow-md rounded-lg">
                    <thead>
                        <tr className="bg-gray-200">
                            <th className="border p-2"></th>
                            <th className="border p-2">Member</th>
                            <th className="border p-2">Date & Time</th>
                        </tr>
                    </thead>
                    <tbody>
                        {attendanceRecords.map((entry, index) => (
                            <tr key={index} className="bg-white">
                                <td className="border p-2 text-center">{index + 1}</td>
                                <td className="border p-2">{entry.memberId}</td>
                                <td className="border p-2">{new Date(entry.scanTime).toLocaleString()}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}

            <button
                onClick={downloadReport}
                className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg shadow"
            >
                Download Report
            </button>

            <h3 className="text-lg font-semibold mt-10 mb-2">Attendance Overview (Last 30 Days)</h3>
            <div className="w-full max-w-3xl h-64">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis allowDecimals={false} />
                        <Tooltip />
                        <Bar dataKey="count" fill="#3b82f6" />
                    </BarChart>
                </ResponsiveContainer>
            </div>

            <ToastContainer />
        </div>
    );
}

export default Scanner;
