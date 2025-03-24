import Teacher from "@/app/models/Teacher";
import connectdb from "@/app/lib/mongodb";
import { NextResponse } from "next/server";

export async function POST(req) {
  await connectdb();

  const body = await req.json();
  const { email, password } = body;
  

  try {
    const teacher = await Teacher.findOne({ email });

    console.log('====================================');
    console.log(teacher);
    console.log('====================================');
    if (!teacher) {
      return NextResponse.json({ error: "Teacher not found" }, { status: 404 });
    }

    if (teacher.password !== password) {
      return NextResponse.json({ error: "Invalid password" }, { status: 401 });
    }

    return NextResponse.json({ message: "Login successful", teacher }, { status: 200 });
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { success: true, message: "Login successful", teacher },
      { status: 200 }
    );
      }
}
