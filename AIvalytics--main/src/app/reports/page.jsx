// app/reports/page.jsx
'use client';
import { useState, useEffect } from 'react';
import StudentList from '@/components/StudentList';
import ReportPreview from '@/components/ReportPreview';

// Static student data
const STUDENTS = [
  {
    id: "CS2023145",
    name: "Alex Chen",
    class: "Computer Science - Year 3",
    program: "B.Tech in Computer Science & Engineering"
  },
  {
    id: "CS2023146",
    name: "Sarah Johnson",
    class: "Computer Science - Year 3",
    program: "B.Tech in Computer Science & Engineering"
  },
  {
    id: "CS2023147",
    name: "Michael Park",
    class: "Computer Science - Year 2",
    program: "B.Tech in Computer Science & Engineering"
  },
  {
    id: "CS2023148",
    name: "Jessica Wong",
    class: "Computer Science - Year 4",
    program: "B.Tech in Computer Science & Engineering"
  },
  {
    id: "CS2023149",
    name: "David Smith",
    class: "Computer Science - Year 3",
    program: "B.Tech in Computer Science & Engineering"
  }
];

// Static MCQ data (same for all students in this example)
const MCQ_DATA = {
  questions: [
    {
      id: "q1",
      text: "What is the time complexity of quicksort in the average case?",
      correctAnswer: "B",
      options: {
        "A": "O(n)",
        "B": "O(n log n)",
        "C": "O(n²)",
        "D": "O(log n)"
      },
      topic: "Algorithms"
    },
    {
      id: "q2",
      text: "Which layer of the OSI model is responsible for routing?",
      correctAnswer: "C",
      options: {
        "A": "Physical Layer",
        "B": "Data Link Layer",
        "C": "Network Layer",
        "D": "Transport Layer"
      },
      topic: "Networking"
    },
    {
      id: "q3",
      text: "Which data structure uses LIFO principle?",
      correctAnswer: "A",
      options: {
        "A": "Stack",
        "B": "Queue",
        "C": "Linked List",
        "D": "Binary Tree"
      },
      topic: "Data Structures"
    },
    {
      id: "q4",
      text: "What does SQL stand for?",
      correctAnswer: "B",
      options: {
        "A": "Structured Query List",
        "B": "Structured Query Language",
        "C": "Simple Query Language",
        "D": "Sequential Query Language"
      },
      topic: "Databases"
    },
    {
      id: "q5",
      text: "Which of these is not a sorting algorithm?",
      correctAnswer: "D",
      options: {
        "A": "Bubble Sort",
        "B": "Merge Sort",
        "C": "Quick Sort",
        "D": "Dijkstra's Algorithm"
      },
      topic: "Algorithms"
    },
    {
      id: "q6",
      text: "Which design pattern is used for creating a single instance of a class?",
      correctAnswer: "A",
      options: {
        "A": "Singleton",
        "B": "Factory",
        "C": "Observer",
        "D": "Decorator"
      },
      topic: "Software Design"
    },
    {
      id: "q7",
      text: "What is the result of 5 & 3 in binary?",
      correctAnswer: "A",
      options: {
        "A": "1",
        "B": "7",
        "C": "2",
        "D": "8"
      },
      topic: "Computer Architecture"
    },
    {
      id: "q8",
      text: "Which protocol is used for secure browsing?",
      correctAnswer: "C",
      options: {
        "A": "HTTP",
        "B": "FTP",
        "C": "HTTPS",
        "D": "SMTP"
      },
      topic: "Networking"
    },
    {
      id: "q9",
      text: "What is the purpose of normalization in databases?",
      correctAnswer: "B",
      options: {
        "A": "To increase performance",
        "B": "To reduce data redundancy",
        "C": "To encrypt data",
        "D": "To create backups"
      },
      topic: "Databases"
    },
    {
      id: "q10",
      text: "Which language is typically used for backend web development?",
      correctAnswer: "D",
      options: {
        "A": "HTML",
        "B": "CSS",
        "C": "jQuery",
        "D": "Node.js"
      },
      topic: "Web Development"
    }
  ],
  // Each student has slightly different answers for variety
  submittedAnswersByStudent: {
    "CS2023145": ["B", "C", "A", "B", "C", "A", "A", "C", "B", "D"], // 8/10 correct
    "CS2023146": ["B", "C", "A", "B", "D", "A", "C", "C", "B", "D"], // 7/10 correct
    "CS2023147": ["A", "C", "A", "B", "D", "A", "A", "C", "B", "A"], // 6/10 correct
    "CS2023148": ["B", "C", "A", "B", "D", "A", "A", "C", "B", "D"], // 9/10 correct
    "CS2023149": ["B", "A", "B", "C", "D", "B", "A", "A", "B", "D"]  // 5/10 correct
  },
  lastSubmissionDate: "2025-04-18T14:30:00Z"
};

export default function ReportsPage() {
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [loading, setLoading] = useState(false);
  const [reportData, setReportData] = useState(null);
  const [aiInsights, setAiInsights] = useState('');
  
  const handleSelectStudent = async (student) => {
    setSelectedStudent(student);
    setLoading(true);
    setReportData(null);
    setAiInsights('');
    
    try {
      // Prepare data with the selected student's submissions
      const data = {
        studentData: student,
        mcqData: {
          ...MCQ_DATA,
          submittedAnswers: MCQ_DATA.submittedAnswersByStudent[student.id]
        }
      };
      
      // Call the API to get AI insights only
      const response = await fetch('/api/generate-insights', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      
      if (!response.ok) {
        throw new Error('Failed to generate insights');
      }
      
      const result = await response.json();
      setAiInsights(result.insights);
      setReportData(data); // Store the report data for preview
      
    } catch (error) {
      console.error('Error generating insights:', error);
      alert('Failed to generate insights. Please try again.');
      setAiInsights('Unable to generate AI insights. Please try again later.');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Student MCQ Report Generator</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Student Selection */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Select Student</h2>
          <StudentList 
            students={STUDENTS} 
            selectedStudent={selectedStudent}
            onSelectStudent={handleSelectStudent}
          />
        </div>
        
        {/* Report Preview */}
        <div className="bg-white p-6 rounded-lg shadow-md md:col-span-2">
          <h2 className="text-xl font-semibold mb-4">
            {loading ? 'Generating Report...' : reportData ? 'Report Preview' : 'Select a Student to See Report'}
          </h2>
          
          {loading && (
            <div className="flex flex-col items-center justify-center h-64">
              <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
              <p className="mt-4 text-gray-600">Generating AI insights...</p>
            </div>
          )}
          
          {!loading && reportData && (
            <ReportPreview 
              studentData={reportData.studentData}
              mcqData={reportData.mcqData}
              aiInsights={aiInsights}
            />
          )}
          
          {!loading && !reportData && (
            <div className="flex flex-col items-center justify-center h-64 text-gray-500">
              <svg className="w-16 h-16 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
              </svg>
              <p>Select a student to generate a report</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}