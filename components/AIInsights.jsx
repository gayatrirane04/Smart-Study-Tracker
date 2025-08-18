'use client';
import { useEffect, useState } from 'react';

export default function AIInsights() {
  const[insights, setInsights] = useState(null);
  const[loading, setLoading] = useState(true);
  const [error ,setError] = useState(null);


  useEffect(() => {
     const fetchAIInsights = async () => {
        try{
          const studyResponse = await fetch('/api/records');
          const studyResult= await studyResponse.json();
          
          const aiResponse = await fetch('/api/ai/insights', {
             method:'POST',
             headers:{'Content-Type': 'application/json'},
             body : JSON.stringify(studyResult.records)
          });
           
           const aiInsights = await aiResponse.json();
           setInsights(aiInsights);
        }
        catch(error){
            setError(error.message); 
        }
        finally {
          setLoading(false);
        }  
     };
     fetchAIInsights()
  },[]);


if (loading) return (
  <div className="bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 shadow-xl rounded-xl p-6 text-white">
    <div className="flex items-center gap-3 mb-4">
      <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center text-2xl backdrop-blur-sm animate-pulse">
        🤖
      </div>
      <div>
        <h3 className="text-xl font-bold">AI Study Coach</h3>
        <p className="text-white/80 text-sm">Analyzing your study patterns...</p>
      </div>
    </div>
    <div className="space-y-3">
      <div className="bg-white/10 rounded-lg p-4 animate-pulse">
        <div className="h-4 bg-white/20 rounded w-3/4"></div>
      </div>
      <div className="bg-white/10 rounded-lg p-4 animate-pulse">
        <div className="h-4 bg-white/20 rounded w-2/3"></div>
      </div>
      <div className="bg-white/10 rounded-lg p-4 animate-pulse">
        <div className="h-4 bg-white/20 rounded w-4/5"></div>
      </div>
    </div>
  </div>
);
if (error) return (
  <div className="bg-gradient-to-br from-red-500 to-pink-600 shadow-xl rounded-xl p-6 text-white">
    <div className="flex items-center gap-3 mb-4">
      <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center text-2xl backdrop-blur-sm">
        ⚠️
      </div>
      <div>
        <h3 className="text-xl font-bold">AI Study Coach</h3>
        <p className="text-white/80 text-sm">Unable to generate insights</p>
      </div>
    </div>
    <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
      <p className="text-white/90 text-sm">{error}</p>
    </div>
  </div>
);
if (!insights) return null;

return (
  <div className="bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 shadow-xl rounded-xl p-6 text-white relative overflow-hidden">
    {/* Background decoration */}
    <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
    <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-12 -translate-x-12"></div>
    
    {/* Header */}
    <div className="relative z-10">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center text-2xl backdrop-blur-sm">
          🤖
        </div>
        <div>
          <h3 className="text-xl font-bold">AI Study Coach</h3>
          <p className="text-white/80 text-sm">Personalized insights for you</p>
        </div>
      </div>
      
      {/* Insights */}
      <div className="space-y-4">
        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
          <div className="flex items-start gap-3">
            <div>
              <h4 className="font-semibold mb-1">Pattern Analysis</h4>
              <p className="text-white/90 text-sm">{insights.pattern}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
          <div className="flex items-start gap-3">
            <div>
              <h4 className="font-semibold mb-1">Recommendation</h4>
              <p className="text-white/90 text-sm">{insights.recommendation}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
          <div className="flex items-start gap-3">
            <div>
              <h4 className="font-semibold mb-1">Motivation</h4>
              <p className="text-white/90 text-sm">{insights.motivation}</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Footer */}
      <div className="mt-6 pt-4 border-t border-white/20">
        <p className="text-white/70 text-xs text-center"> Gayatri.engineer </p>
      </div>
    </div>
  </div>
);

}
