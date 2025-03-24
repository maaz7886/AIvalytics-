import { NextResponse } from "next/server";
import Teacher from "../../models/teacherModel";
import { connectDB } from "../../mongodb";

 // Database connection function


export async function POST(req:any) {
  try {
    await connectDB(); // Ensure DB is connected

    const { email, password } = await req.json(); // Get email & password from request

    // Find teacher by email
    const teacher = await Teacher.findOne({ email });

    if (!teacher) {
      return NextResponse.json({ success: false, message: "Teacher not found" }, { status: 404 });
    }

    // Check password
    if (teacher.password !== password) {
      return NextResponse.json({ success: false, message: "Invalid credentials" }, { status: 401 });
    }

    // Login successful
    return NextResponse.json({ success: true, message: "Login successful", teacher }, { status: 200 });

  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
  }
}
