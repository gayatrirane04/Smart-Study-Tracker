'use client';
import { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,ReferenceLine ,ResponsiveContainer } from 'recharts';

export default function SleepChart() {
  const [userProfile, setUserProfile] = useState(null);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSleepData = async () => {
      try {
        const response = await fetch('/api/sleep');
        const result = await response.json();
        
        if (result.entries){
          const chartData = result.entries.slice(0, 7).map(record => ({
            date: new Date(record.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
            hours: record.amount,
            quality: record.text
          }));
          setData(chartData.reverse());
        }
        } catch (error) {
        console.error('Error fetching sleep data:', error);
      } finally {
        setLoading(false);
      } 
    };


    const fetchUserProfile = async () => {
      try {
        const response = await fetch('/api/user/profile');
        const result = await response.json();
        if (result.user) {
          setUserProfile(result.user);
        }
      } catch (error) {
        console.error('Error fetching user profile:', error);
      }
    };

    fetchSleepData();
    fetchUserProfile()
  }, []);

  if (loading) {
    return (
      <div className='bg-white shadow-lg rounded-lg p-6'>
        <h2 className='text-2xl font-bold mb-4 text-purple-600'>Sleep Patterns</h2>
        <p>Loading sleep data...</p>
      </div>
    );
  }

  return (
    <div className='bg-white shadow-lg rounded-lg p-6'>
      <h2 className='text-2xl font-bold mb-4 text-purple-600'>Sleep Patterns</h2>
      <p className='text-gray-600 mb-6'>Your sleep hours over the last 7 days</p>
      
      {data.length === 0 ? (
        <p className='text-gray-500 text-center py-8'>No sleep data available. Start tracking your sleep!</p>
      ) : (
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis 
            domain={[0,userProfile?.sleepGoal ? userProfile.sleepGoal + 2 : 10]}
            label={{ value: 'Hours', angle: -90, position: 'insideLeft' }} />
            <Tooltip 
              formatter={(value, name) => [value + ' hours', 'Sleep Duration']}
              labelFormatter={(label) => `Date: ${label}`}
            />
             {userProfile?.sleepGoal && (
             <ReferenceLine 
              y={userProfile.sleepGoal} 
              stroke="#10b981" 
                strokeDasharray="5 5" 
                label={{ value: `Goal: ${userProfile.sleepGoal}h`, position: 'topRight' }}
                 />
               )} 

            <Bar dataKey="hours" fill="#8b5cf6" radius={[4, 4, 0, 0]} maxBarSize={60} />
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}