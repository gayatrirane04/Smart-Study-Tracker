'use client';
import { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';

export default function DietChart() {
  const [data, setData] = useState([]);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  const getBarColors = (calories, target) => {
    if (!target) return { fill: '#10b981', stroke: '#059669' };
    if (calories <= target) return { fill: '#86efac', stroke: '#16a34a' }; // Light green fill, dark green border
    return { fill: '#fca5a5', stroke: '#dc2626' }; // Light red fill, dark red border - any overeating
  };

  const chartData = data.map(item => {
    const colors = getBarColors(item.calories, userProfile?.dailyCalories);
    return {
      ...item,
      fill: colors.fill,
      stroke: colors.stroke
    };
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch user profile
        const profileResponse = await fetch('/api/user/profile');
        const profileData = await profileResponse.json();
        if (profileData.user) {
          setUserProfile(profileData);
        }

        // Fetch diet records
        const dietResponse = await fetch('/api/diet');
        const dietData = await dietResponse.json();
        if (dietData.entries) {
          const chartData = dietData.entries.map(entry => ({
            day: new Date(entry.date).toLocaleDateString('en-US', { weekday: 'short' }),
            calories: entry.amount || entry.calories
          }));
          setData(chartData);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className='bg-white shadow-lg rounded-lg p-6'>
      <h2 className='text-2xl font-bold mb-4 text-green-600'>Diet Tracking</h2>
      <p className='text-gray-600 mb-6'>Your daily calorie intake over the week</p>
      
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="day" />
          <YAxis 
            domain={[0, userProfile?.dailyCalories ? userProfile.dailyCalories + 500 : 3000]}
            label={{ value: 'Calories', angle: -90, position: 'insideLeft' }} 
          />
          <Tooltip 
            formatter={(value, name) => [value, name === 'calories' ? 'Calories' : name]}
            labelFormatter={(label) => `Day: ${label}`}
          />
          {userProfile?.dailyCalories && (
            <ReferenceLine 
              y={userProfile.dailyCalories} 
              stroke="#ef4444" 
              strokeDasharray="5 5" 
              label={{ value: `Target: ${userProfile.dailyCalories}`, position: 'topRight' }}
            />
          )}
          <Bar 
            dataKey="calories" 
            radius={[4, 4, 0, 0]}
            strokeWidth={2}
            maxBarSize={60}
          />
        </BarChart>
      </ResponsiveContainer>
      
      <div className='mt-4 space-y-2'>
        {userProfile?.dailyCalories ? (
          <p className='text-sm text-gray-600'>Your daily calorie should be below: <strong>{userProfile.dailyCalories} calories</strong> (BMR: {userProfile.bmr})</p>
        ) : (
          <p className='text-sm text-gray-600'>Complete your profile to see personalized calorie targets</p>
        )}
        
        <div className='flex gap-4 text-xs'>
          <div className='flex items-center gap-1'>
            <div className='w-3 h-3 bg-green-500 rounded'></div>
            <span>healthy</span>
          </div>
          <div className='flex items-center gap-1'>
            <div className='w-3 h-3 bg-red-500 rounded'></div>
            <span>Over eating</span>
          </div>
        </div>
      </div>
    </div>
  );
}