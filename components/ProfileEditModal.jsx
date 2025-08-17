'use client';
import { useState, useEffect } from 'react';

export default function ProfileEditModal({ onClose }) {
  const [formData, setFormData] = useState({
    age: '',
    weight: '',
    height: '',
    gender: '',
    activityLevel: '',
    sleepGoal : ''
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await fetch('/api/user/profile');
      const data = await response.json();
      if (data.user) {
        setFormData({
          age: data.user.age || '',
          weight: data.user.weight || '',
          height: data.user.height || '',
          gender: data.user.gender || '',
          activityLevel: data.user.activityLevel || '',
          sleepGoal: data.user.sleepGoal || ''
        });
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const response = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      if (response.ok) {
        onClose();
        window.location.reload();
      }
    } catch (error) {
      console.error('Error updating profile:', error);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'>
        <div className='bg-white rounded-lg p-6 max-w-md w-full mx-4'>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'>
      <div className='bg-white rounded-lg p-6 max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto'>
        <h3 className='text-lg font-bold mb-4'>Edit Profile</h3>
        <div className='space-y-4'>
          <div>
            <label className='block text-sm font-medium mb-2'>Age</label>
            <input
              type='number'
              value={formData.age}
              onChange={(e) => setFormData({...formData, age: e.target.value})}
              className='w-full border rounded-md px-3 py-2'
            />
          </div>
          <div>
            <label className='block text-sm font-medium mb-2'>Weight (kg)</label>
            <input
              type='number'
              value={formData.weight}
              onChange={(e) => setFormData({...formData, weight: e.target.value})}
              className='w-full border rounded-md px-3 py-2'
            />
          </div>
          <div>
            <label className='block text-sm font-medium mb-2'>Height (cm)</label>
            <input
              type='number'
              value={formData.height}
              onChange={(e) => setFormData({...formData, height: e.target.value})}
              className='w-full border rounded-md px-3 py-2'
            />
          </div>
          <div>
            <label className='block text-sm font-medium mb-2'>Gender</label>
            <select
              value={formData.gender}
              onChange={(e) => setFormData({...formData, gender: e.target.value})}
              className='w-full border rounded-md px-3 py-2'
            >
              <option value=''>Select Gender</option>
              <option value='MALE'>Male</option>
              <option value='FEMALE'>Female</option>
            </select>
          </div>
          <div>
            <label className='block text-sm font-medium mb-2'>Activity Level</label>
            <select
              value={formData.activityLevel}
              onChange={(e) => setFormData({...formData, activityLevel: e.target.value})}
              className='w-full border rounded-md px-3 py-2'
            >
              <option value=''>Select Activity Level</option>
              <option value='SEDENTARY'>Sedentary</option>
              <option value='LIGHTLY_ACTIVE'>Lightly Active</option>
              <option value='MODERATELY_ACTIVE'>Moderately Active</option>
              <option value='VERY_ACTIVE'>Very Active</option>
              <option value='EXTREMELY_ACTIVE'>Extremely Active</option>
            </select>
          </div>
          <div>
            <label className='block text-sm font-medium mb-2'>Sleep Goal (hours)</label>
            <input
              type='number'
              step='0.5'
              min='4'
              max='12'
              value={formData.sleepGoal}
              onChange={(e) => setFormData({...formData, sleepGoal: e.target.value})}
              className='w-full border rounded-md px-3 py-2'
              placeholder='8.0'
            />
          </div>
          <div className='flex gap-2'>
            <button
              onClick={handleSave}
              disabled={saving}
              className='flex-1 bg-blue-500 text-white py-2 rounded-md disabled:opacity-50'
            >
              {saving ? 'Saving...' : 'Update Profile'}
            </button>
            <button
              onClick={onClose}
              className='flex-1 bg-gray-300 py-2 rounded-md'
            >
              Cancel
            </button>

          </div>
        </div>
      </div>
    </div>
  );
}