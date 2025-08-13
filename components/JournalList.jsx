'use client';
import { useState, useEffect } from 'react';
import deleteJournalEntry from '@/app/actions/deleteJournalEntry';

export default function JournalList() {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(null);

  const fetchEntries = async () => {
    try {
      const response = await fetch('/api/journal');
      const data = await response.json();
      if (data.error) {
        console.error('Error fetching entries:', data.error);
      } else {
        setEntries(data.entries || []);
      }
    } catch (err) {
      console.error('Failed to fetch entries:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEntries();
    
    // Listen for new entries
    const handleJournalUpdate = () => {
      fetchEntries();
    };
    
    window.addEventListener('journalUpdated', handleJournalUpdate);
    return () => window.removeEventListener('journalUpdated', handleJournalUpdate);
  }, []);

  if (loading) {
    return (
      <div className='bg-white shadow-lg rounded-lg p-6'>
        <h2 className='text-2xl font-bold mb-4'>Your Entries</h2>
        <p>Loading entries...</p>
      </div>
    );
  }

  const colors = [
    'bg-yellow-200', 
    'bg-pink-200', 
    'bg-blue-200', 
    'bg-green-200',
    'bg-purple-200',
    'bg-orange-200'
  ];

  const handleDelete = async (entryId) => {
    setDeleting(entryId);
    const { error } = await deleteJournalEntry(entryId);
    
    if (error) {
      console.error('Delete error:', error);
    } else {
      // Remove from local state immediately
      setEntries(entries.filter(entry => entry.id !== entryId));
    }
    
    setDeleting(null);
  };

  return (
    <div>
      <h2 className='text-2xl font-bold mb-6 text-center'>Your Notes</h2>
      
      {entries.length === 0 ? (
        <p className='text-gray-600 text-center'>No notes yet. Add your first note!</p>
      ) : (
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'>
          {entries.map((entry, index) => {
            const rotation = (index * 3) % 12 - 6; // More controlled rotation
            return (
              <div 
                key={entry.id} 
                className={`${colors[index % colors.length]} relative p-4 shadow-2xl transform hover:scale-105 hover:shadow-3xl transition-all duration-300 cursor-pointer group`}
                style={{
                  transform: `rotate(${rotation}deg)`,
                  borderRadius: '2px',
                  boxShadow: '0 4px 8px rgba(0,0,0,0.1), 0 6px 20px rgba(0,0,0,0.1)'
                }}
              >
                {/* Tape effect */}
                <div className='absolute -top-2 left-1/2 transform -translate-x-1/2 w-12 h-6 bg-white bg-opacity-60 rounded-sm shadow-sm border border-gray-200'></div>
                
                {/* Delete button */}
                <button
                  onClick={() => handleDelete(entry.id)}
                  disabled={deleting === entry.id}
                  className='absolute top-1 right-1 w-6 h-6 bg-red-500 hover:bg-red-600 text-white rounded-full text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200'
                  title='Delete note'
                >
                  {deleting === entry.id ? '...' : '×'}
                </button>
                
                {/* Note content */}
                <div className='pt-2'>
                  <p className='text-gray-800 mb-3 leading-relaxed font-handwriting text-base'>{entry.content}</p>
                  <p className='text-xs text-gray-600 text-right font-mono'>
                    {new Date(entry.createdAt).toLocaleDateString()}
                  </p>
                </div>
                
                {/* Corner fold effect */}
                <div className='absolute top-0 right-0 w-0 h-0 border-l-[15px] border-b-[15px] border-l-transparent border-b-gray-300 opacity-30'></div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}