'use client';
import { useState, useEffect } from 'react';
import ProfileEditModal from './ProfileEditModal';

export default function QuickInputFAB() {
  const [showMenu, setShowMenu] = useState(false);
  const [activeModal, setActiveModal] = useState(null);

  useEffect(() => {
    const handleEditProfile = () => {
      setActiveModal('profile');
      setShowMenu(false);
    };

    window.addEventListener('editProfile', handleEditProfile);
    return () => window.removeEventListener('editProfile', handleEditProfile);
  }, []);

  const quickInputs = [
    { type: 'sleep', icon: '😴', label: 'Log Sleep', color: 'bg-purple-500' },
    { type: 'food', icon: '🍎', label: 'Log Food', color: 'bg-green-500' },
    { type: 'mood', icon: '😊', label: 'Log Mood', color: 'bg-blue-500' }
  ];

  return (
    <>
      {/* Floating Action Button */}
      <div className='fixed bottom-6 right-6 z-50'>
        <button
          onClick={() => setShowMenu(!showMenu)}
          className='w-14 h-14 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full shadow-lg flex items-center justify-center text-white text-2xl hover:scale-110 transition-transform'
        >
          {showMenu ? '✕' : '+'}
        </button>
        
        {/* Quick Input Menu */}
        {showMenu && (
          <div className='absolute bottom-16 right-0 space-y-3'>
            {quickInputs.map((input) => (
              <button
                key={input.type}
                onClick={() => {
                  setActiveModal(input.type);
                  setShowMenu(false);
                }}
                className={`${input.color} w-12 h-12 rounded-full shadow-lg flex items-center justify-center text-white hover:scale-110 transition-transform`}
              >
                {input.icon}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Quick Modals */}
      {activeModal === 'sleep' && (
        <SleepQuickInput onClose={() => setActiveModal(null)} />
      )}
      {activeModal === 'food' && (
        <FoodQuickInput onClose={() => setActiveModal(null)} />
      )}
      {activeModal === 'mood' && (
        <MoodQuickInput onClose={() => setActiveModal(null)} />
      )}
      {activeModal === 'profile' && (
        <ProfileEditModal onClose={() => setActiveModal(null)} />
      )}
    </>
  );
}

function SleepQuickInput({ onClose }) {
  const [hours, setHours] = useState('');
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!hours) return;
    
    setSaving(true);
    try {
      const response = await fetch('/api/records', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          type: 'SLEEP',
          amount: parseFloat(hours)
        })
      });
      
      if (response.ok) {
        onClose();
        window.location.reload(); // Refresh to show new data
      }
    } catch (error) {
      console.error('Error saving sleep:', error);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'>
      <div className='bg-white rounded-lg p-6 max-w-sm w-full mx-4'>
        <h3 className='text-lg font-bold mb-4'>Quick Sleep Log</h3>
        <div className='space-y-4'>
          <div>
            <label className='block text-sm font-medium mb-2'>Hours slept</label>
            <input
              type='number'
              step='0.5'
              value={hours}
              onChange={(e) => setHours(e.target.value)}
              className='w-full border rounded-md px-3 py-2'
              placeholder='8.5'
              autoFocus
            />
          </div>
          <div className='flex gap-2'>
            <button
              onClick={handleSave}
              disabled={saving || !hours}
              className='flex-1 bg-purple-500 text-white py-2 rounded-md disabled:opacity-50'
            >
              {saving ? 'Saving...' : 'Save'}
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

function FoodQuickInput({ onClose }) {
  const [calories, setCalories] = useState('');
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!calories) return;
    
    setSaving(true);
    try {
      const response = await fetch('/api/diet', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ calories: parseFloat(calories) })
      });
      
      if (response.ok) {
        onClose();
        window.location.reload();
      }
    } catch (error) {
      console.error('Error saving calories:', error);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'>
      <div className='bg-white rounded-lg p-6 max-w-sm w-full mx-4'>
        <h3 className='text-lg font-bold mb-4'>Quick Food Log</h3>
        <div className='space-y-4'>
          <div>
            <label className='block text-sm font-medium mb-2'>Calories</label>
            <input
              type='number'
              value={calories}
              onChange={(e) => setCalories(e.target.value)}
              className='w-full border rounded-md px-3 py-2'
              placeholder='500'
              autoFocus
            />
          </div>
          <div className='flex gap-2'>
            <button
              onClick={handleSave}
              disabled={saving || !calories}
              className='flex-1 bg-green-500 text-white py-2 rounded-md disabled:opacity-50'
            >
              {saving ? 'Saving...' : 'Save'}
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

function MoodQuickInput({ onClose }) {
  const [mood, setMood] = useState('');
  const [saving, setSaving] = useState(false);

  const moods = [
    { value: 10, emoji: '😄', label: 'Excellent' },
    { value: 8, emoji: '😊', label: 'Good' },
    { value: 6, emoji: '😐', label: 'Okay' },
    { value: 4, emoji: '😔', label: 'Low' },
    { value: 2, emoji: '😢', label: 'Bad' }
  ];

  const handleSave = async () => {
    if (!mood) return;
    
    setSaving(true);
    try {
      const response = await fetch('/api/mood', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rating: mood })
      });
      
      if (response.ok) {
        onClose();
        window.location.reload();
      }
    } catch (error) {
      console.error('Error saving mood:', error);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'>
      <div className='bg-white rounded-lg p-6 max-w-sm w-full mx-4'>
        <h3 className='text-lg font-bold mb-4'>Quick Mood Log</h3>
        <div className='space-y-4'>
          <div className='grid grid-cols-5 gap-2'>
            {moods.map((m) => (
              <button
                key={m.value}
                onClick={() => setMood(m.value)}
                className={`p-3 rounded-lg text-center ${
                  mood === m.value ? 'bg-blue-100 border-2 border-blue-500' : 'bg-gray-100'
                }`}
              >
                <div className='text-2xl'>{m.emoji}</div>
                <div className='text-xs'>{m.label}</div>
              </button>
            ))}
          </div>
          <div className='flex gap-2'>
            <button
              onClick={handleSave}
              disabled={saving || !mood}
              className='flex-1 bg-blue-500 text-white py-2 rounded-md disabled:opacity-50'
            >
              {saving ? 'Saving...' : 'Save'}
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