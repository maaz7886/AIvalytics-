// app/api/generate-insights/route.js
import { NextResponse } from 'next/server';
import { OpenAI } from 'openai';

export async function POST(req) {
  try {
    const { studentData, mcqData } = await req.json();
    
    // Generate AI insights with retry logic
    const insights = await generateAIInsights(studentData, mcqData);
    
    return NextResponse.json({ insights });
    
  } catch (error) {
    console.error('Error generating insights:', error);
    return NextResponse.json({ 
      error: 'Failed to generate insights', 
      details: error.message 
    }, { status: 500 });
  }
}

async function generateAIInsights(studentData, mcqData, retries = 3) {
  try {
    const openai = new OpenAI({
      apiKey: process.env.OPENROUTER_API_KEY,
      baseURL: "https://openrouter.ai/api/v1",
      defaultHeaders: {
        "HTTP-Referer": "http://localhost:3000",
        "X-Title": "AIvalytics"
      },
      timeout: 30000
    });
    
    // Calculate performance metrics
    const totalQuestions = mcqData.questions.length;
    const correctAnswers = mcqData.questions.filter((q, index) => 
      q.correctAnswer === mcqData.submittedAnswers[index]
    ).length;
    const score = (correctAnswers / totalQuestions) * 100;
    
    // Create topic performance summary
    const topicSummary = Object.entries(
      mcqData.questions.reduce((acc, q, index) => {
        if (!acc[q.topic]) acc[q.topic] = { correct: 0, total: 0 };
        acc[q.topic].total++;
        if (q.correctAnswer === mcqData.submittedAnswers[index]) acc[q.topic].correct++;
        return acc;
      }, {})
    ).map(([topic, data]) => `${topic}: ${data.correct}/${data.total} (${(data.correct/data.total*100).toFixed(1)}%)`)
     .join('\n');
    
    const prompt = `
      You are an educational assistant generating insights for a Computer Science student's MCQ assessment report.

      Student: ${studentData.name}
      Program: ${studentData.class}
      Overall Score: ${score.toFixed(1)}% (${correctAnswers}/${totalQuestions} questions)
      
      Performance by topic:
      ${topicSummary}
      
      Based on this information, please provide:
      1. A concise performance assessment (2-3 sentences)
      2. Three specific strengths based on topic performance
      3. Two areas for improvement with specific suggestions
      4. One recommendation for further study
      
      Format your response with clear headings and keep it under 300 words total.
    `;
    
    const response = await openai.chat.completions.create({
      model: "deepseek/deepseek-chat",
      messages: [
        { role: "system", content: "You are an educational assistant that provides clear, constructive feedback on student assessments." },
        { role: "user", content: prompt }
      ],
      temperature: 0.7,
      max_tokens: 500
    });
    
    return response.choices[0].message.content;
    
  } catch (error) {
    if (retries > 0) {
      console.log(`Retrying... (${retries} attempts left)`);
      await new Promise(resolve => setTimeout(resolve, 2000));
      return generateAIInsights(studentData, mcqData, retries - 1);
    }
    console.error('Error generating AI insights:', error);
    return `
      ## Performance Assessment
      Based on your score of ${((mcqData.submittedAnswers.filter((answer, i) => 
        answer === mcqData.questions[i].correctAnswer).length / mcqData.questions.length) * 100).toFixed(1)}%, 
      you're showing good understanding of the material but have room for improvement.
      
      ## Recommendations
      Focus on reviewing the topics where you scored lower and practice more questions in those areas.
    `;
  }
}