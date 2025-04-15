import { NextResponse } from "next/server";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";

export async function POST(request) {
    try {
        const { topic,difficulty,noOfQue, testTitle } = await request.json();

        if (!topic || !noOfQue || !testTitle) {
            return NextResponse.json(
                { error: "Topic, number of questions and test title are required" }, 
                { status: 400 }
            );
        }

        // Verify Google API key is present
        if (!process.env.GOOGLE_API_KEY) {
            console.error("Google API key is missing");
            return NextResponse.json(
                { error: "Server configuration error" },
                { status: 500 }
            );
        }

        const llm = new ChatGoogleGenerativeAI({
            model: "gemini-1.5-pro",
            apiKey: "AIzaSyDt_n7omlBI0D8B8N-U6wm6rSsTwU4UJK8", // Explicitly pass the API key
            temperature: 0.7, // Reduced from 2 (2 is too high)
            maxRetries: 2,
        });

        const prompt = `Generate ${noOfQue} multiple-choice questions (MCQs) on the topic "${topic}" & difficulty ${difficulty?difficulty:"easy"}. 
        Each MCQ should have 4 options,and also make  sure the correctAnswer have to be in random order not always, one correct answer, and a brief explanation of the correct answer.
        Provide the response in a clean, minified JSON array format without additional text or comments. in format dont chage the Title value it will be constant as i provided
        Ensure valid JSON format: 
        [
          {"Title":${testTitle},"question": "...", "options": ["...", "...", "...", "..."], "correctAnswer": "...", "explanation": "..."},
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
    } catch(error) {
        console.error("Full error:", {
            message: error.message,
            stack: error.stack,
            environment: process.env.NODE_ENV
        });
        
        return NextResponse.json(
            { 
                error: "Failed to generate MCQs",
                details: error.message 
            }, 
            { status: 500 }
        );
    }





}


