import { NextResponse } from "next/server";

export async function POST(request) {
    try {
        const { topic, difficulty, noOfQue, testTitle } = await request.json();

        if (!topic || !noOfQue || !testTitle) {
            return NextResponse.json(
                { error: "Topic, number of questions and test title are required" }, 
                { status: 400 }
            );
        }

        // Verify OpenRouter API key is present
        if (!process.env.OPENROUTER_API_KEY) {
            console.error("OpenRouter API key is missing");
            return NextResponse.json(
                { error: "Server configuration error" },
                { status: 500 }
            );
        }

        const systemPrompt = "You are a specialized MCQ generator that only outputs valid JSON arrays containing multiple choice questions. Never include any additional text or explanations outside the JSON structure.";
        
        const userPrompt = `Create ${noOfQue} multiple choice questions about ${topic} at ${difficulty || "easy"} difficulty level. Format as JSON array:
[{
  "Title": "${testTitle}",
  "question": "brief question",
  "options": ["brief1", "brief2", "brief3", "brief4"],
  "correctAnswer": "exact match from options",
  "explanation": "very brief explanation"
}]`;

        const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
                "HTTP-Referer": process.env.SITE_URL || "http://localhost:3000",
                "X-Title": "AIvalytics MCQ Generator"
            },
            body: JSON.stringify({
                model: "deepseek/deepseek-prover-v2:free",
                messages: [
                    { role: "system", content: systemPrompt },
                    { role: "user", content: userPrompt }
                ],
                temperature: 0.5,
                max_tokens: 1500,
                top_p: 0.9,
                frequency_penalty: 0.0,
                presence_penalty: 0.0
            })
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error?.message || 'Failed to generate MCQs');
        }

        const aiResponse = await response.json();
        console.log("Raw AI Response:", JSON.stringify(aiResponse, null, 2));
        
        let mcqs;
        
        try {
            // Get the raw content and handle potential JSON formatting
            const rawContent = aiResponse.choices[0].message.content;
            console.log("Raw content:", rawContent);

            if (!rawContent) {
                throw new Error('Empty response from AI');
            }

            // Try to extract just the JSON array part
            const jsonMatch = rawContent.match(/\[[\s\S]*\]/);
            if (!jsonMatch) {
                // If no array found, try parsing the raw content directly
                mcqs = JSON.parse(rawContent);
            } else {
                const jsonString = jsonMatch[0]
                    .replace(/\n/g, ' ')
                    .replace(/\s+/g, ' ')
                    .trim();
                
                console.log("Extracted JSON string:", jsonString);
                mcqs = JSON.parse(jsonString);
            }

            // Validate MCQ format
            if (!Array.isArray(mcqs)) {
                throw new Error('Response is not an array');
            }

            // Validate each MCQ
            mcqs.forEach((mcq, index) => {
                if (!mcq.Title || !mcq.question || !Array.isArray(mcq.options) || 
                    mcq.options.length !== 4 || !mcq.correctAnswer || !mcq.explanation) {
                    throw new Error(`Invalid MCQ format at index ${index}`);
                }
            });

        } catch (jsonError) {
            console.error("JSON Parsing Error:", jsonError);
            return NextResponse.json({ 
                error: "Failed to parse AI response as JSON",
                details: jsonError.message,
                rawContent: aiResponse.choices[0].message.content
            }, { status: 500 });
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


