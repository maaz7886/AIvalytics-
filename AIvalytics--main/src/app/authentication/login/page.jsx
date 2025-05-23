"use client"
import { useRouter, useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase/client"
import Link from "next/link"
import { Check, ArrowLeft } from "lucide-react"

export default function LoginFormPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [rememberMe, setRememberMe] = useState(false)
  const [loading, setLoading] = useState(false)
  const [isMounted, setIsMounted] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()
  const role = searchParams.get("role") || "students"

  // Check auth status only after component mounts
  useEffect(() => {
    setIsMounted(true)
    const authData = localStorage.getItem(`Auth${role}`)
    if (authData) {
      router.push(role === "teachers" ? "/teacher/dashboard" : "/student")
    }
  }, [role, router])

  const handleLogin = async (e) => {
    e.preventDefault()
    if (!isMounted) return
    
    setLoading(true)

    try {
      const { data: user, error } = await supabase
        .from(role)
        .select('*')
        .eq('email', email)
        .single()

      if (error || !user) throw new Error("User not found")
      if (user.password !== password) throw new Error("Invalid password")

      localStorage.setItem(`Auth${role}`, JSON.stringify(user))
      router.push(role === "teachers" ? "/teacher/dashboard" : "/student")
    } catch (error) {
      console.error("Login error:", error)
      alert(error.message)
    } finally {
      setLoading(false)
    }
  }

  if (!isMounted) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-gray-50 to-white">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"></div>
      </div>
    )
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
                  Welcome to{" "}
                  <span className="bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent">
                    Aivalytics
                  </span>
                </h1>
                <p className="mt-3 text-lg text-gray-600">
                  Sign in to your {role === "teachers" ? "teacher" : "student"} account
                </p>
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
                      className="block w-full px-4 py-3 mt-1 placeholder-gray-400 border border-gray-200 rounded-xl shadow-sm appearance-none transition-colors focus:outline-none focus:ring-2 focus:ring-offset-0 focus:ring-emerald-500 focus:border-transparent"
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
                      className="block w-full px-4 py-3 mt-1 placeholder-gray-400 border border-gray-200 rounded-xl shadow-sm appearance-none transition-colors focus:outline-none focus:ring-2 focus:ring-offset-0 focus:ring-emerald-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <button
                      type="button"
                      className={`flex items-center justify-center w-5 h-5 rounded-md transition-colors ${
                        rememberMe 
                          ? "bg-gradient-to-r from-emerald-500 to-emerald-600 border-0" 
                          : "border border-gray-300 hover:border-emerald-500"
                      }`}
                      onClick={() => setRememberMe(!rememberMe)}
                    >
                      {rememberMe && <Check className="w-4 h-4 text-white" />}
                    </button>
                    <label htmlFor="remember-me" className="block ml-2 text-sm text-gray-600">
                      Remember me
                    </label>
                  </div>

                  <div className="text-sm">
                    <Link 
                      href="/authentication/forgot_pass" 
                      className={`font-medium transition-colors ${
                        role === "teachers" 
                          ? "text-emerald-600 hover:text-emerald-500" 
                          : "text-blue-600 hover:text-blue-500"
                      }`}
                    >
                      Forgot password?
                    </Link>
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
                      "Sign in"
                    )}
                  </button>
                </div>
              </form>

              <div className="text-center text-sm">
                <span className="text-gray-600">Don&apos;t have an account? </span>
                <Link
                  href={`/authentication/register?role=${role}`}
                  className={`font-medium transition-colors ${
                    role === "teachers" 
                      ? "text-emerald-600 hover:text-emerald-500" 
                      : "text-blue-600 hover:text-blue-500"
                  }`}
                >
                  Create Account
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}