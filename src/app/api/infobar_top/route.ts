import { NextResponse } from "next/server";
import McqTest from "../models/Mcq_tests";
import { connectDB } from "../mongodb";




export async function GET() {
  try {
    await connectDB();

 
    // Counting tests
    const testCount = await McqTest.countDocuments();
    const activeTestCount = await McqTest.countDocuments({ status: "Active" });

    console.log("Total Test Count:", testCount);

    return NextResponse.json({ count: testCount,activeTestCount:activeTestCount });
  } catch (error) {
    console.error("Error fetching test count:", error);
    return NextResponse.json({ error: "Error fetching test count" }, { status: 500 });
  }
}
