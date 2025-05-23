"use client"
import { useRouter, useSearchParams } from "next/navigation"
import { useState } from "react"
import Link from "next/link"
import { supabase } from "@/lib/supabase/client"
import { ArrowLeft } from "lucide-react"

export default function RegisterPage() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [message, setMessage] = useState("")
  const [loading, setLoading] = useState(false)

  const router = useRouter()
  const searchParams = useSearchParams()
  const role = searchParams.get("role") || "students"

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setMessage("")

    if (password !== confirmPassword) {
      setMessage("Passwords do not match")
      setLoading(false)
      return
    }

    try {
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
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white relative">
      <Link
        href="/authentication"
        className="absolute top-8 left-8 flex items-center text-gray-600 hover:text-gray-900 transition-colors"
      >
        <ArrowLeft className="w-5 h-5 mr-2" />
        Back to Welcome
      </Link>
      
      <div className="flex items-center justify-center min-h-screen px-4">
        <div className="w-full max-w-md">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-50 to-blue-50 rounded-2xl transform rotate-1 opacity-70"></div>
            <div className="relative bg-white rounded-2xl shadow-xl p-8 space-y-8 transition-transform hover:scale-[1.01] duration-300">
              <div className="text-center">
                <h1 className="text-3xl font-bold tracking-tight text-gray-900">
                  Join{" "}
                  <span className="bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent">
                    Aivalytics
                  </span>
                </h1>
                <p className="mt-3 text-lg text-gray-600">
                  Create your {role === "teachers" ? "teacher" : "student"} account
                </p>
              </div>

              {message && (
                <div
                  className={`p-4 rounded-xl ${
                    message.includes("success")
                      ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                      : "bg-red-50 text-red-800 border border-red-200"
                  }`}
                >
                  {message}
                </div>
              )}

              <form className="space-y-6" onSubmit={handleSubmit}>
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Full Name</label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Enter your full name"
                      className="block w-full px-4 py-3 mt-1 placeholder-gray-400 border border-gray-200 rounded-xl shadow-sm appearance-none transition-colors focus:outline-none focus:ring-2 focus:ring-offset-0 focus:ring-emerald-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Email</label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email"
                      className="block w-full px-4 py-3 mt-1 placeholder-gray-400 border border-gray-200 rounded-xl shadow-sm appearance-none transition-colors focus:outline-none focus:ring-2 focus:ring-offset-0 focus:ring-emerald-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Password</label>
                    <input
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Create a password"
                      className="block w-full px-4 py-3 mt-1 placeholder-gray-400 border border-gray-200 rounded-xl shadow-sm appearance-none transition-colors focus:outline-none focus:ring-2 focus:ring-offset-0 focus:ring-emerald-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Confirm Password</label>
                    <input
                      type="password"
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Confirm your password"
                      className="block w-full px-4 py-3 mt-1 placeholder-gray-400 border border-gray-200 rounded-xl shadow-sm appearance-none transition-colors focus:outline-none focus:ring-2 focus:ring-offset-0 focus:ring-emerald-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div>
                  <button
                    type="submit"
                    disabled={loading}
                    className={`flex justify-center w-full px-4 py-3 text-sm font-semibold text-white rounded-xl shadow-md transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                      role === "teachers"
                        ? "bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 focus:ring-emerald-500"
                        : "bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 focus:ring-blue-500"
                    } ${loading ? "opacity-50 cursor-not-allowed" : "hover:shadow-lg transform hover:-translate-y-0.5"}`}
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
                  className={`font-medium transition-colors ${
                    role === "teachers" 
                      ? "text-emerald-600 hover:text-emerald-500" 
                      : "text-blue-600 hover:text-blue-500"
                  }`}
                >
                  Sign in
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}