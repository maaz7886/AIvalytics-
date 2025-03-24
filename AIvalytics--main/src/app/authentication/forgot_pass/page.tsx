"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("")
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle password reset logic here
    console.log({ email })
    setSubmitted(true)
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-sm">
        {!submitted ? (
          <>
            <div className="text-center">
              <h1 className="text-2xl font-bold text-gray-900">Forgot Password</h1>
              <p className="mt-2 text-gray-600">Enter your email to reset your password</p>
            </div>

            <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email
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
                  className="block w-full px-3 py-2 mt-1 placeholder-gray-400 border border-gray-300 rounded-md shadow-sm appearance-none focus:outline-none focus:ring-emerald-500 focus:border-emerald-500"
                />
              </div>

              <div>
                <button
                  type="submit"
                  className="flex justify-center w-full px-4 py-2 text-sm font-medium text-white bg-emerald-500 border border-transparent rounded-md shadow-sm hover:bg-emerald-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
                >
                  Reset Password
                </button>
              </div>
            </form>
          </>
        ) : (
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900">Check Your Email</h1>
            <p className="mt-2 text-gray-600">We've sent a password reset link to {email}</p>
            <p className="mt-4 text-sm text-gray-500">Didn't receive the email? Check your spam folder or try again.</p>
            <button
              onClick={() => setSubmitted(false)}
              className="mt-6 text-sm font-medium text-emerald-500 hover:text-emerald-400"
            >
              Try another email
            </button>
          </div>
        )}

        <div className="text-center text-sm">
          <Link href="/login" className="font-medium text-emerald-500 hover:text-emerald-400">
            Back to Login
          </Link>
        </div>
      </div>
    </div>
  )
}

