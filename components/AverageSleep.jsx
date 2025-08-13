'use client';
import React, { useEffect, useState } from 'react';
import getUserRecord from '@/app/actions/getUserRecords';

const AverageSleep = () =>{
  const[hours,setHours] = useState(0);
  const[minutes,setMinutes] = useState(0);
  const[error,seterror] = useState(null);

  useEffect(() => {
    const fetchUserRecord = async () => {
      try{
        const { record, daysWithRecords } = await getUserRecord();
        const validRecord = record || 0;
        const validDays = daysWithRecords && daysWithRecords > 0 ? daysWithRecords : 1;
        const averageSleep = validRecord / validDays;
        const hrs = Math.floor(averageSleep);
        const mins = Math.round((averageSleep - hrs) * 60); 
        setHours(hrs);
        setMinutes(mins);
     
      }
      catch(err){
        console.error('Error fetching user record:', err);
        seterror('Failed to fetch user record');
        return;
      }
    };

    fetchUserRecord();
  },[]);

  if(error){
    return (
      <div className='bg-gray-100 flex items-center justify-center min-h-screen'>
        <div className='bg-white shadow-lg rounded-lg p-8 w-full max-w-md text-center'>
          <h4 className='text-lg font-medium text-gray-600 mb-2'>Error</h4>
          <p className='text-red-600'>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className='bg-gray-100 flex items-center justify-center'>
      <div className='bg-white shadow-lg rounded-lg p-8 w-full text-center'>
        <h4 className='text-lg font-medium text-gray-600 mb-2'>
          Your Average study Last Month
        </h4>
        <h1 className='sm:text-3xl text-2xl font-bold bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 bg-clip-text text-transparent'>
          {/* display the computed hours and minutes */}
          {hours} hours {minutes} minutes
        </h1>
      </div>
    </div>
  );
};

export default AverageSleep