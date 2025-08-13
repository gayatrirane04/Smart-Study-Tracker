'use client';
import { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const RecordChart = () => {
    const [records, setRecords] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchRecords = async () => {
            try {
                const response = await fetch('/api/records');
                const data = await response.json();
                if (data.error) {
                    setError(data.error);
                } else {
                    setRecords(data.records || []);
                }
            } catch (err) {
                setError('Failed to fetch records');
            } finally {
                setLoading(false);
            }
        };
        fetchRecords();
    }, []);

    if (loading) {
        return (
            <div className='bg-white shadow-lg rounded-lg p-8 w-full text-center'>
                <p>Loading chart...</p>
            </div>
        );
    }

    if(error){ // if errors in fetching records
      return(
        <div className='bg-red-100 text-red-800 border border-red-300 rounded-md p-4 text-center'>
            <p>{error}</p>
        </div>
      );
    }

    if(!records || records.length === 0){ // if no records
      return (
      <div className='bg-gray-100 flex items-center justify-center'>
        <div className='bg-white shadow-lg rounded-lg p-8 w-full text-center'>
          <h3 className='text-2xl font-bold mb-4 bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 bg-clip-text text-transparent'>
            No Records Found
          </h3>
          <p className='text-gray-600'>
            Start tracking your study to see your records here.
          </p>
        </div>
      </div>
      );
    }

    return (
      <div className='bg-gray-100 flex items-center justify-center'>
      <div className='bg-white shadow-lg rounded-lg p-8 w-full'>
        <h3 className='text-2xl font-bold text-center mb-6 bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 bg-clip-text text-transparent'>
          Study Pattern
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={records.map((record) => ({
            ...record,
            date: new Date(record.date).toLocaleDateString(),
          }))}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="amount" fill="#8884d8" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
    );
};

export default RecordChart;