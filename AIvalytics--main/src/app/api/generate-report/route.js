// app/api/generate-report/route.js
import { NextResponse } from 'next/server';
import PDFDocument from 'pdfkit';
import { OpenAI } from 'openai';

// Font metrics mock to prevent file system access
const mockFontMetrics = {
  lineHeight: 1.2,
  ascent: 0.8,
  descent: 0.2,
  lineGap: 0,
  unitsPerEm: 1000,
  xHeight: 0.5,
  layout: () => ({ glyphs: [], positions: [] }),
  encode: () => Buffer.alloc(0)
};

export async function POST(req) {
  try {
    const { studentData, mcqData } = await req.json();
    
    // Generate AI insights with retry logic
    const insights = await generateAIInsights(studentData, mcqData);
    
    // Create PDF buffer with font workaround
    const pdfBuffer = await generatePDFBuffer(studentData, mcqData, insights);
    
    return new NextResponse(pdfBuffer, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename=student_report_${studentData.id}.pdf`,
      },
    });
    
  } catch (error) {
    console.error('Error generating report:', error);
    return NextResponse.json({ 
      error: 'Failed to generate report', 
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

function generatePDFContent(doc, studentData, mcqData, aiInsights) {
  // Calculate scores
  const totalQuestions = mcqData.questions.length;
  const correctAnswers = mcqData.questions.filter((q, index) => 
    q.correctAnswer === mcqData.submittedAnswers[index]
  ).length;
  const score = (correctAnswers / totalQuestions) * 100;
  
  // Header
  doc.fontSize(24).text('STUDENT MCQ ASSESSMENT REPORT', { align: 'center' });
  doc.moveDown();
  
  // Student Info
  doc.fontSize(14).text('STUDENT INFORMATION', { underline: true });
  doc.fontSize(12);
  doc.text(`Name: ${studentData.name}`);
  doc.text(`ID: ${studentData.id}`);
  doc.text(`Program: ${studentData.class}`);
  doc.text(`Report Generated: ${new Date().toLocaleDateString()}`);
  doc.moveDown();
  
  // Score Summary
  doc.fontSize(14).text('PERFORMANCE SUMMARY', { underline: true });
  doc.fontSize(12);
  doc.text(`Total Score: ${correctAnswers}/${totalQuestions} (${score.toFixed(1)}%)`);
  
  // Topic Breakdown
  doc.moveDown();
  doc.fontSize(14).text('TOPIC BREAKDOWN', { underline: true });
  doc.fontSize(12);
  
  const topicScores = {};
  mcqData.questions.forEach((q, index) => {
    if (!topicScores[q.topic]) topicScores[q.topic] = { correct: 0, total: 0 };
    topicScores[q.topic].total++;
    if (q.correctAnswer === mcqData.submittedAnswers[index]) topicScores[q.topic].correct++;
  });
  
  Object.entries(topicScores).forEach(([topic, data]) => {
    const topicScore = (data.correct / data.total) * 100;
    doc.text(`${topic}: ${data.correct}/${data.total} (${topicScore.toFixed(1)}%)`);
  });
  
  // Question Analysis
  doc.moveDown();
  doc.fontSize(14).text('QUESTION ANALYSIS', { underline: true });
  doc.fontSize(12);
  
  mcqData.questions.forEach((question, index) => {
    const submitted = mcqData.submittedAnswers[index];
    const isCorrect = question.correctAnswer === submitted;
    
    doc.text(`Q${index + 1}: ${question.text.substring(0, 70)}${question.text.length > 70 ? '...' : ''}`);
    doc.text(`Your answer: ${submitted} (${question.options[submitted]})`);
    doc.text(`Correct answer: ${question.correctAnswer} (${question.options[question.correctAnswer]})`);
    doc.text(`Result: ${isCorrect ? 'Correct ✓' : 'Incorrect ✗'}`);
    doc.moveDown(0.5);
  });
  
  // AI Insights
  doc.moveDown();
  doc.fontSize(14).text('AI-GENERATED INSIGHTS & RECOMMENDATIONS', { underline: true });
  doc.fontSize(12);
  doc.text(aiInsights);
  
  // Footer
  doc.moveDown();
  doc.fontSize(10);
  doc.text('This report is generated using AI to provide personalized feedback and recommendations.', { align: 'center' });
  doc.text(`Report ID: ${Math.random().toString(36).substring(2, 15)}`, { align: 'center' });
}

async function generatePDFBuffer(studentData, mcqData, aiInsights) {
  return new Promise((resolve, reject) => {
    try {
      // Create PDF document with configurations to avoid file system access
      const doc = new PDFDocument({
        bufferPages: true,
        autoFirstPage: true,
        size: 'A4',
        layout: 'portrait',
        info: {
          Title: `Student Report for ${studentData.name}`,
          Author: 'AIvalytics'
        }
      });

      // Override the font handling to prevent file system access
      // This is the key part that prevents the AFM file loading
      if (!doc._fontFamilies) {
        doc._fontFamilies = {};
      }
      
      // Collect data chunks
      let buffers = [];
      doc.on('data', buffers.push.bind(buffers));
      
      // When document is complete, resolve with the combined buffer
      doc.on('end', () => {
        const pdfData = Buffer.concat(buffers);
        resolve(pdfData);
      });
      
      // Handle any errors
      doc.on('error', (err) => {
        console.error('PDFDocument error:', err);
        reject(err);
      });

      // Generate PDF content using default font (don't call doc.font())
      generatePDFContent(doc, studentData, mcqData, aiInsights);

      // Finalize the PDF
      doc.end();
    } catch (error) {
      console.error('Error in PDF buffer generation:', error);
      reject(error);
    }
  });
}