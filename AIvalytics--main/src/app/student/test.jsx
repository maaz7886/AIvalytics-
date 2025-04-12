"use client"

import { supabase } from "@/lib/supabase/client"
import { useState, useEffect } from "react"
import { CheckCircle, XCircle } from "lucide-react"

export default function Test({ test_id,student_id }) {
  const [selectedAnswers, setSelectedAnswers] = useState({})
  const [submitted, setSubmitted] = useState(false)
  const [score, setScore] = useState()
  const [displayQuestions, setDisplayQuestions] = useState([]) // Initialize as empty array

  const fetchQuestions = async () => {
    try {
      const { data, error } = await supabase
        .rpc('get_questions_by_test_id', { test_id });

      if (error) {
        throw new Error(error.message);
      }

      setDisplayQuestions(data);
    } catch (error) {
      console.error("Error fetching questions:", error);
    }
  }

  useEffect(() => {
    fetchQuestions(); // Call the fetch function on component mount
  }, [test_id]); // Dependency on test_id to refetch if it changes

  const handleAnswerSelect = (questionIndex, option) => {
    if (submitted) return;

    setSelectedAnswers({
      ...selectedAnswers,
      [questionIndex]: option,
    });
  }

  const handleSubmit = async () => {
    if (submitted) return;

    // Convert selectedAnswers to an array of objects including question ID
    const submittedTestArray = Object.entries(selectedAnswers).map(([questionIndex, answer]) => {
      const question = displayQuestions[questionIndex]; // Get the question object
      return {
        question_id: question.id, // Assuming each question has a unique 'id'
        answer: answer,
      };
    });

    let correctCount = 0;

    displayQuestions.forEach((question, index) => {
      if (selectedAnswers[index] === question.correctAnswer) {
        correctCount++;
      }
    });

    setScore(correctCount);
    try {
      const { data, error } = await supabase
        .from("test_attempts")
        .insert([{ test_id, student_id, submitted_test: submittedTestArray, score:correctCount }]);

      if (error) {
        throw new Error(error.message);
      }
    } catch (error) {
      console.error("Error submitting test attempt:", error);
    }

    
    setSubmitted(true);
  }

  const isAnswerCorrect = (questionIndex, option) => {
    if (!submitted) return null;

    const question = displayQuestions[questionIndex];
    if (option === question.correctAnswer) {
      return true;
    }
    return selectedAnswers[questionIndex] === option ? false : null;
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-6 text-center">
        <h1 className="text-2xl font-bold mb-2">{displayQuestions.length > 0 ? displayQuestions[0].Title : "Loading..."}</h1>
      </div>

      {displayQuestions.length === 0 ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500 border-solid"></div>
        </div>
      ) : (
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
                    const isCorrect = isAnswerCorrect(questionIndex, option);
                    return (
                      <div
                        key={optionIndex}
                        className={`flex items-center gap-2 p-2 rounded ${selectedAnswers[questionIndex] === option ? "bg-blue-50" : ""} ${isCorrect === true ? "bg-green-50" : isCorrect === false ? "bg-red-50" : ""}`}
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
      )}

      {displayQuestions.length > 0 && (
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
      )}
    </div>
  )
}