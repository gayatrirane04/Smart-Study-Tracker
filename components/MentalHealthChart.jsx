'use client';
import { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function MentalHealthChart() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMoodData = async () => {
      try {
        const response = await fetch('/api/mood');
        const result = await response.json();
        
        if (result.entries) {
          const chartData = result.entries.map(entry => ({
            day: new Date(entry.date).toLocaleDateString('en-US', { weekday: 'short' }),
            mood: entry.amount || entry.rating
          }));
          setData(chartData);
        }
      } catch (error) {
        console.error('Error fetching mood data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMoodData();
  }, []);

  if (loading) {
    return (
      <div className='bg-white shadow-lg rounded-lg p-6'>
        <h2 className='text-2xl font-bold mb-4 text-blue-600'>Mental Health Tracking</h2>
        <p>Loading mood data...</p>
      </div>
    );
  }

  return (
    <div className='bg-white shadow-lg rounded-lg p-6'>
      <h2 className='text-2xl font-bold mb-4 text-blue-600'>Mental Health Tracking</h2>
      <p className='text-gray-600 mb-6'>Your mood and energy levels throughout the week (Scale: 1-10)</p>
      
      {data.length === 0 ? (
        <p className='text-gray-500 text-center py-8'>No mood data available. Start tracking your mood!</p>
      ) : (
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="day" />
            <YAxis domain={[0, 10]} label={{ value: 'Rating', angle: -90, position: 'insideLeft' }} />
            <Tooltip 
              formatter={(value, name) => [value + '/10', 'Mood Rating']}
              labelFormatter={(label) => `Day: ${label}`}
            />
            <Bar dataKey="mood" fill="#3b82f6" radius={[4, 4, 0, 0]} maxBarSize={60} />
          </BarChart>
        </ResponsiveContainer>
      )}
      
      <div className='flex gap-4 mt-4 text-sm'>
        <div className='flex items-center gap-2'>
          <div className='w-3 h-3 bg-blue-500 rounded'></div>
          <span>Mood</span>
        </div>
        <div className='flex items-center gap-2'>
          <div className='w-3 h-3 bg-cyan-500 rounded'></div>
          <span>Energy</span>
        </div>
      </div>
      
      <div className='mt-4 text-sm text-gray-600'>
        <p>Tip: Regular sleep and exercise can significantly improve mood and energy levels</p>
      </div>
    </div>
  );
}