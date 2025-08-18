import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export async function generateHealthInsights(allHealthData) {
  try {
    const model = genAI.getGenerativeModel({model:"gemini-1.5-flash"});
    const prompt = 
      `You are a professional health coach analyzing wellness data.

DATA EXPLANATION:
- Study Data: amount = hours studied, text = quality/energy level
- Sleep Data: amount = hours slept, text = sleep quality feeling  
- Diet Data: amount = calories consumed, text = meal satisfaction
- Mood Data: amount = mood rating (1-10), text = emotional state

USER DATA:
Study: ${JSON.stringify(allHealthData.study || [])}
Sleep: ${JSON.stringify(allHealthData.sleep || [])}
Diet: ${JSON.stringify(allHealthData.diet || [])}
Mood: ${JSON.stringify(allHealthData.mood || [])}

ANALYSIS FOCUS:
1. Find patterns and trends in each category
2. Identify correlations between categories (sleep affects study, etc.)
3. Determine optimal ranges for this user
4. Spot concerning trends or improvements
5. Provide actionable, specific recommendations

SCORING CRITERIA:
- 90-100: Excellent, sustainable habits
- 70-89: Good with room for optimization  
- 50-69: Average, needs focused improvement
- 30-49: Poor, requires significant changes
- 0-29: Critical, immediate attention needed

Provide insights in this exact JSON format:
{
  "overall": {
    "healthScore": number,
    "summary": "2-sentence overall assessment",
    "topRecommendation": "most impactful single change"
  },
  "study": {
    "pattern": "study pattern insight",
    "recommendation": "study improvement suggestion",
    "score": number
  },
  "sleep": {
    "pattern": "sleep pattern insight",
    "recommendation": "sleep improvement suggestion", 
    "score": number
  },
  "diet": {
    "pattern": "diet pattern insight",
    "recommendation": "diet improvement suggestion",
    "score": number
  },
  "mood": {
    "pattern": "mood pattern insight",
    "recommendation": "mood improvement suggestion",
    "score": number
  }
}

Keep insights conversational, encouraging, and specific to this user's data.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    console.log("🤖 Raw AI health response:", text);
    
    const cleanText = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    console.log("🧹 Cleaned health response:", cleanText);
    
    return JSON.parse(cleanText);

  } catch(error) {
    console.error("Error generating health insights:", error);
    return {
      overall: {
        healthScore: 75,
        summary: "Keep tracking to build comprehensive health insights!",
        topRecommendation: "Maintain consistent data logging for better analysis."
      },
      study: {
        pattern: "Building study tracking habits",
        recommendation: "Continue consistent study logging",
        score: 70
      },
      sleep: {
        pattern: "Establishing sleep patterns", 
        recommendation: "Track sleep consistently for insights",
        score: 75
      },
      diet: {
        pattern: "Developing nutrition awareness",
        recommendation: "Log meals regularly for analysis", 
        score: 70
      },
      mood: {
        pattern: "Building emotional awareness",
        recommendation: "Track mood daily for patterns",
        score: 80
      }
    };
  }
}