import { currentUser } from '@clerk/nextjs/server';
import Guest from '@/components/Guest';
import JournalForm from '@/components/JournalForm';
import JournalList from '@/components/JournalList';

export default async function JournalPage() {
  const user = await currentUser();
  
  if (!user) {
    return <Guest />;
  }

  return (
    <main className='bg-gray-100 text-gray-800 font-sans min-h-screen'>
      <div className='max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16'>
        <div className='text-center mb-8'>
          <h1 className='text-4xl font-bold mb-3 bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 bg-clip-text text-transparent'>
            Journal
          </h1>
          <p className='text-lg text-gray-600 italic max-w-2xl mx-auto leading-relaxed'>
            "The art of journaling is the art of living twice—once in the moment, and once in reflection"
          </p>
        </div>
        
        <div className='mb-8'>
          <JournalForm />
        </div>
        
        <JournalList />
      </div>
    </main>
  );
}