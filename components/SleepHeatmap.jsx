'use client';
import { useState, useEffect } from 'react';

export default function SleepHeatmap() {
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSleepData();
  }, []);

  const fetchSleepData = async () => {
    try {
      const response = await fetch('/api/records');
      const result = await response.json();
      
      if (result.records) {
        const heatmapData = {};
        result.records.forEach(record => {
          const date = new Date(record.date).toISOString().split('T')[0];
          heatmapData[date] = record.amount; // hours of sleep
        });
        setData(heatmapData);
      }
    } catch (error) {
      console.error('Error fetching sleep data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getLevel = (hours) => {
    if (hours === 0) return 0;
    if (hours <= 4) return 1;
    if (hours <= 6) return 2;
    if (hours <= 8) return 3;
    return 4;
  };

  const getLevelClass = (level) => {
    const classes = [
      'bg-gray-100',    // No data
      'bg-green-200',   // Level 1
      'bg-green-300',   // Level 2  
      'bg-green-500',   // Level 3
      'bg-green-700'    // Level 4
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
          hours: data[dateStr] || 0
        });
      }
      
      heatmapData.push(weekData);
      
      // Check for month change
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
        <h2 className='text-2xl font-bold mb-4 text-purple-600'>Sleep Heatmap</h2>
        <p>Loading...</p>
      </div>
    );
  }

  const { heatmapData, monthLabels } = generateHeatmapData();
  const weekdays = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

  return (
    <div className='bg-white shadow-lg rounded-lg p-6'>
      <h2 className='text-2xl font-bold mb-4 text-purple-600'>Sleep Activity</h2>
      
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
            const level = getLevel(day.hours);
            return (
              <div
                key={day.date}
                className={`w-4 h-4 rounded-sm ${getLevelClass(level)} border border-gray-200`}
                title={`${day.date}: ${day.hours || 0} hours`}
              />
            );
          })}
        </div>
      </div>
      
      {/* Legend */}
      <div className='flex items-center gap-2 text-xs text-gray-600'>
        <span>Less</span>
        {[0, 1, 2, 3, 4].map(level => (
          <div
            key={level}
            className={`w-3 h-3 rounded-sm ${getLevelClass(level)} border border-gray-200`}
          />
        ))}
        <span>More</span>
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