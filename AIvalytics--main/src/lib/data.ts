import type { Test, CompletedTest } from "./types"

// Mock data for demonstration
const mockTests: Test[] = [
  {
    id: "test-1",
    title: "Physics Mid-Term",
    subject: "Physics",
    description: "Covers mechanics, thermodynamics, and waves",
    difficulty: "Medium",
    duration: 60,
    questionCount: 30,
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    createdBy: "teacher-1",
    class: "SYBCA-C",
  },
  {
    id: "test-2",
    title: "Chemistry Quiz",
    subject: "Chemistry",
    description: "Periodic table, chemical bonding, and organic chemistry basics",
    difficulty: "Easy",
    duration: 45,
    questionCount: 20,
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    createdBy: "teacher-2",
    class: "FYBCA-A",
  },
  {
    id: "test-3",
    title: "Elon Musk Quiz",
    subject: "General Knowledge",
    description: "Test your knowledge about Elon Musk and his companies",
    difficulty: "Easy",
    duration: 15,
    questionCount: 10,
    createdAt: new Date().toISOString(),
    createdBy: "teacher-1",
    class: "SYBCA-C",
  },
]

const mockCompletedTests: CompletedTest[] = [
  {
    id: "completed-1",
    testId: "test-4",
    title: "Mathematics Fundamentals",
    subject: "Mathematics",
    score: 85,
    correctAnswers: 17,
    totalQuestions: 20,
    timeTaken: 42,
    completedAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
    class: "SYBCA-C",
  },
  {
    id: "completed-2",
    testId: "test-5",
    title: "Computer Science Basics",
    subject: "Computer Science",
    score: 92,
    correctAnswers: 23,
    totalQuestions: 25,
    timeTaken: 38,
    completedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    class: "SYBCA-C",
  },
]

// In a real application, these functions would make API calls
export async function fetchTests(studentId: string): Promise<Test[]> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500))

  // In a real app, you would filter tests based on the student's class
  return mockTests
}

export async function fetchCompletedTests(studentId: string): Promise<CompletedTest[]> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500))

  // In a real app, you would fetch completed tests for this specific student
  return mockCompletedTests
}

// For a real-time implementation, you could use Server-Sent Events or WebSockets
export function subscribeToNewTests(studentId: string, callback: (test: Test) => void) {
  // This would be implemented with a real-time solution in a production app
  console.log("Subscribed to new tests for student:", studentId)

  // Return an unsubscribe function
  return () => {
    console.log("Unsubscribed from new tests for student:", studentId)
  }
}

