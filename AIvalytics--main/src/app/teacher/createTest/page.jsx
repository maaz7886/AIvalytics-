"use client"


import { useRouter } from 'next/navigation';
import { useState } from "react"
import { Trash2, Plus, Wand2, X } from "lucide-react"
import TestPreview from "./test-preview"

export default function MCQGenerator() {

    const router = useRouter();

    const [testTitle, setTestTitle] = useState("")
    const [subject, setSubject] = useState("")
    const [topic, setTopic] = useState("")
    const [difficulty, setDifficulty] = useState("Easy")
    const [studentClass, setStudentClass] = useState("SYBCA-A")
    const [noOfQue, setNoOfQue] = useState("5")
    const [randomizeQuestions, setRandomizeQuestions] = useState(false)


    const [mcqs, setMcqs] = useState([])
    const [loading, setLoading] = useState(false)
    const [showPreview, setShowPreview] = useState(false)

    const fetchMCQs = async () => {
        if (!testTitle || !topic) return
        setLoading(true)

        try {
            const response = await fetch("/api/generate-mcqs", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ topic, difficulty, noOfQue,testTitle }),
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

    const saveTest = () => {
        // Implement save functionality
        router.push('/teacher/publishTest')
        localStorage.removeItem('mcqs')
        // Save MCQs to local storage for now
      localStorage.setItem('mcqs', JSON.stringify(mcqs));

    }

    const togglePreview = () => {
        setShowPreview(!showPreview)
    }

    return (
        <div className="max-w-7xl mx-auto p-6 ">
            <h1 className="text-3xl font-bold mb-6">Create New Test</h1>

            <div className=" gap-6">
                <div className=" space-y-6">
                    <div className="bg-white p-6 rounded-lg border border-gray-300 shadow-sm">
                        <div className=" flex gap-4 mb-6">
                            <div className=" flex-1/2">
                                <label className="block text-sm font-medium mb-1">Test Title</label>
                                <input
                                    type="text"
                                    value={testTitle}
                                    onChange={(e) => setTestTitle(e.target.value)}
                                    placeholder="Enter test title"
                                    className="w-full p-2 border border-gray-300 rounded"
                                />
                            </div>

                            {/* Difficulty */}
                            <div className=" flex-1/4">
                                <label className="block text-sm font-medium mb-1">Difficulty Level</label>
                                <select
                                    value={difficulty}
                                    onChange={(e) => setDifficulty(e.target.value)}
                                    className="w-full p-2 border border-gray-300 rounded"
                                >
                                    <option value="Easy">Easy</option>
                                    <option value="Medium">Medium</option>
                                    <option value="Hard">Hard</option>
                                </select>
                            </div>

                            {/* Difficulty */}
                            <div className=" flex-1/4">
                                <label className="block text-sm font-medium mb-1">Student classes</label>
                                <select
                                    value={studentClass}
                                    onChange={(e) => setStudentClass(e.target.value)}
                                    className="w-full p-2 border border-gray-300 rounded"
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

                        <div className="mb-6">
                            <label className="block text-sm font-medium mb-1">Topic</label>
                            <textarea
                                value={topic}
                                onChange={(e) => setTopic(e.target.value)}
                                placeholder="Enter topic"
                                rows={5}
                                className="w-full p-2 border border-gray-300 rounded resize-none"
                            />
                        </div>
                        <div className="flex gap-x-5 justify-between pl-1">
                            <div className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    id="randomize"
                                    checked={randomizeQuestions}
                                    onChange={(e) => setRandomizeQuestions(e.target.checked)}
                                    className="w-4 h-4"
                                />
                                <label htmlFor="randomize">Randomize questions</label>
                            </div>


                            <div className=" ">
                                <label className="block text-sm font-medium mb-1">no. of Question's</label>
                                <select
                                    value={noOfQue}
                                    onChange={(e) => setNoOfQue(e.target.value)}
                                    className="w-full p-2 border border-gray-300 rounded"
                                >
                                    <option value="5">5</option>
                                    <option value="10">10</option>
                                    <option value="15">15</option>

                                </select>
                            </div>


                            <button
                                onClick={fetchMCQs}
                                disabled={!loading||!topic || !testTitle}
                                className="flex items-center gap-1 bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded disabled:opacity-50 transition"
                            >
                                <Wand2 className="w-4 h-4" />
                                <span>{loading ? "Generating..." : "Generate with AI"}</span>
                            </button>
                            <button
                                onClick={addQuestion}
                                className="flex items-center gap-1 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded transition"
                            >
                                <Plus className="w-4 h-4" />
                                <span>Add Question</span>
                            </button>
                            <button onClick={togglePreview} className="px-6 py-2 border border-gray-300 rounded hover:bg-gray-50 transition">
                                Preview
                            </button>
                            <button
                                onClick={() => saveTest()}
                                className="px-4 py-2 bg-emerald-500 text-white rounded hover:bg-emerald-600 transition"
                            >
                                Publish Test
                            </button>
                        </div>
                    </div>

                    <div className="bg-white w-full p-6  rounded-lg border border-gray-300 shadow-sm">
                        <div className="flex justify-center w-full items-center mb-4">
                            <h2 className="text-xl font-semibold border-b border-gray-400">Questions</h2>

                        </div>
                        <div className="flex  flex-wrap gap-6  justify-center ">

                            {mcqs.map((mcq, questionIndex) => (
                                <div key={questionIndex} className=" sm:w-[31%] p-4 border  border-gray-300 rounded-lg relative">
                                    <button
                                        onClick={() => removeQuestion(questionIndex)}
                                        className="absolute top-2 right-2 text-gray-500 hover:text-red-500"
                                    >
                                        <Trash2 className="w-5 h-5" />
                                    </button>

                                    <div className="mb-4">
                                        <label className="block text-sm font-medium mb-1">Question {questionIndex + 1}</label>
                                        <textarea
                                            value={mcq.question}
                                            onChange={(e) => updateQuestion(questionIndex, "question", e.target.value)}
                                            placeholder="Enter question"
                                            className="w-full p-2 border border-gray-300 rounded"
                                            rows={3}
                                        />
                                    </div>

                                    <div className="space-y-3">
                                        {mcq.options.map((option, optionIndex) => (
                                            <div key={optionIndex} className="flex items-center gap-2">
                                                <input
                                                    type="radio"
                                                    name={`correct-${questionIndex}`}
                                                    checked={mcq.correctAnswer === option && option !== ""}
                                                    onChange={() => setCorrectAnswer(questionIndex, option)}
                                                    disabled={option === ""}
                                                    className="w-4 h-4"
                                                />
                                                <input
                                                    type="text"
                                                    value={option}
                                                    onChange={(e) => updateOption(questionIndex, optionIndex, e.target.value)}
                                                    placeholder={`Option ${optionIndex + 1}`}
                                                    className="flex-1 p-2 border border-gray-300 rounded"
                                                />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>

                    </div>
                </div>

            </div>

            <div className="flex justify-end gap-3 mt-6">

            </div>

            {/* Preview Modal */}
            {showPreview && (
                <div
                    className="fixed inset-0 bg-transparent backdrop-blur-md  flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-l border   shadow-lg w-full max-w-4xl max-h-[90vh] overflow-auto">
                        <div className="flex  justify-between items-center p-4 border-b border-gray-300-b">
                            <h2 className="text-xl font-bold">Test Preview</h2>
                            <button onClick={togglePreview} className="text-gray-500 hover:text-gray-700">
                                <X className="w-6 h-6" />
                            </button>
                        </div>
                        <div className="p-6">
                            <TestPreview
                                testTitle={testTitle || "Untitled Test"}
                                subject={subject}
                                topic={topic}
                                difficulty={difficulty}
                                questions={mcqs}
                                randomizeQuestions={randomizeQuestions}
                            />
                        </div>
                        <div className="p-4 border-t border-gray-300-t flex justify-end">
                            <button onClick={togglePreview} className="px-4 py-2  border border-gray-400 rounded hover:bg-gray-200 transition">
                                Close Preview
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

