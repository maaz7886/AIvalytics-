"use client";

import { useState } from "react";

export default function MCQGenerator() {
  const [topic, setTopic] = useState("");
  const [mcqs, setMcqs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [answers, setAnswers] = useState({});
  const [score, setScore] = useState(null);

  const fetchMCQs = async () => {
    if (!topic) return;
    setLoading(true);
    setMcqs([]);
    setScore(null);

    try {
      const response = await fetch("/api/generate-mcqs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic }),
      });
      const data = await response.json();
      setMcqs(data.mcqs || []);
    } catch (error) {
      console.error("Error fetching MCQs:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    try {
      const response = await fetch("/api/submit-answers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ answers, mcqs }),
      });
      const data = await response.json();
      setScore(data.score);
    } catch (error) {
      console.error("Error submitting answers:", error);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">MCQ Generator</h1>
      <input
        type="text"
        value={topic}
        onChange={(e) => setTopic(e.target.value)}
        placeholder="Enter a topic..."
        className="w-full p-2 border rounded mb-4"
      />
      <button
        onClick={fetchMCQs}
        disabled={loading}
        className="bg-blue-500 text-white px-4 py-2 rounded disabled:opacity-50"
      >
        {loading ? "Generating..." : "Generate MCQs"}
      </button>

      {mcqs.length > 0 && (
        <div className="mt-6">
          {mcqs.map((mcq, index) => (
            <div key={index} className="p-4 border rounded mb-4">
              <p className="font-semibold">{mcq.question}</p>
              <ul className="mt-2">
                {mcq.options.map((option, idx) => (
                  <li key={idx} className="flex items-center gap-2">
                    <input
                      type="radio"
                      name={`mcq-${index}`}
                      value={option}
                      id={`mcq-${index}-${idx}`}
                      onChange={() =>
                        setAnswers({ ...answers, [index]: option })
                      }
                    />
                    <label htmlFor={`mcq-${index}-${idx}`}>{option}</label>
                  </li>
                ))}
              </ul>
            </div>
          ))}
          <button
            onClick={handleSubmit}
            className="bg-green-500 text-white px-4 py-2 rounded mt-4"
          >
            Submit Answers
          </button>
          {score !== null && (
            <p className="mt-4 text-lg font-bold">
              Your Score: {score} / {mcqs.length}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
