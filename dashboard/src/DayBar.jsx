import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Bar } from 'react-chartjs-2';
import 'chart.js/auto';

const DailyRecordsChart = ({ Email, month, year }) => {
    const [chartData, setChartData] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('http://localhost:8081/dailyRecords', {
                    params: { Email, month, year }
                });

                // Ensure response data is an array
                if (!Array.isArray(response.data)) {
                    throw new Error('Unexpected response data format');
                }

                const dailyRecords = response.data;
                console.log('dailyRecords:', dailyRecords); // Debug: log the fetched data

                const daysInMonth = new Date(year, month, 0).getDate();

                // Initialize empty arrays for labels and dailyHours
                const labels = [];
                const dailyHours = [];

                // Populate dailyHours and labels only with days that have data
                dailyRecords.forEach(record => {
                    const date = new Date(record.workDate);
                    const day = date.getDate();
                    if (day <= daysInMonth) { // Ensure day is within valid range
                        labels.push(day);
                        dailyHours.push(record.hoursWorked);
                    }
                });

                const totalMonthlyHours = 160; // Assuming 160 hours as the total monthly hours
                const remainingMonthlyHours = Array(labels.length).fill(totalMonthlyHours);

                let remainingHours = totalMonthlyHours;
                dailyHours.forEach((hours, index) => {
                    remainingHours -= hours;
                    for (let i = index; i < labels.length; i++) {
                        remainingMonthlyHours[i] = Math.max(remainingHours, 0);
                    }
                });

                setChartData({
                    labels,
                    datasets: [
                        {
                            label: 'Hours Worked',
                            data: dailyHours,
                            backgroundColor: '#8FE2C3',
                            borderWidth: 1,
                            borderRadius: 10,
                            barThickness: 10,
                        },
                        {
                            label: 'Remaining Monthly Hours',
                            data: remainingMonthlyHours,
                            backgroundColor: '#1C84F1',
                            borderWidth: 1,
                            borderRadius: 10,
                            barThickness: 10,
                        }
                    ]
                });
            } catch (error) {
                console.error('Error fetching daily records:', error);
            }
        };

        fetchData();
    }, [Email, month, year]);

    if (!chartData) {
        return <div>Loading...</div>; // Render loading state while data is being fetched
    }

    return (
        <div style={{ Width: '900px', margin: '0 auto',maxheight:'200px' }}>
            <Bar
                data={chartData}
                options={{
                    responsive: true,
                    plugins: {
                        legend: {
                            display: false, // Display legend
                            labels: {
                                color: '#333', // Legend text color
                                font: {
                                    size: 14,
                                }
                            }
                        },
                        tooltip: {
                            enabled: true, // Enable tooltips
                            backgroundColor: 'rgba(0, 0, 0, 0.7)',
                            titleColor: '#fff',
                            bodyColor: '#fff',
                            cornerRadius: 4,
                            padding: 10
                        }
                    },
                    scales: {
                        x: {
                            title: {
                                display: false, // Display x-axis title
                                text: 'Day of the Month',
                                color: '#333',
                                font: {
                                    size: 16
                                }
                            },
                            grid: {
                                display: false // Remove x-axis grid lines
                            },
                            ticks: {
                                display: false, // Show x-axis labels
                                color: '#333',
                                font: {
                                    size: 14
                                }
                            }
                        },
                        y: {
                            title: {
                                display: false, // Display y-axis title
                                text: 'Hours',
                                color: '#333',
                                font: {
                                    size: 16
                                }
                            },
                            grid: {
                                display: false // Optionally display y-axis grid lines
                            },
                            ticks: {
                                display: false, // Show y-axis labels
                                color: '#333',
                                font: {
                                    size: 14
                                },
                                stepSize: 5, // Set the step size to 10
                                callback: function(value) {
                                    return value; // Ensure y-axis labels display as 10, 20, 30, etc.
                                }
                            },
                            min: 0, // Ensure the y-axis starts at 0
                            max: 160 // Set the max value to 160
                        }
                    },
                    interaction: {
                        mode: 'index',
                        intersect: false
                    },
                    hover: {
                        mode: 'index',
                        intersect: false
                    }
                }}
            />
        </div>
    );
};

export default DailyRecordsChart;
