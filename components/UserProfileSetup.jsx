'use client';
import { useState } from 'react';

export default function UserProfileSetup({ onComplete }) {
  const [formData, setFormData] = useState({
    weight: '',
    height: '',
    age: '',
    gender: '',
    activityLevel: '',
    sleepGoal : ''
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/user/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        onComplete();
      }
    } catch (error) {
      console.error('Error saving profile:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'>
      <div className='bg-white rounded-lg p-8 max-w-md w-full mx-4'>
        <h2 className='text-2xl font-bold mb-6 text-center bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 bg-clip-text text-transparent'>
          Complete Your Profile
        </h2>
        
        <form onSubmit={handleSubmit} className='space-y-4'>
          <div className='grid grid-cols-2 gap-4'>
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-1'>
                Weight (kg)
              </label>
              <input
                type='number'
                value={formData.weight}
                onChange={(e) => setFormData({...formData, weight: e.target.value})}
                className='w-full border border-gray-300 rounded-md px-3 py-2'
                required
              />
            </div>
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-1'>
                Height (cm)
              </label>
              <input
                type='number'
                value={formData.height}
                onChange={(e) => setFormData({...formData, height: e.target.value})}
                className='w-full border border-gray-300 rounded-md px-3 py-2'
                required
              />
            </div>
          </div>

          <div>
            <label className='block text-sm font-medium text-gray-700 mb-1'>
              Age
            </label>
            <input
              type='number'
              value={formData.age}
              onChange={(e) => setFormData({...formData, age: e.target.value})}
              className='w-full border border-gray-300 rounded-md px-3 py-2'
              required
            />
          </div>

          <div>
            <label className='block text-sm font-medium text-gray-700 mb-1'>
              Gender
            </label>
            <select
              value={formData.gender}
              onChange={(e) => setFormData({...formData, gender: e.target.value})}
              className='w-full border border-gray-300 rounded-md px-3 py-2'
              required
            >
              <option value=''>Select gender</option>
              <option value='Male'>Male</option>
              <option value='Female'>Female</option>
            </select>
          </div>

          <div>
            <label className='block text-sm font-medium text-gray-700 mb-1'>
              Activity Level
            </label>
            <select
              value={formData.activityLevel}
              onChange={(e) => setFormData({...formData, activityLevel: e.target.value})}
              className='w-full border border-gray-300 rounded-md px-3 py-2'
              required
            >
              <option value=''>Select activity level</option>
              <option value='Sedentary'>Sedentary (little/no exercise)</option>
              <option value='Light'>Light (light exercise 1-3 days/week)</option>
              <option value='Moderate'>Moderate (moderate exercise 3-5 days/week)</option>
              <option value='Active'>Active (hard exercise 6-7 days/week)</option>
              <option value='Very Active'>Very Active (very hard exercise, physical job)</option>
            </select>
          </div>

           <div>
            <label className='block text-sm font-medium text-gray-700 mb-1'>
              Sleep Goal (hours)
            </label>
            <input
              type='number'
              value={formData.sleepGoal}
              onChange={(e) => setFormData({...formData, sleepGoal: e.target.value})}
              className='w-full border border-gray-300 rounded-md px-3 py-2'
              required
            />
          </div>

          <button
            type='submit'
            disabled={loading}
            className='w-full bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 hover:from-purple-600 hover:via-pink-600 hover:to-red-600 text-white px-4 py-2 rounded-md font-medium'
          >
            {loading ? 'Saving...' : 'Complete Setup'}
          </button>
        </form>
      </div>
    </div>
  );
}