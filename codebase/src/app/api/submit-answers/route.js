import { NextResponse } from "next/server";

export async function POST(request) {
    try {
        const { answers, mcqs } = await request.json();
        let score = 0;

        mcqs.forEach((mcq, index) => {
            if (answers[index] === mcq.correct_answer) {
                score += 1;
            }
        });

        return NextResponse.json({ score });
    } catch (error) {
        console.error("Error processing answers:", error);
        return NextResponse.json(
            { error: "Failed to process answers" },
            { status: 500 }
        );
    }
}
