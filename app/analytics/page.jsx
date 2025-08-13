import { currentUser } from '@clerk/nextjs/server';
import Guest from '@/components/Guest';
import SleepChart from '@/components/SleepChart';
import DietChart from '@/components/DietChart';
import MentalHealthChart from '@/components/MentalHealthChart';
import AnalyticsWrapper from '@/components/AnalyticsWrapper';

export default async function AnalyticsPage() {
  const user = await currentUser();
  
  if (!user) {
    return <Guest />;
  }

  return (
    <AnalyticsWrapper>
      <main className='bg-gray-100 text-gray-800 font-sans min-h-screen'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16'>
          <div className='text-center mb-12'>
            <h1 className='text-4xl font-bold mb-3 bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 bg-clip-text text-transparent'>
              Health Analytics
            </h1>
            <p className='text-lg text-gray-600'>
              Track your sleep patterns, diet, and mental health progress
            </p>
          </div>
          
          <div className='space-y-8'>
            {/* Top Row - Sleep (full width) */}
            <div className='flex items-center gap-6'>
              <div className='flex-1'>
                <SleepChart />
              </div>
              <img 
                src='/sleep.jpg' 
                alt='Sleep' 
                className='w-80 h-80 object-cover rounded-lg shadow-lg flex-shrink-0'
              />
            </div>
            
            {/* Middle Row - Diet (centered) */}
            <div className='flex justify-center'>
              <div className='w-full flex items-center gap-6'>
                <img 
                  src='/diet.jpg' 
                  alt='Diet' 
                  className='w-80 h-80 object-cover rounded-lg shadow-lg flex-shrink-0'
                />
                <div className='flex-1'>
                  <DietChart />
                </div>
              </div>
            </div>
            
            {/* Bottom Row - Mental Health (full width) */}
            <div className='flex items-center gap-6'>
              <div className='flex-1'>
                <MentalHealthChart />
              </div>
              <img 
                src='/brain.jpg' 
                alt='Mental Health' 
                className='w-80 h-80 object-cover rounded-lg shadow-lg flex-shrink-0'
              />
            </div>
          </div>
        </div>
      </main>
    </AnalyticsWrapper>
  );
}