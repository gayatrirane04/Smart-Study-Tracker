'use client';
import { useState, useEffect } from 'react';

export default function MoodHeatmap() {
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMoodData();
  }, []);

  const fetchMoodData = async () => {
    try {
      // Fetch real mood data from API
      const response = await fetch('/api/mood');
      const result = await response.json();
      
      if (result.entries) {
        const heatmapData = {};
        result.entries.forEach(entry => {
          const date = new Date(entry.date).toISOString().split('T')[0];
          heatmapData[date] = entry.rating;
        });
        setData(heatmapData);
      }
    } catch (error) {
      console.error('Error fetching mood data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getLevel = (mood) => {
    if (mood === 0) return 0;
    if (mood <= 3) return 1;
    if (mood <= 5) return 2;
    if (mood <= 7) return 3;
    return 4;
  };

  const getLevelClass = (level) => {
    const classes = [
      'bg-gray-100',    // No data
      'bg-blue-200',    // Level 1
      'bg-blue-300',    // Level 2  
      'bg-blue-500',    // Level 3
      'bg-blue-700'     // Level 4
    ];
    return classes[level];
  };

  const generateHeatmapData = () => {
    const today = new Date();
    const weeks = 52;
    const startDate = new Date(today);
    startDate.setDate(today.getDate() - weeks * 7);
    
    const heatmapData = [];
    const monthLabels = [];
    let currentMonth = startDate.getMonth();
    
    monthLabels.push({
      month: startDate.toLocaleDateString('en-US', { month: 'short' }),
      position: 0
    });
    
    for (let w = 0; w < weeks; w++) {
      const weekData = [];
      
      for (let d = 0; d < 7; d++) {
        const date = new Date(startDate);
        date.setDate(startDate.getDate() + w * 7 + d);
        const dateStr = date.toISOString().split('T')[0];
        
        weekData.push({
          date: dateStr,
          mood: data[dateStr] || 0
        });
      }
      
      heatmapData.push(weekData);
      
      const nextWeekDate = new Date(startDate);
      nextWeekDate.setDate(startDate.getDate() + (w + 1) * 7);
      if (nextWeekDate.getMonth() !== currentMonth && w < weeks - 1) {
        monthLabels.push({
          month: nextWeekDate.toLocaleDateString('en-US', { month: 'short' }),
          position: w + 1
        });
        currentMonth = nextWeekDate.getMonth();
      }
    }
    
    return { heatmapData, monthLabels };
  };

  if (loading) {
    return (
      <div className='bg-white shadow-lg rounded-lg p-6'>
        <h2 className='text-2xl font-bold mb-4 text-blue-600'>Mood Heatmap</h2>
        <p>Loading...</p>
      </div>
    );
  }

  const { heatmapData, monthLabels } = generateHeatmapData();
  const weekdays = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

  return (
    <div className='bg-white shadow-lg rounded-lg p-6'>
      <h2 className='text-2xl font-bold mb-4 text-blue-600'>Mood Activity</h2>
      
      {/* Month labels */}
      <div className='flex gap-8 text-xs text-gray-600 mb-2 ml-5'>
        {monthLabels.map((label, i) => (
          <span key={i}>{label.month}</span>
        ))}
      </div>
      
      <div className='flex gap-1'>
        {/* Weekday labels */}
        <div className='flex flex-col gap-1 mr-2 text-xs text-gray-600'>
          {weekdays.map((day, i) => (
            <div key={i} className='h-4 flex items-center justify-center w-4'>
              {i % 2 === 1 ? day : ''}
            </div>
          ))}
        </div>
        
        {/* Heatmap grid */}
        <div className='grid grid-rows-7 grid-flow-col gap-1'>
          {heatmapData.flat().map((day) => {
            const level = getLevel(day.mood);
            return (
              <div
                key={day.date}
                className={`w-4 h-4 rounded-sm ${getLevelClass(level)} border border-gray-200`}
                title={`${day.date}: ${day.mood || 0}/10`}
              />
            );
          })}
        </div>
      </div>
      
      {/* Legend */}
      <div className='flex items-center gap-2 mt-4 text-xs text-gray-600'>
        <span>Less</span>
        {[0, 1, 2, 3, 4].map(level => (
          <div
            key={level}
            className={`w-3 h-3 rounded-sm ${getLevelClass(level)} border border-gray-200`}
          />
        ))}
        <span>More</span>
      </div>
    </div>
  );
}