'use client';
import { useState, useRef } from 'react';
import addJournalEntry from '@/app/actions/addJournalEntry';

export default function JournalForm() {
  const formRef = useRef(null);
  const [content, setContent] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [alertMessage, setAlertMessage] = useState(null);
  const [alertType, setAlertType] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const clientAction = async (formData) => {
    setIsLoading(true);
    setAlertMessage(null);

    const { error } = await addJournalEntry(formData);
    
    if (error) {
      setAlertMessage(`Error: ${error}`);
      setAlertType('error');
    } else {
      setAlertMessage('Note saved!');
      setAlertType('success');
      setContent('');
      setShowForm(false);
      // Trigger refresh of journal list
      window.dispatchEvent(new CustomEvent('journalUpdated'));
    }

    setIsLoading(false);
  };

  return (
    <div className='max-w-md mx-auto'>
      <button
        onClick={() => setShowForm(!showForm)}
        className='w-full bg-yellow-200 hover:bg-yellow-300 border-2 border-yellow-400 rounded-lg p-6 shadow-lg transform hover:rotate-1 transition-all duration-200 cursor-pointer'
      >
        <div className='text-center'>
          <span className='text-4xl mb-2 block'>📝</span>
          <span className='text-lg font-medium text-gray-700'>save your thoughts!</span>
        </div>
      </button>

      {showForm && (
        <div className='mt-4 bg-yellow-100 relative p-4 shadow-2xl transform rotate-1' style={{borderRadius: '2px', boxShadow: '0 4px 8px rgba(0,0,0,0.1), 0 6px 20px rgba(0,0,0,0.1)'}}>
          {/* Tape effect */}
          <div className='absolute -top-2 left-1/2 transform -translate-x-1/2 w-12 h-6 bg-white bg-opacity-60 rounded-sm shadow-sm'></div>
          <form
            ref={formRef}
            onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(formRef.current);
              clientAction(formData);
            }}
          >
            <textarea
              name='content'
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={4}
              className='w-full bg-transparent border-none outline-none resize-none text-gray-700 placeholder-gray-500'
              placeholder='Write your note here...'
              required
            />
            <div className='flex gap-2 mt-3'>
              <button
                type='submit'
                disabled={isLoading}
                className='bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded text-sm'
              >
                {isLoading ? '...' : 'Save'}
              </button>
              <button
                type='button'
                onClick={() => setShowForm(false)}
                className='bg-gray-500 hover:bg-gray-600 text-white px-3 py-1 rounded text-sm'
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {alertMessage && (
        <div
          className={`mt-4 p-3 rounded-md text-sm ${
            alertType === 'success'
              ? 'bg-green-100 text-green-800 border border-green-300'
              : 'bg-red-100 text-red-800 border border-red-300'
          }`}
        >
          {alertMessage}
        </div>
      )}
    </div>
  );
}