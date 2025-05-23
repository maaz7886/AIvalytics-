"use client"

import { useSearchParams } from "next/navigation"
import { useState } from "react"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export default function ForgotPasswordForm() {
  const [email, setEmail] = useState("")
  const [submitted, setSubmitted] = useState(false)
  const searchParams = useSearchParams()
  const role = searchParams.get("role") || "teacher"

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log({ email, role })
    setSubmitted(true)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white relative">
      <Link
        href={`/authentication/login?role=${role}`}
        className="absolute top-8 left-8 flex items-center text-gray-600 hover:text-gray-900 transition-colors"
      >
        <ArrowLeft className="w-5 h-5 mr-2" />
        Back to Login
      </Link>
      
      <div className="flex items-center justify-center min-h-screen px-4">
        <div className="w-full max-w-md">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-50 to-blue-50 rounded-2xl transform rotate-1 opacity-70"></div>
            <div className="relative bg-white rounded-2xl shadow-xl p-8 space-y-8 transition-transform hover:scale-[1.01] duration-300">
              {!submitted ? (
                <>
                  <div className="text-center">
                    <h1 className="text-3xl font-bold tracking-tight text-gray-900">
                      Reset Password
                    </h1>
                    <p className="mt-3 text-lg text-gray-600">
                      Enter your email to reset your password
                    </p>
                  </div>

                  <form className="space-y-6" onSubmit={handleSubmit}>
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                        Email Address
                      </label>
                      <input
                        id="email"
                        name="email"
                        type="email"
                        autoComplete="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter your email"
                        className="block w-full px-4 py-3 mt-1 placeholder-gray-400 border border-gray-200 rounded-xl shadow-sm appearance-none transition-colors focus:outline-none focus:ring-2 focus:ring-offset-0 focus:ring-emerald-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <button
                        type="submit"
                        className={`flex justify-center w-full px-4 py-3 text-sm font-semibold text-white rounded-xl shadow-md transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                          role === "teacher"
                            ? "bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 focus:ring-emerald-500"
                            : "bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 focus:ring-blue-500"
                        } hover:shadow-lg transform hover:-translate-y-0.5`}
                      >
                        Send Reset Link
                      </button>
                    </div>
                  </form>
                </>
              ) : (
                <div className="text-center space-y-6">
                  <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-2">
                    <svg className="w-8 h-8 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">Check Your Email</h2>
                    <p className="mt-2 text-gray-600">
                      We have sent a password reset link to <span className="font-medium">{email}</span>
                    </p>
                    <p className="mt-4 text-sm text-gray-500">
                      Did not receive the email? Check your spam folder or try again.
                    </p>
                  </div>
                  <button
                    onClick={() => setSubmitted(false)}
                    className={`text-sm font-medium transition-colors ${
                      role === "teacher" ? "text-emerald-600 hover:text-emerald-500" : "text-blue-600 hover:text-blue-500"
                    }`}
                  >
                    Try another email
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}