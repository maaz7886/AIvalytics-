"use client"
import { useRouter, useSearchParams } from "next/navigation"
import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { Check } from "lucide-react"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [message, setMessage] = useState("")
  const [rememberMe, setRememberMe] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()
  const role = searchParams.get("role") || "teacher" // Default to teacher if no role specified

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setMessage("")

    try {
      // Use different endpoints based on role
      const endpoint = role === "teacher" ? "/api/auth/teacherLogin" : "/api/auth/studentLogin"

      const res = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      })

      const data = await res.json()
      console.log("Full response:", data)

      setMessage(data.message || data.error)

      if (res.ok) {
        console.log("Redirecting...")
        // Redirect to appropriate dashboard based on role
        router.push(role === "teacher" ? "/dashboard/teacher" : "/dashboard/student")
      }
    } catch (error) {
      console.error("Login error:", error)
      setMessage("Something went wrong.")
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-sm">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">
            Welcome Back {role === "teacher" ? "Teacher" : "Student"}
          </h1>
          <p className="mt-2 text-gray-600">Please login to your account</p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleLogin}>
          <div className="space-y-6">
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
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="block w-full px-3 py-2 mt-1 placeholder-gray-400 border border-gray-300 rounded-md shadow-sm appearance-none focus:outline-none focus:ring-emerald-500 focus:border-emerald-500"
              />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <button
                type="button"
                className={`flex items-center justify-center w-5 h-5 border rounded ${
                  rememberMe ? "bg-emerald-500 border-emerald-500" : "border-gray-300"
                }`}
                onClick={() => setRememberMe(!rememberMe)}
              >
                {rememberMe && <Check className="w-4 h-4 text-white" />}
              </button>
              <label htmlFor="remember-me" className="block ml-2 text-sm text-gray-700">
                Remember me
              </label>
            </div>

            <div className="text-sm">
              <Link href="/authentication/forgot_pass" className="font-medium text-emerald-500 hover:text-emerald-400">
                Forgot password?
              </Link>
            </div>
          </div>

          <div>
            <button
              type="submit"
              className={`flex justify-center w-full px-4 py-2 text-sm font-medium text-white border border-transparent rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                role === "teacher"
                  ? "bg-emerald-500 hover:bg-emerald-600 focus:ring-emerald-500"
                  : "bg-blue-500 hover:bg-blue-600 focus:ring-blue-500"
              }`}
            >
              Login
            </button>
          </div>
        </form>

        <div className="text-center text-sm">
          <span className="text-gray-600">Don&apos;t have an account? </span>
          <Link
            href={`/authentication/register?role=${role}`}
            className={`font-medium hover:text-opacity-90 ${role === "teacher" ? "text-emerald-500" : "text-blue-500"}`}
          >
            Create Account
          </Link>
        </div>
      </div>
    </div>
  )
}

