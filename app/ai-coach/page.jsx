import { currentUser } from '@clerk/nextjs/server';
import Guest from '@/components/Guest';

export default async function AICoachPage() {
  const user = await currentUser();
  
  if (!user) {
    return <Guest />;
  }

  return (
    <main className='bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 min-h-screen'>
      {/* Hero Section */}
      <div className='bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white py-16'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center'>
          <div className='inline-flex items-center justify-center w-20 h-20 bg-white/20 rounded-full mb-6 backdrop-blur-sm'>
            <span className='text-4xl'>🤖</span>
          </div>
          <h1 className='text-5xl font-bold mb-4'>
            AI Health Coach
          </h1>
          <p className='text-xl text-white/90 max-w-2xl mx-auto'>
            Get personalized insights and recommendations powered by artificial intelligence to optimize your wellness journey
          </p>
        </div>
      </div>

      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8'>
        {/* Overall Health Summary */}
        <section className='mb-12'>
          <div className='bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/50 p-8 relative overflow-hidden'>
            <div className='absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 rounded-full -translate-y-16 translate-x-16'></div>
            <div className='relative z-10'>
              <div className='flex items-center gap-4 mb-6'>
                <div className='w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center text-white text-2xl shadow-lg'>
                  📊
                </div>
                <div>
                  <h2 className='text-3xl font-bold text-gray-800'>Overall Health Summary</h2>
                  <p className='text-gray-600'>Comprehensive analysis of your wellness metrics</p>
                </div>
              </div>
              <div className='bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-6 border border-green-200/50'>
                <div className='flex items-center justify-between'>
                  <div>
                    <div className='text-3xl font-bold text-green-600 mb-1'>85%</div>
                    <div className='text-gray-600'>Overall Wellness Score</div>
                  </div>
                  <div className='text-4xl'>🎯</div>
                </div>
                <p className='text-gray-700 mt-4'>Comprehensive insights will be generated here based on all your health data...</p>
              </div>
            </div>
          </div>
        </section>

        {/* Category Analysis */}
        <section className='mb-12'>
          <div className='text-center mb-8'>
            <h2 className='text-3xl font-bold text-gray-800 mb-2'>Category Analysis</h2>
            <p className='text-gray-600'>Deep dive into each aspect of your health</p>
          </div>
          
          <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
            {/* Study Card */}
            <div className='group bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/50 p-6 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 relative overflow-hidden'>
              <div className='absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-blue-500/10 to-indigo-500/10 rounded-full -translate-y-12 translate-x-12'></div>
              <div className='relative z-10'>
                <div className='flex items-center gap-4 mb-4'>
                  <div className='w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center text-white text-xl shadow-lg'>
                    📚
                  </div>
                  <div>
                    <h3 className='text-xl font-bold text-gray-800'>Study Insights</h3>
                    <p className='text-gray-600 text-sm'>Performance & patterns</p>
                  </div>
                </div>
                <div className='bg-blue-50 rounded-lg p-4 border border-blue-200/50'>
                  <p className='text-gray-700'>AI-powered study analysis will appear here...</p>
                </div>
              </div>
            </div>

            {/* Sleep Card */}
            <div className='group bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/50 p-6 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 relative overflow-hidden'>
              <div className='absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-full -translate-y-12 translate-x-12'></div>
              <div className='relative z-10'>
                <div className='flex items-center gap-4 mb-4'>
                  <div className='w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center text-white text-xl shadow-lg'>
                    😴
                  </div>
                  <div>
                    <h3 className='text-xl font-bold text-gray-800'>Sleep Insights</h3>
                    <p className='text-gray-600 text-sm'>Quality & duration</p>
                  </div>
                </div>
                <div className='bg-purple-50 rounded-lg p-4 border border-purple-200/50'>
                  <p className='text-gray-700'>Sleep pattern analysis will appear here...</p>
                </div>
              </div>
            </div>

            {/* Diet Card */}
            <div className='group bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/50 p-6 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 relative overflow-hidden'>
              <div className='absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-green-500/10 to-emerald-500/10 rounded-full -translate-y-12 translate-x-12'></div>
              <div className='relative z-10'>
                <div className='flex items-center gap-4 mb-4'>
                  <div className='w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center text-white text-xl shadow-lg'>
                    🍎
                  </div>
                  <div>
                    <h3 className='text-xl font-bold text-gray-800'>Diet Insights</h3>
                    <p className='text-gray-600 text-sm'>Nutrition & habits</p>
                  </div>
                </div>
                <div className='bg-green-50 rounded-lg p-4 border border-green-200/50'>
                  <p className='text-gray-700'>Nutritional analysis will appear here...</p>
                </div>
              </div>
            </div>

            {/* Mood Card */}
            <div className='group bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/50 p-6 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 relative overflow-hidden'>
              <div className='absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-yellow-500/10 to-orange-500/10 rounded-full -translate-y-12 translate-x-12'></div>
              <div className='relative z-10'>
                <div className='flex items-center gap-4 mb-4'>
                  <div className='w-12 h-12 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-xl flex items-center justify-center text-white text-xl shadow-lg'>
                    😊
                  </div>
                  <div>
                    <h3 className='text-xl font-bold text-gray-800'>Mood Insights</h3>
                    <p className='text-gray-600 text-sm'>Emotional wellness</p>
                  </div>
                </div>
                <div className='bg-yellow-50 rounded-lg p-4 border border-yellow-200/50'>
                  <p className='text-gray-700'>Mood pattern analysis will appear here...</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
