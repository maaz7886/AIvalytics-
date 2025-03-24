import connectdb from "@/app/lib/mongodb";
import Teacher from "@/app/models/Teacher";
import { NextResponse } from "next/server";

export async function POST(req) {
  await connectdb();

  try {
    const body = await req.json();
    const { name, email, password } = body;

    const teacher = new Teacher({ name, email, password });
    await teacher.save();

    return NextResponse.json({ teacher }, { status: 201 });
  } catch (error) {
    console.error("Error saving teacher:", error);
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
