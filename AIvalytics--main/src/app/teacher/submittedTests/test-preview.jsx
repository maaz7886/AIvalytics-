
"use client"

import { supabase } from "@/lib/supabase/client"
import { useState, useEffect } from "react"
import { CheckCircle, XCircle } from "lucide-react"

export default function TestResultViewer({attemptId}) {
  const [displayQuestions, setDisplayQuestions] = useState([])
  const [loading, setLoading] = useState(true)
  const [score, setScore] = useState(0)

  const fetchData = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase.rpc("get_attempt_details", {
        attempt_id: attemptId,
      })

      if (error) throw error

      setDisplayQuestions(data)
      console.log('====================================');
      console.log("questions ",data);
      console.log('====================================');
      // Calculate score based on correct answers
      const correctCount = data.filter(
        q => q.selected_answer === q.correct_answer
      ).length
      setScore(correctCount)
      
    } catch (error) {
      console.error("Error fetching test results:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const getAnswerStatus = (question, option) => {
    if (option === question.correct_answer) {
      return 'correct'
    }
    if (option === question.selected_answer) {
      return 'incorrect'
    }
    return 'neutral'
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500 border-solid"></div>
      </div>
    )
  }

  if (displayQuestions.length === 0) {
    return (
      <div className="text-center p-8">
        <p className="text-gray-500">No test results found</p>
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-6 text-center">
        <h1 className="text-2xl font-bold mb-2">
          {displayQuestions[0].test_title || "Test Results"}
        </h1>
        <div className="bg-blue-50 p-4 rounded-lg">
          <p className="text-lg font-medium">
            Score: {score} / {displayQuestions.length} (
            {Math.round((score / displayQuestions.length) * 100)}%)
          </p>
        </div>
      </div>

      <div className="space-y-6 mb-8">
        {displayQuestions.map((question, questionIndex) => (
          <div key={questionIndex + 1} className="p-4 border rounded-lg">
            <p className="font-medium mb-3">
              {questionIndex + 1}. {question.question_text}
            </p>
            <div className="space-y-2 ml-4">
              {question.options.map((option, optionIndex) => {
                const status = getAnswerStatus(question, option)
                return (
                  <div
                    key={optionIndex}
                    className={`
                      flex items-center gap-2 p-2 rounded
                      ${status === 'correct' ? 'bg-green-50' : ''}
                      ${status === 'incorrect' ? 'bg-red-50' : ''}
                      ${option === question.selected_answer ? 'border-2 border-blue-200' : ''}
                    `}
                  >
                    <input
                      type="radio"
                      name={`question-${questionIndex}`}
                      checked={option === question.selected_answer}
                      readOnly
                      className="w-4 h-4"
                    />
                    <label className="flex-1 cursor-pointer">
                      {option}
                    </label>
                    {status === 'correct' && <CheckCircle className="w-5 h-5 text-green-500" />}
                    {status === 'incorrect' && <XCircle className="w-5 h-5 text-red-500" />}
                  </div>
                )
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}