"use client"

import { useState, useEffect } from "react"
import { CheckCircle, XCircle } from "lucide-react"

export default function TestPreview({
  testTitle,
  topic,
  difficulty,
  questions,
  randomizeQuestions,
  
}) {
  const [selectedAnswers, setSelectedAnswers] = useState({})
  const [submitted, setSubmitted] = useState(false)
  const [score, setScore] = useState(0)
  const [displayQuestions, setDisplayQuestions] = useState([])

  // Initialize display questions, applying randomization if needed
  useEffect(() => {
    let questionsToDisplay = [...questions]
    console.log('====================================');
    console.log(questionsToDisplay);
    console.log('====================================');
    // Filter out incomplete questions
    questionsToDisplay = questionsToDisplay.filter(
      (q) => q.question && q.options.filter((opt) => opt).length >= 2 && q.correctAnswer,
    )

    // Apply randomization if enabled
    if (randomizeQuestions) {
      questionsToDisplay = [...questionsToDisplay].sort(() => Math.random() - 0.5)
    }

    setDisplayQuestions(questionsToDisplay)
  }, [questions, randomizeQuestions])

  const handleAnswerSelect = (questionIndex, option) => {
    if (submitted) return

    setSelectedAnswers({
      ...selectedAnswers,
      [questionIndex]: option,
    })
  }

  const handleSubmit = () => {
    if (submitted) return

    let correctCount = 0

    displayQuestions.forEach((question, index) => {
      if (selectedAnswers[index] === question.correctAnswer) {
        correctCount++
      }
    })

    setScore(correctCount)
    setSubmitted(true)
  }

  const isAnswerCorrect = (questionIndex, option) => {
    if (!submitted ) return null

    const question = displayQuestions[questionIndex]
    if (option === question.correctAnswer) {
      return true
    }
    return selectedAnswers[questionIndex] === option ? false : null
  }

  return (
    <div className="max-w-3xl  mx-auto">
      <div className="mb-6 text-center">
        <h1 className="text-2xl font-bold mb-2">{testTitle}</h1>
        {topic && <p className="text-gray-600 mb-1">Topic: {topic}</p>}
        <p className="text-gray-600">Difficulty: {difficulty}</p>
      </div>

      <div className="space-y-6 mb-8">
        {displayQuestions.map((question, questionIndex) => (
          <div key={questionIndex} className="p-4 border rounded-lg">
            <p className="font-medium mb-3">
              {questionIndex + 1}. {question.question}
            </p>
            <div className="space-y-2 ml-4">
              {question.options
                .filter((opt) => opt)
                .map((option, optionIndex) => {
                  const isCorrect = isAnswerCorrect(questionIndex, option)
                  return (
                    <div
                      key={optionIndex}
                      className={`flex items-center gap-2 p-2 rounded ${
                        selectedAnswers[questionIndex] === option ? "bg-blue-50" : ""
                      } ${isCorrect === true ? "bg-green-50" : isCorrect === false ? "bg-red-50" : ""}`}
                    >
                      <input
                        type="radio"
                        name={`question-${questionIndex}`}
                        id={`question-${questionIndex}-option-${optionIndex}`}
                        checked={selectedAnswers[questionIndex] === option}
                        onChange={() => handleAnswerSelect(questionIndex, option)}
                        disabled={submitted}
                        className="w-4 h-4"
                      />
                      <label
                        htmlFor={`question-${questionIndex}-option-${optionIndex}`}
                        className="flex-1 cursor-pointer"
                      >
                        {option}
                      </label>
                      {isCorrect === true && <CheckCircle className="w-5 h-5 text-green-500" />}
                      {isCorrect === false && <XCircle className="w-5 h-5 text-red-500" />}
                    </div>
                  )
                })}
            </div>
          </div>
        ))}
      </div>

      {displayQuestions.length > 0 ? (
        <div className="flex flex-col items-center">
          {!submitted ? (
            <button
              onClick={handleSubmit}
              className="px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
            >
              Submit Test
            </button>
          ) : (
            <div className="text-center">
              <p className="text-xl font-bold mb-2">
                Your Score: {score} / {displayQuestions.length} ({Math.round((score / displayQuestions.length) * 100)}%)
              </p>
              <p className="text-gray-600">
                {score === displayQuestions.length
                  ? "Perfect score! Excellent work!"
                  : score >= displayQuestions.length * 0.7
                    ? "Good job! You've passed the test."
                    : "Keep studying and try again."}
              </p>
            </div>
          )}
        </div>
      ) : (
        <div className="text-center p-8 border rounded-lg bg-gray-50">
          <p className="text-gray-500">
            No valid questions available for preview. Please add complete questions with at least two options and a
            correct answer.
          </p>
        </div>
      )}
    </div>
  )
}

