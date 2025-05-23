"use client"


import { useState } from "react"
import { Trash2, Plus, Wand2, X } from "lucide-react"
import TestPreview from "./test-preview"
import PublishModal from './publish-modal';
import { supabase } from '@/lib/supabase/client';
import { set } from "mongoose";

export default function MCQGenerator() {


    const [testTitle, setTestTitle] = useState("")
    const [topic, setTopic] = useState("")
    const [difficulty, setDifficulty] = useState("Easy")
    const [studentClass, setStudentClass] = useState("SYBCA-A")
    const [noOfQue, setNoOfQue] = useState("5")
    const [randomizeQuestions, setRandomizeQuestions] = useState(false)
    const [isModalOpen, setIsModalOpen] = useState(false)


    const [mcqs, setMcqs] = useState([])
    const [loading, setLoading] = useState(false)
    const [showPreview, setShowPreview] = useState(false)
    const [isPublishing, setIsPublishing] = useState(false)

    const fetchMCQs = async () => {
        if (!testTitle || !topic) return
        setLoading(true)

        try {
            const response = await fetch("/api/generate-mcqs", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ topic, difficulty, noOfQue, testTitle }),
            })
            const data = await response.json()
            setMcqs((pre) => [...data.mcqs, ...pre])

            console.log('====================================');
            console.log(data.mcqs);
            console.log('====================================');
        } catch (error) {
            console.error("Error fetching MCQs:", error)
        } finally {
            setLoading(false)
        }
    }

    const addQuestion = () => {
        const newQuestion = {
            id: mcqs.length + 1,
            question: "",
            options: ["", "", "", ""],
            correctAnswer: "",
        }
        setMcqs([newQuestion, ...mcqs])
    }

    const removeQuestion = (index) => {
        const updatedMcqs = [...mcqs]
        updatedMcqs.splice(index, 1)
        setMcqs(updatedMcqs)
    }

    const updateQuestion = (index, field, value) => {
        const updatedMcqs = [...mcqs]
        updatedMcqs[index][field] = value
        setMcqs(updatedMcqs)
    }

    const updateOption = (questionIndex, optionIndex, value) => {
        const updatedMcqs = [...mcqs]
        updatedMcqs[questionIndex].options[optionIndex] = value
        setMcqs(updatedMcqs)
    }

    const setCorrectAnswer = (questionIndex, option) => {
        const updatedMcqs = [...mcqs]
        updatedMcqs[questionIndex].correctAnswer = option
        setMcqs(updatedMcqs)
    }

  

    const togglePreview = () => {
        setShowPreview(!showPreview)
    }


    const PublishingOverlay = () => (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-white p-8 rounded-lg shadow-xl flex flex-col items-center space-y-6 max-w-md w-full mx-4">
                <div className="relative">
                    <div className="w-20 h-20 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                        <svg className="w-10 h-10 text-emerald-500" fill="none" viewBox="0 0 24 24">
                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2"/>
                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2"/>
                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6"/>
                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 16h6"/>
                        </svg>
                    </div>
                </div>
                <div className="text-center space-y-3">
                    <h3 className="text-xl font-semibold text-gray-900">Publishing Test</h3>
                    <p className="text-gray-600">Please wait while we save your test and prepare it for your students...</p>
                </div>
                <div className="flex space-x-2 items-center">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                    <div className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                    <div className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce"></div>
                </div>
            </div>
        </div>
    );

    const publishTest = async () => {
            try {
              setIsPublishing(true);
              // 1. First insert all questions
              
              const { data: questionsData, error: insertError } = await supabase
                .from('questions')
                .insert(mcqs)
                .select('id, created_at');
          
              if (insertError) {
                console.error('Question insertion error details:', insertError);
                throw new Error(`Failed to insert questions: ${insertError.message}`);
              }
          
              // 2. Check if questions were actually inserted
              if (!questionsData || questionsData.length === 0) {
                throw new Error('No questions were inserted - check your data');
              }
          
              // 3. Attempt to create test
              const { data, error } = await supabase
              .rpc('create_tests_in_batches');

            if (error) throw error;
            
            if (data) {
              alert(`Successfully created tests! `);
            } else {
              alert('No tests created - need at least 5 unused questions');
            }
            setMcqs([])
            setTestTitle("")
            setTopic("")
            setDifficulty("Easy")
            setStudentClass("SYBCA-A")
            setNoOfQue("5")
            setRandomizeQuestions(false)
            setLoading(false)
            setShowPreview(false)
            

        // setIsModalOpen(true)


            } catch (err) {
              // Proper error formatting
              const errorMessage = err instanceof Error ? err.message : JSON.stringify(err);
              console.error('Full publish error:', err);
              alert(`❌ Publish failed: ${errorMessage}`);
            } finally {
              setIsPublishing(false);
            }
          };

    const LoadingOverlay = () => (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-white p-8 rounded-lg shadow-xl flex flex-col items-center space-y-4">
                <div className="w-16 h-16 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
                <div className="text-center space-y-2">
                    <h3 className="text-lg font-semibold text-gray-900">Generating Questions</h3>
                    <p className="text-gray-500 text-sm">Using AI to create high-quality MCQs...</p>
                </div>
                <div className="flex space-x-2 items-center mt-2">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                    <div className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                    <div className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce"></div>
                </div>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {loading && <LoadingOverlay />}
                {isPublishing && <PublishingOverlay />}
                
                <div className="mb-8">
                    <h1 className="text-4xl font-bold text-gray-900">Create New Test</h1>
                    <p className="mt-2 text-gray-600">Design your test questions and configure test settings</p>
                </div>

                <div className="space-y-6">
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                        <div className="p-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
                                <div className="col-span-1 md:col-span-2 lg:col-span-1">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Test Title</label>
                                    <input
                                        type="text"
                                        value={testTitle}
                                        onChange={(e) => setTestTitle(e.target.value)}
                                        placeholder="Enter test title"
                                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Difficulty Level</label>
                                    <select
                                        value={difficulty}
                                        onChange={(e) => setDifficulty(e.target.value)}
                                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all appearance-none bg-white"
                                    >
                                        <option value="Easy">Easy</option>
                                        <option value="Medium">Medium</option>
                                        <option value="Hard">Hard</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Student Class</label>
                                    <select
                                        value={studentClass}
                                        onChange={(e) => setStudentClass(e.target.value)}
                                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all appearance-none bg-white"
                                    >
                                        <option value="SYBCA-C">SYBCA-C</option>
                                        <option value="SYMCA-B">SYMCA-B</option>
                                        <option value="SYMCA-C">SYMCA-C</option>
                                        <option value="FYBCA-A">FYBCA-A</option>
                                        <option value="FYBCA-B">FYBCA-B</option>
                                        <option value="TYBCA-A">TYBCA-A</option>
                                        <option value="TYBCA-B">TYBCA-B</option>
                                        <option value="TYMCA-A">TYMCA-A</option>
                                    </select>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Topic</label>
                                    <textarea
                                        value={topic}
                                        onChange={(e) => setTopic(e.target.value)}
                                        placeholder="Enter the topic for question generation..."
                                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all min-h-[100px]"
                                    />
                                </div>

                                <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Number of Questions</label>
                                            <select
                                                value={noOfQue}
                                                onChange={(e) => setNoOfQue(e.target.value)}
                                                className="w-32 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all appearance-none bg-white"
                                            >
                                                <option value="5">5</option>
                                                <option value="10">10</option>
                                                <option value="15">15</option>
                                                <option value="20">20</option>
                                            </select>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <input
                                                type="checkbox"
                                                id="randomize"
                                                checked={randomizeQuestions}
                                                onChange={(e) => setRandomizeQuestions(e.target.checked)}
                                                className="w-4 h-4 text-blue-500 border-gray-300 rounded focus:ring-blue-500"
                                            />
                                            <label htmlFor="randomize" className="text-sm text-gray-700">Randomize Questions</label>
                                        </div>
                                    </div>
                                    <div className="flex space-x-4">
                                        <button
                                            onClick={fetchMCQs}
                                            className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all"
                                        >
                                            <Wand2 className="h-5 w-5 mr-2" />
                                            Generate Questions
                                        </button>
                                        <button
                                            onClick={addQuestion}
                                            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all"
                                        >
                                            <Plus className="h-5 w-5 mr-2" />
                                            Add Question
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {mcqs.length > 0 && (
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                            <div className="p-6">
                                <div className="flex justify-between items-center mb-6">
                                    <h2 className="text-xl font-semibold text-gray-900">Questions</h2>
                                    <div className="flex space-x-4">
                                        <button
                                            onClick={togglePreview}
                                            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all"
                                        >
                                            {showPreview ? "Edit Questions" : "Preview Test"}
                                        </button>
                                        <button
                                            onClick={publishTest}
                                            className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all"
                                        >
                                            Publish Test
                                        </button>
                                    </div>
                                </div>

                                {showPreview ? (
                                    <div 
                                        className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
                                        onClick={(e) => {
                                            // Only close if clicking the backdrop
                                            if (e.target === e.currentTarget) {
                                                togglePreview();
                                            }
                                        }}
                                    >
                                        <div className="bg-white rounded-xl shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col">
                                            <div className="p-4 border-b border-gray-200 flex justify-between items-center">
                                                <h2 className="text-2xl font-bold text-gray-900">Test Preview</h2>
                                                <button
                                                    onClick={togglePreview}
                                                    className="p-2 text-gray-500 hover:text-gray-700 rounded-full hover:bg-gray-100 transition-all"
                                                >
                                                    <X className="h-5 w-5" />
                                                </button>
                                            </div>
                                            <div className="p-6 overflow-y-auto">
                                                <TestPreview
                                                    testTitle={testTitle}
                                                    topic={topic}
                                                    difficulty={difficulty}
                                                    questions={mcqs}
                                                    randomizeQuestions={randomizeQuestions}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                        {mcqs.map((mcq, index) => (
                                            <div key={index} className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                                                <div className="flex justify-between items-start mb-4">
                                                    <h3 className="text-lg font-medium text-gray-900">Question {index + 1}</h3>
                                                    <button
                                                        onClick={() => removeQuestion(index)}
                                                        className="p-1.5 text-gray-500 hover:text-red-500 hover:bg-red-50 rounded-full transition-all"
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </button>
                                                </div>
                                                <div className="space-y-4">
                                                    <textarea
                                                        value={mcq.question}
                                                        onChange={(e) => updateQuestion(index, "question", e.target.value)}
                                                        placeholder="Enter your question"
                                                        className="w-full p-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                                                        rows="3"
                                                    />
                                                    <div className="space-y-3">
                                                        {mcq.options.map((option, optionIndex) => (
                                                            <div key={optionIndex} className="flex items-center space-x-2">
                                                                <input
                                                                    type="radio"
                                                                    name={`correct-${index}`}
                                                                    checked={mcq.correctAnswer === option}
                                                                    onChange={() => setCorrectAnswer(index, option)}
                                                                    className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                                                                />
                                                                <input
                                                                    type="text"
                                                                    value={option}
                                                                    onChange={(e) => updateOption(index, optionIndex, e.target.value)}
                                                                    placeholder={`Option ${optionIndex + 1}`}
                                                                    className="flex-1 p-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                                                                />
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

