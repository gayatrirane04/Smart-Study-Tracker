import { generateStudyInsights } from '@/lib/aiService';
import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const studyData = await request.json();
    console.log("📊 Received study data for AI analysis:", studyData);
    
    const insights = await generateStudyInsights(studyData);
    console.log("🤖 AI Generated insights:", insights);
    
    return NextResponse.json(insights);
  } catch (error) {
    console.error('❌ Error generating insights:', error);
    return NextResponse.json({ 
      error: 'Failed to generate insights',
      details: error.message 
    }, { status: 500 });
  }
}