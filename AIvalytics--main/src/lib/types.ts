export interface Test {
  id: string
  title: string
  subject: string
  description: string
  difficulty: "Easy" | "Medium" | "Hard"
  duration: number
  questionCount: number
  createdAt: string
  createdBy: string
  class: string
}

export interface CompletedTest {
  id: string
  testId: string
  title: string
  subject: string
  score: number
  correctAnswers: number
  totalQuestions: number
  timeTaken: number
  completedAt: string
  class: string
}

