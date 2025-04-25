"use client"
import { useRouter, useSearchParams } from "next/navigation"
import { useState } from "react"
import Link from "next/link"
import { supabase } from "@/lib/supabase/client"

export default function RegisterPage() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [message, setMessage] = useState("")
  
  const [loading, setLoading] = useState(false)

  const router = useRouter()

  const searchParams = useSearchParams()
  const role = searchParams.get("role") || "students" // default: students

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    setMessage("")

    if (password !== confirmPassword) {
      setMessage("Passwords do not match")
      return
    }

    try {
      // Attempt to insert the new user into the respective table
      const { data:user,error } = await supabase
        .from(role)
        .insert([{ full_name: name, email, password }])
        .select('*').single();

      if (error) {
        setMessage("Something went wrong.");
      } else {
        localStorage.removeItem(`Auth${role}`)
        localStorage.setItem(`Auth${role}`, JSON.stringify(user));
        setMessage("Account created successfully!");
        router.push(role === "teachers" ? "/teacher/dashboard" : "/student");
      }
    } catch (error) {
      console.error("Registration error:", error);
      setMessage("An unexpected error occurred. Please try again.");
    } finally {
      // Optional: Any cleanup or final actions can be performed here
      console.log("Registration attempt finished.");
      setLoading(false)
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-sm">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">
            Create a {role === "teachers" ? "Teacher" : "Student"} Account
          </h1>
          <p className="mt-2 text-gray-600">Sign up to get started</p>
        </div>

        {message && (
          <div
            className={`p-3 rounded-md ${
              message.includes("success") ? "bg-green-50 text-green-800" : "bg-red-50 text-red-800"
            }`}
          >
            {message}
          </div>
        )}

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">Full Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-emerald-500 focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-emerald-500 focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-emerald-500 focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Confirm Password</label>
              <input
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-emerald-500 focus:border-emerald-500"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className={`flex justify-center w-full px-4 py-2 text-sm font-medium text-white border border-transparent rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 ${role === "teachers"
                  ? "bg-emerald-500 hover:bg-emerald-600 focus:ring-emerald-500"
                  : "bg-blue-500 hover:bg-blue-600 focus:ring-blue-500"
                } ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
            >
              {loading ? (
                <svg
                  className="w-5 h-5 mr-3 -ml-1 text-white animate-spin"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v8H4z"
                  ></path>
                </svg>
              ) : (
                "Create Account"
              )}
            </button>
          </div>
        </form>

        <div className="text-center text-sm">
          <span className="text-gray-600">Already have an account? </span>
          <Link
            href={`/authentication/login?role=${role}`}
            
            className="font-medium text-blue-500 hover:text-blue-600"
          >
            Login
          </Link>
        </div>
      </div>
    </div>
  )
}