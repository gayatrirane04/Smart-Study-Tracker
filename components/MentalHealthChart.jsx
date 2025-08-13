'use client';
import { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function MentalHealthChart() {
  // Sample data - you can replace with real API later
  const [data] = useState([
    { day: 'Mon', mood: 7, stress: 4, energy: 6 },
    { day: 'Tue', mood: 8, stress: 3, energy: 7 },
    { day: 'Wed', mood: 6, stress: 6, energy: 5 },
    { day: 'Thu', mood: 9, stress: 2, energy: 8 },
    { day: 'Fri', mood: 7, stress: 5, energy: 6 },
    { day: 'Sat', mood: 9, stress: 1, energy: 9 },
    { day: 'Sun', mood: 8, stress: 2, energy: 8 }
  ]);

  return (
    <div className='bg-white shadow-lg rounded-lg p-6'>
      <h2 className='text-2xl font-bold mb-4 text-blue-600'>Mental Health Tracking</h2>
      <p className='text-gray-600 mb-6'>Your mood and energy levels throughout the week (Scale: 1-10)</p>
      
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="day" />
          <YAxis domain={[0, 10]} label={{ value: 'Rating', angle: -90, position: 'insideLeft' }} />
          <Tooltip 
            formatter={(value, name) => [value + '/10', name === 'mood' ? 'Mood' : name === 'stress' ? 'Stress Level' : 'Energy Level']}
            labelFormatter={(label) => `Day: ${label}`}
          />
          <Bar dataKey="mood" fill="#3b82f6" radius={[2, 2, 0, 0]} maxBarSize={30} />
          <Bar dataKey="energy" fill="#06b6d4" radius={[2, 2, 0, 0]} maxBarSize={30} />
        </BarChart>
      </ResponsiveContainer>
      
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
        <p>💡 Tip: Regular sleep and exercise can significantly improve mood and energy levels</p>
      </div>
    </div>
  );
}