import { useRef } from 'react';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

export default function ReportPreview({ studentData, mcqData, aiInsights }) {
  const reportRef = useRef(null);
  
  // Calculate scores
  const totalQuestions = mcqData.questions.length;
  const correctAnswers = mcqData.questions.filter((q, index) => 
    q.correctAnswer === mcqData.submittedAnswers[index]
  ).length;
  const score = (correctAnswers / totalQuestions) * 100;
  
  // Calculate topic performance
  const topicScores = {};
  mcqData.questions.forEach((q, index) => {
    if (!topicScores[q.topic]) topicScores[q.topic] = { correct: 0, total: 0 };
    topicScores[q.topic].total++;
    if (q.correctAnswer === mcqData.submittedAnswers[index]) topicScores[q.topic].correct++;
  });

  // Mock data for additional elements
  const mockData = {
    schoolName: "GREENFIELD ACADEMY",
    week: "April 15-21, 2025",
    subject: "Computer Science",
    previousScore: 78,
    improvement: score - 78,
    classAverages: {
      "Algorithms": 75,
      "Networking": 82,
      "Data Structures": 77,
      "Databases": 80,
      "Software Design": 79,
      "Computer Architecture": 73,
      "Web Development": 85
    },
    dailyPerformance: [
      { day: "Monday", score: 8, total: 10, topic: "Data Structures & Algorithms" },
      { day: "Tuesday", score: 9, total: 10, topic: "Computer Networking" },
      { day: "Wednesday", score: 8, total: 10, topic: "Database Management" },
      { day: "Thursday", score: 9, total: 10, topic: "Software Engineering" },
      { day: "Friday", score: 9, total: 10, topic: "Web Development" }
    ],
    weeklyProgress: [
      { week: "Week 1", score: 72 },
      { week: "Week 2", score: 78 },
      { week: "Week 3", score: score.toFixed(0) }
    ],
    upcomingAssessments: [
      { day: "Monday", title: "Algorithm Efficiency Quiz", questions: 10 },
      { day: "Wednesday", title: "Networking Mid-Unit Test", questions: 25 },
      { day: "Friday", title: "Weekly Review", questions: 15 }
    ],
    teacher: "Dr. Anderson",
    contactEmail: "m.anderson@greenfield.edu"
  };

  // Identify strengths and weaknesses based on topic scores
  const strengths = [];
  const weaknesses = [];
  
  Object.entries(topicScores).forEach(([topic, data]) => {
    const topicPercentage = (data.correct / data.total) * 100;
    if (topicPercentage >= 90) {
      strengths.push({ topic, score: topicPercentage });
    } else if (topicPercentage <= 75) {
      weaknesses.push({ topic, score: topicPercentage });
    }
  });
  
  // Sort strengths and weaknesses
  strengths.sort((a, b) => b.score - a.score);
  weaknesses.sort((a, b) => a.score - b.score);

  const handleGeneratePDF = async () => {
    try {
      const element = reportRef.current;
      
      // Create a canvas from the element
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#ffffff',
        // Use standard RGB colors only
        onclone: (clonedDoc, clonedElement) => {
          // Remove problematic oklch colors by applying standard colors
          clonedElement.querySelectorAll('*').forEach(el => {
            // Convert any potential oklch colors to standard hex
            if (window.getComputedStyle(el).color.includes('oklch')) {
              el.style.color = '#333333';
            }
            if (window.getComputedStyle(el).backgroundColor.includes('oklch')) {
              el.style.backgroundColor = '#ffffff';
            }
          });
        }
      });

      // Generate PDF
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgWidth = 190; // Slightly smaller than A4 width for margins
      const pageHeight = 297; // A4 height in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      
      // Add image to PDF, handling multiple pages if needed
      let heightLeft = imgHeight;
      let position = 10;
      
      pdf.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight);
      heightLeft -= pageHeight - 20;
      
      // Add additional pages if the report is long
      while (heightLeft > 0) {
        position = 10 - (pageHeight - 20);
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight);
        heightLeft -= (pageHeight - 20);
      }
      
      pdf.save(`${studentData.name.replace(/\s+/g, '_')}_report.pdf`);
      
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Failed to generate PDF. Please try again.');
    }
  };
  
  return (
    <div className="flex flex-col gap-4">
      {/* Preview container with ref */}
      <div 
        ref={reportRef} 
        className="bg-white p-8 border rounded-lg shadow-sm"
        style={{ 
          maxWidth: "800px",
          color: '#333333',
          backgroundColor: '#ffffff',
          fontFamily: 'Arial, sans-serif'
        }}
      >
        {/* Header */}
        <div className="text-center mb-4">
          <h1 style={{ color: '#1a365d', fontSize: '28px', fontWeight: 'bold', marginBottom: '4px' }}>
            {mockData.schoolName}
          </h1>
          <h2 style={{ color: '#2a4365', fontSize: '20px', fontWeight: 'bold', marginBottom: '12px' }}>
            WEEKLY MCQ ASSESSMENT REPORT
          </h2>
        </div>
        
        {/* Student Info */}
        <div className="mb-4" style={{ lineHeight: '1.6' }}>
          <p><strong>Student:</strong> {studentData.name}</p>
          <p><strong>ID:</strong> {studentData.id}</p>
          <p><strong>Class:</strong> {studentData.class}</p>
          <p><strong>Week:</strong> {mockData.week}</p>
          <p><strong>Subject:</strong> {mockData.subject}</p>
        </div>
        
        <hr style={{ border: '1px solid #e2e8f0', margin: '16px 0' }} />
        
        {/* Performance Summary */}
        <div className="mb-4">
          <h3 style={{ color: '#2a4365', fontSize: '18px', fontWeight: 'bold', marginBottom: '8px' }}>
            PERFORMANCE SUMMARY
          </h3>
          <p><strong>Total Weekly Score:</strong> {correctAnswers}/{totalQuestions} ({score.toFixed(0)}%)</p>
          <p><strong>Previous Week:</strong> {mockData.previousScore}%</p>
          <p><strong>Improvement:</strong> {mockData.improvement > 0 ? '+' : ''}{mockData.improvement.toFixed(0)}%</p>
          <p style={{ marginTop: '8px' }}>{aiInsights.split('\n')[0]}</p>
        </div>
        
        <hr style={{ border: '1px solid #e2e8f0', margin: '16px 0' }} />
        
        {/* Topic Breakdown */}
        <div className="mb-4">
          <h3 style={{ color: '#2a4365', fontSize: '18px', fontWeight: 'bold', marginBottom: '8px' }}>
            TOPIC BREAKDOWN
          </h3>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ backgroundColor: '#f7fafc' }}>
                <th style={{ padding: '8px', textAlign: 'left', borderBottom: '1px solid #e2e8f0' }}>Topic</th>
                <th style={{ padding: '8px', textAlign: 'center', borderBottom: '1px solid #e2e8f0' }}>Score</th>
                <th style={{ padding: '8px', textAlign: 'center', borderBottom: '1px solid #e2e8f0' }}>Class Average</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(topicScores).map(([topic, data]) => {
                const topicPercentage = (data.correct / data.total) * 100;
                return (
                  <tr key={topic} style={{ borderBottom: '1px solid #e2e8f0' }}>
                    <td style={{ padding: '8px' }}>{topic}</td>
                    <td style={{ padding: '8px', textAlign: 'center' }}>
                      {data.correct}/{data.total} ({topicPercentage.toFixed(0)}%)
                    </td>
                    <td style={{ padding: '8px', textAlign: 'center' }}>
                      {mockData.classAverages[topic] || 75}%
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        
        <hr style={{ border: '1px solid #e2e8f0', margin: '16px 0' }} />
        
        {/* Daily Performance */}
        <div className="mb-4">
          <h3 style={{ color: '#2a4365', fontSize: '18px', fontWeight: 'bold', marginBottom: '8px' }}>
            DAILY PERFORMANCE
          </h3>
          {mockData.dailyPerformance.map((day, index) => (
            <p key={index}><strong>{day.day}:</strong> {day.score}/{day.total} - {day.topic}</p>
          ))}
        </div>
        
        <hr style={{ border: '1px solid #e2e8f0', margin: '16px 0' }} />
        
        {/* Question Analysis */}
        <div className="mb-4">
          <h3 style={{ color: '#2a4365', fontSize: '18px', fontWeight: 'bold', marginBottom: '8px' }}>
            QUESTION ANALYSIS
          </h3>
          
          <h4 style={{ color: '#2a4365', fontSize: '16px', fontWeight: 'bold', marginBottom: '4px' }}>
            AREAS OF STRENGTH
          </h4>
          <ul style={{ marginLeft: '20px', marginBottom: '8px' }}>
            {strengths.length > 0 ? (
              strengths.slice(0, 3).map((item, index) => (
                <li key={index}>{item.topic} ({item.score.toFixed(0)}%)</li>
              ))
            ) : (
              <li>No areas with 90% or higher performance</li>
            )}
          </ul>
          
          <h4 style={{ color: '#2a4365', fontSize: '16px', fontWeight: 'bold', marginBottom: '4px' }}>
            AREAS FOR IMPROVEMENT
          </h4>
          <ul style={{ marginLeft: '20px' }}>
            {weaknesses.length > 0 ? (
              weaknesses.slice(0, 3).map((item, index) => (
                <li key={index}>{item.topic} ({item.score.toFixed(0)}%)</li>
              ))
            ) : (
              <li>No significant areas for improvement (below 75%)</li>
            )}
          </ul>
        </div>
        
        <hr style={{ border: '1px solid #e2e8f0', margin: '16px 0' }} />
        
        {/* Weekly Progress */}
        <div className="mb-4">
          <h3 style={{ color: '#2a4365', fontSize: '18px', fontWeight: 'bold', marginBottom: '8px' }}>
            WEEKLY PROGRESS
          </h3>
          <p>
            {studentData.name.split(' ')[0]} has shown consistent improvement over the past three weeks:
          </p>
          <ul style={{ marginLeft: '20px' }}>
            {mockData.weeklyProgress.map((week, index) => (
              <li key={index}>
                {week.week}: {week.score}%{week.week === 'Week 3' ? ' (current)' : ''}
              </li>
            ))}
          </ul>
        </div>
        
        <hr style={{ border: '1px solid #e2e8f0', margin: '16px 0' }} />
        
        {/* Recommended Focus Areas */}
        <div className="mb-4">
          <h3 style={{ color: '#2a4365', fontSize: '18px', fontWeight: 'bold', marginBottom: '8px' }}>
            RECOMMENDED FOCUS AREAS
          </h3>
          <ol style={{ marginLeft: '20px' }}>
            {aiInsights.split('\n').filter(line => line.trim().length > 0).slice(1, 4).map((insight, index) => (
              <li key={index}>{insight.replace(/^\d+\.\s*/, '')}</li>
            ))}
          </ol>
        </div>
        
        <hr style={{ border: '1px solid #e2e8f0', margin: '16px 0' }} />
        
        {/* Upcoming Assessments */}
        <div className="mb-4">
          <h3 style={{ color: '#2a4365', fontSize: '18px', fontWeight: 'bold', marginBottom: '8px' }}>
            UPCOMING ASSESSMENTS
          </h3>
          <ul style={{ marginLeft: '20px' }}>
            {mockData.upcomingAssessments.map((assessment, index) => (
              <li key={index}>
                <strong>{assessment.day}:</strong> {assessment.title} ({assessment.questions} questions)
              </li>
            ))}
          </ul>
        </div>
        
        <hr style={{ border: '1px solid #e2e8f0', margin: '16px 0' }} />
        
        {/* Footer */}
        <div className="text-center mt-4" style={{ fontSize: '14px', color: '#4a5568' }}>
          <p><em>Report generated on {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</em></p>
          <p><em>Teacher: {mockData.teacher}</em></p>
          <p><em>Contact: {mockData.contactEmail}</em></p>
          <p>Page 1 of 1</p>
        </div>
      </div>
      
      {/* Generate PDF Button */}
      <button
        onClick={handleGeneratePDF}
        className="py-2 px-4 font-medium rounded-md hover:bg-blue-700 transition-colors"
        style={{ backgroundColor: '#3182ce', color: 'white' }}
      >
        Download as PDF
      </button>
    </div>
  );
}