"use client"

import { useState, useEffect } from "react"
import { CheckCircle, XCircle, AlertCircle } from "lucide-react"

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
    <div className="w-full">
      <div className="mb-6 text-center">
        <h1 className="text-2xl font-bold mb-2">{testTitle}</h1>
        <div className="flex justify-center items-center gap-4 text-sm text-gray-600">
          {topic && (
            <div className="flex items-center gap-2">
              <span className="font-medium">Topic:</span>
              <span>{topic}</span>
            </div>
          )}
          <div className="flex items-center gap-2">
            <span className="font-medium">Difficulty:</span>
            <span className={`px-2 py-0.5 rounded-full text-sm ${
              difficulty === 'Hard' ? 'bg-red-100 text-red-700' :
              difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-700' :
              'bg-green-100 text-green-700'
            }`}>
              {difficulty}
            </span>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {displayQuestions.map((question, questionIndex) => (
          <div key={questionIndex} className="p-4 border border-gray-200 rounded-lg bg-gray-50">
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
                      className={`flex items-center gap-2 p-2 rounded transition-all ${
                        selectedAnswers[questionIndex] === option
                          ? isCorrect === true
                            ? "bg-green-50 border border-green-200"
                            : isCorrect === false
                            ? "bg-red-50 border border-red-200"
                            : "bg-blue-50 border border-blue-200"
                          : "hover:bg-white border border-gray-200"
                      }`}
                    >
                      <input
                        type="radio"
                        name={`question-${questionIndex}`}
                        id={`question-${questionIndex}-option-${optionIndex}`}
                        checked={selectedAnswers[questionIndex] === option}
                        onChange={() => handleAnswerSelect(questionIndex, option)}
                        disabled={submitted}
                        className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                      />
                      <label
                        htmlFor={`question-${questionIndex}-option-${optionIndex}`}
                        className="flex-1 cursor-pointer"
                      >
                        {option}
                      </label>
                      {isCorrect === true && <CheckCircle className="w-5 h-5 text-green-500 shrink-0" />}
                      {isCorrect === false && <XCircle className="w-5 h-5 text-red-500 shrink-0" />}
                    </div>
                  )
                })}
            </div>
          </div>
        ))}
      </div>

      {displayQuestions.length > 0 ? (
        <div className="mt-6 flex flex-col items-center">
          {!submitted ? (
            <button
              onClick={handleSubmit}
              className="px-6 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all"
            >
              Submit Test
            </button>
          ) : (
            <div className="text-center space-y-3">
              <div className={`inline-flex items-center px-4 py-2 rounded-lg ${
                score === displayQuestions.length
                  ? "bg-green-100 text-green-800"
                  : score >= displayQuestions.length * 0.7
                  ? "bg-blue-100 text-blue-800"
                  : "bg-yellow-100 text-yellow-800"
              }`}>
                <span className="text-lg font-semibold">
                  Score: {score} / {displayQuestions.length} ({Math.round((score / displayQuestions.length) * 100)}%)
                </span>
              </div>
              <p className="text-gray-600">
                {score === displayQuestions.length
                  ? "Perfect score! Excellent work! 🎉"
                  : score >= displayQuestions.length * 0.7
                  ? "Good job! You've passed the test. 👏"
                  : "Keep studying and try again. 💪"}
              </p>
            </div>
          )}
        </div>
      ) : (
        <div className="mt-6 p-4 border border-gray-200 rounded-lg bg-gray-50 flex items-center justify-center">
          <div className="text-center space-y-2">
            <AlertCircle className="mx-auto h-6 w-6 text-gray-400" />
            <p className="text-gray-600">
              No valid questions available for preview. Please add complete questions with at least two options and a
              correct answer.
            </p>
          </div>
        </div>
      )}
    </div>
  )
}

