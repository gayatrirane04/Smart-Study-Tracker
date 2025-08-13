'use client';
import { useState, useEffect } from 'react';
import UserProfileSetup from './UserProfileSetup';

export default function AnalyticsWrapper({ children }) {
  const [showProfileSetup, setShowProfileSetup] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkUserProfile = async () => {
      try {
        const response = await fetch('/api/user/profile');
        const data = await response.json();
        
        // Show profile setup if user doesn't have weight/height data
        if (!data.user || !data.user.weight || !data.user.height) {
          setShowProfileSetup(true);
        }
      } catch (error) {
        console.error('Error checking profile:', error);
        setShowProfileSetup(true); // Show setup on error to be safe
      } finally {
        setLoading(false);
      }
    };

    checkUserProfile();
  }, []);

  const handleProfileComplete = () => {
    setShowProfileSetup(false);
  };

  if (loading) {
    return (
      <div className='bg-gray-100 min-h-screen flex items-center justify-center'>
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <>
      {children}
      {showProfileSetup && (
        <UserProfileSetup onComplete={handleProfileComplete} />
      )}
    </>
  );
}