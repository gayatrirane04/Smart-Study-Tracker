import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export async function generateStudyInsights(studyData){
    try{
       const model = genAI.getGenerativeModel({model:"gemini-1.5-flash"});
       const prompt = 
         `Analyze the following study data and provide insights:
         ${JSON.stringify(studyData)}
          Please provide:
    1. One key pattern you notice
    2. One recommendation for improvement  
    3. One motivational message
    
    Keep each point under 20 words. Format as JSON:
    {
      "pattern": "your pattern insight",
      "recommendation": "your recommendation", 
      "motivation": "your motivational message"
    }
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    console.log("🤖 Raw AI response:", text);
    
    // Clean the response - remove markdown formatting
    const cleanText = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    console.log("🧹 Cleaned response:", cleanText);
    
    return JSON.parse(cleanText);

    }catch(error){
       console.error("Error generating study insights:", error);
          return {
           pattern: "Keep tracking to discover your study patterns!",
           recommendation: "Maintain consistent study hours for better results.",
            motivation: "You're building great study habits!"
        };
     }
}