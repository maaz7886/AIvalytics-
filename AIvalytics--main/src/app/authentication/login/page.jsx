"use client"
import { useRouter, useSearchParams } from "next/navigation"
import React from "react"
import { supabase } from "@/lib/supabase/client"
import { useState } from "react"
import Link from "next/link"
import { Check } from "lucide-react"

export default function LoginFormPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [rememberMe, setRememberMe] = useState(false)
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()
  const role = searchParams.get("role") || "students" // Default to student if no role specified

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      // Fetch user data from Supabase
      const { data: user, error } = await supabase
        .from(role) // Assuming your table is named based on the role
        .select('*')
        .eq('email', email)
        .single();

      if (error || !user) {
        console.error("User not found:", error);
        return; // Handle user not found
      }

      // Compare the password (make sure to hash the password when storing it)
      if (user.password !== password) {
        console.error("Invalid password");
        return; // Handle invalid password
      }

      // If login is successful
      console.log("Redirecting...", user);
      localStorage.setItem(`Auth${role}`, JSON.stringify(user));
      router.push(role === "teachers" ? "/teacher/dashboard" : "/student");
    } catch (error) {
      console.error("Login error:", error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-sm">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">
            Welcome Back {role === "teachers" ? "Teacher" : "Student"}
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
                className={`flex items-center justify-center w-5 h-5 border rounded ${rememberMe ? "bg-emerald-500 border-emerald-500" : "border-gray-300"
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
                "Login"
              )}
            </button>
          </div>
        </form>

        <div className="text-center text-sm">
          <span className="text-gray-600">Don&apos;t have an account? </span>
          <Link
            href={`/authentication/register?role=${role}`}
            className={`font-medium hover:text-opacity-90 ${role === "teachers" ? "text-emerald-500" : "text-blue-500"}`}
          >
            Create Account
          </Link>
        </div>
      </div>
    </div>
  )
}