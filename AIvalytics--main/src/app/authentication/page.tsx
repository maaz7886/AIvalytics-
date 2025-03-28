import Link from "next/link"
import { GraduationCap, BookOpen } from "lucide-react"

export default function WelcomePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900">Welcome to Aialvaytics</h1>
          <p className="mt-4 text-xl text-gray-600">Choose how you want to continue</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {/* Teacher Section */}
          <div className="bg-white rounded-lg shadow-sm p-8 border-t-4 border-emerald-500 flex flex-col items-center">
            <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mb-6">
              <GraduationCap className="w-10 h-10 text-emerald-500" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">I am a Teacher</h2>
            <p className="text-gray-600 text-center mb-8">
              Access your dashboard, create courses, and manage your students
            </p>
            <div className="mt-auto space-y-4 w-full">
              <Link
                href="/authentication/login?role=teacher"
                className="flex justify-center w-full px-6 py-3 text-white bg-emerald-500 rounded-md hover:bg-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
              >
                Login as Teacher
              </Link>
              <Link
                href="/authentication/register?role=teacher"
                className="flex justify-center w-full px-6 py-3 text-emerald-600 bg-white border border-emerald-500 rounded-md hover:bg-emerald-50 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
              >
                Register as Teacher
              </Link>
            </div>
          </div>

          {/* Student Section */}
          <div className="bg-white rounded-lg shadow-sm p-8 border-t-4 border-blue-500 flex flex-col items-center">
            <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mb-6">
              <BookOpen className="w-10 h-10 text-blue-500" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">I am a Student</h2>
            <p className="text-gray-600 text-center mb-8">
              Access your courses, track your progress, and connect with teachers
            </p>
            <div className="mt-auto space-y-4 w-full">
              <Link
                href="/authentication/login?role=student"
                className="flex justify-center w-full px-6 py-3 text-white bg-blue-500 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Login as Student
              </Link>
              <Link
                href="/authentication/register?role=student"
                className="flex justify-center w-full px-6 py-3 text-blue-600 bg-white border border-blue-500 rounded-md hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Register as Student
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

