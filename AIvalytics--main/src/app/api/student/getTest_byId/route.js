import { supabase } from "@/lib/supabase/client";
import { NextResponse } from "next/server";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const testId = searchParams.get("id"); // Get the test ID from query parameters

  if (!testId) {
    return NextResponse.json({ error: "Test ID is required" }, { status: 400 });
  }

  try {
    // Call the Supabase function to get questions by test ID
    const { data, error } = await supabase
      .rpc('get_questions_by_test_id', { test_id: testId });

    if (error) {
      throw new Error(error.message);
    }

    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error("Error fetching questions:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
