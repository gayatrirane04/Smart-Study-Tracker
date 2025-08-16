'use client';
import { useState, useEffect } from 'react';

export default function DietHeatmap() {
  const [data, setData] = useState({});
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      // Fetch user profile for calorie target
      const profileResponse = await fetch('/api/user/profile');
      const profileData = await profileResponse.json();
      if (profileData.user) {
        setUserProfile(profileData);
      }

      // Fetch real diet data from API
      const dietResponse = await fetch('/api/diet');
      const dietData = await dietResponse.json();
      
      if (dietData.entries) {
        const heatmapData = {};
        dietData.entries.forEach(entry => {
          const date = new Date(entry.date).toISOString().split('T')[0];
          heatmapData[date] = entry.calories;
        });
        setData(heatmapData);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getIntensity = (calories, target) => {
    if (!calories) return 0;
    if (!target) target = 2200; // Default target
    
    return calories <= target ? 1 : 2; // 1 = within target, 2 = over target
  };

  const getColor = (intensity) => {
    const colors = [
      'bg-gray-100', // No data
      'bg-green-400', // Within target
      'bg-red-400'   // Over target
    ];
    return colors[intensity];
  };

  const generateWeeklyGrid = () => {
    const year = 2025;
    const startDate = new Date(year, 0, 1);
    const endDate = new Date(year, 11, 31);
    
    const firstSunday = new Date(startDate);
    firstSunday.setDate(startDate.getDate() - startDate.getDay());
    
    const weeks = [];
    const currentDate = new Date(firstSunday);
    
    while (currentDate.getFullYear() <= year) {
      const week = [];
      
      for (let day = 0; day < 7; day++) {
        const dateStr = currentDate.toISOString().split('T')[0];
        const isCurrentYear = currentDate.getFullYear() === year;
        
        week.push({
          date: dateStr,
          calories: data[dateStr] || 0,
          isCurrentYear
        });
        
        currentDate.setDate(currentDate.getDate() + 1);
      }
      
      weeks.push(week);
      
      if (currentDate > endDate && currentDate.getFullYear() > year) {
        break;
      }
    }
    
    return weeks;
  };

  if (loading) {
    return (
      <div className='bg-white shadow-lg rounded-lg p-6'>
        <h2 className='text-2xl font-bold mb-4 text-green-600'>Diet Heatmap</h2>
        <p>Loading...</p>
      </div>
    );
  }

  const weeks = generateWeeklyGrid();
  const weekdays = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  return (
    <div className='bg-white shadow-lg rounded-lg p-6'>
      <h2 className='text-2xl font-bold mb-4 text-green-600'>Diet Heatmap 2025</h2>
      
      <div className='flex gap-1'>
        {/* Weekday labels */}
        <div className='flex flex-col gap-1 mr-2 text-xs text-gray-600'>
          <div className='h-3'></div>
          {weekdays.map((day, i) => (
            <div key={i} className='h-3 flex items-center justify-center w-3'>{day}</div>
          ))}
        </div>
        
        {/* Weekly grid */}
        <div className='flex gap-1'>
          {weeks.map((week, weekIndex) => (
            <div key={weekIndex} className='flex flex-col gap-1'>
              {/* Month label */}
              <div className='h-3 text-xs text-gray-600 text-center'>
                {week[0] && new Date(week[0].date).getDate() === 1 ? 
                  months[new Date(week[0].date).getMonth()] : ''}
              </div>
              
              {week.map((day) => {
                const intensity = getIntensity(day.calories, userProfile?.dailyCalories);
                return (
                  <div
                    key={day.date}
                    className={`w-3 h-3 rounded-sm ${getColor(intensity)} ${day.isCurrentYear ? 'border border-gray-200' : 'opacity-30'}`}
                    title={`${day.date}: ${day.calories || 0} calories`}
                  />
                );
              })}
            </div>
          ))}
        </div>
      </div>
      
      {/* Legend */}
      <div className='flex items-center gap-2 text-xs text-gray-600'>
        <span>Within Target</span>
        <div className='w-3 h-3 rounded-sm bg-green-400 border border-gray-200' />
        <div className='w-3 h-3 rounded-sm bg-red-400 border border-gray-200' />
        <span>Over Target</span>
      </div>
      
      <div className='mt-2 text-xs text-gray-500'>
        <p>🎯 Target: {userProfile?.dailyCalories || 2200} calories/day</p>
      </div>
    </div>
  );
}