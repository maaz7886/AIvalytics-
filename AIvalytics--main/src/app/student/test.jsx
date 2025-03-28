"use client"

import { useState, useEffect } from "react"
import { CheckCircle, XCircle } from "lucide-react"
import { supabase } from "@/lib/supabase/client"

export default function Test({
  testTitle,
  topic
}) {

  
  const [selectedAnswers, setSelectedAnswers] = useState({})
  const [submitted, setSubmitted] = useState(false)
  const [score, setScore] = useState(0)
  const [displayQuestions, setDisplayQuestions] = useState([])

    const fetchQuestions = async () => {
   const { data, error } = await supabase.from("questions").select("*")
  console.log('====================================');
  console.log("from client",data);
  setDisplayQuestions(data)
  console.log('===================================='); 
  }
    useEffect(() => {
      fetchQuestions()
    }, [])
  const que = 
  [
    {
        "id": "12957",
        "question": "What does LLM stand for?",
        "options": [
            "Large Language Model",
            "Long Learning Machine",
            "Limited Linguistic Model",
            "Layered Logic Module"
        ],
        "correctAnswer": "Large Language Model",
        "explanation": "LLM is a common abbreviation for Large Language Model."
    },
    {
        "id": "83401",
        "question": "Which of the following is a key characteristic of an LLM?",
        "options": [
            "Ability to process images",
            "Ability to understand and generate human language",
            "Ability to control robots",
            "Ability to perform complex calculations"
        ],
        "correctAnswer": "Ability to understand and generate human language",
        "explanation": "LLMs are primarily focused on text-based tasks and understanding/generating human language."
    },
    {
        "id": "27639",
        "question": "LLMs are typically trained on:",
        "options": [
            "Small datasets of structured data",
            "Large amounts of text data",
            "Images and videos",
            "Audio recordings"
        ],
        "correctAnswer": "Large amounts of text data",
        "explanation": "LLMs learn from massive datasets of text and code."
    },
    {
        "id": "51824",
        "question": "What can LLMs be used for?",
        "options": [
            "Building websites",
            "Creating 3D models",
            "Generating text, translating languages, and writing different kinds of creative content",
            "Designing video games"
        ],
        "correctAnswer": "Generating text, translating languages, and writing different kinds of creative content",
        "explanation": "LLMs excel at a variety of language-related tasks, including text generation, translation, and creative writing."
    },
    {
        "id": "95062",
        "question": "An example of a task an LLM could perform is:",
        "options": [
            "Recognizing faces in a photograph",
            "Playing a game of chess",
            "Summarizing a news article",
            "Driving a car"
        ],
        "correctAnswer": "Summarizing a news article",
        "explanation": "Text summarization is a common task for LLMs."
    }
]
  // Initialize display questions, applying randomization if needed
 
  useEffect(() => {
    let questionsToDisplay = [...displayQuestions]

    // Filter out incomplete questions
    questionsToDisplay = questionsToDisplay.filter(
      (q) => q.question && q.options.filter((opt) => opt).length >= 2 && q.correctAnswer,
    )

  

    setDisplayQuestions(questionsToDisplay)
  }, [])

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

