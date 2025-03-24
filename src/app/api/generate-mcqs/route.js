import { NextResponse } from "next/server";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";

export async function POST(request) {
    try {
        const { topic,difficulty } = await request.json();

        if (!topic) {
            return NextResponse.json({ error: "Topic is required" }, { status: 400 });
        }

        const llm = new ChatGoogleGenerativeAI({
            model: "gemini-1.5-pro",
            temperature: 2,
            maxRetries: 2,
        });

        const prompt = `Generate 5 multiple-choice questions (MCQs) on the topic "${topic}" & difficulty ${difficulty}. 
        Each MCQ should have 4 options, one correct answer, and a brief explanation of the correct answer.
        Provide the response in a clean, minified JSON array format without additional text or comments.
        Ensure valid JSON format: 
        [
          {"id": "random 5 digit number id","question": "...", "options": ["...", "...", "...", "..."], "correctAnswer": "...", "explanation": "..."},
          ...
        ]`;

        const aiResponse = await llm.invoke([["human", prompt]]);
        // console.log(aiResponse.content)
        let mcqs;
        try {
            const jsonString = aiResponse.content.trim().replace(/```json|```/g, "");
            mcqs = JSON.parse(jsonString);
        } catch (jsonError) {
            console.error("JSON Parsing Error:", jsonError);
            return NextResponse.json({ error: "Failed to parse AI response as JSON" }, { status: 500 });
        }

        return NextResponse.json({ mcqs });
    } catch (error) {
        console.error("MCQ generation error:", error);
        return NextResponse.json({ error: "Failed to generate MCQs" }, { status: 500 });
    }
}
