"use client"
import { useRouter } from 'next/navigation';

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { Check } from "lucide-react"
import { log } from 'console';

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [rememberMe, setRememberMe] = useState(false)
    const router = useRouter();
  

    const handleLogin = async (e: any) => {
      e.preventDefault();
      setMessage("");
    
      try {
        const res = await fetch("/api/auth/teacherLogin", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, password }),
        });
    
        const data = await res.json(); // 👈  Data
    
        console.log("Full response:", data); // 👀 check this in console
    
        setMessage(data.message || data.error);
    
        console.log("Redirecting...");
        
        router.push("/dashboard");
      } catch (error) {
        console.error("Login error:", error);
        setMessage("Something went wrong.");
      }
    };
    
    

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-sm">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">Welcome Back</h1>
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
              className="flex justify-center w-full px-4 py-2 text-sm font-medium text-white bg-emerald-500 border border-transparent rounded-md shadow-sm hover:bg-emerald-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
            >
              Login
            </button>
          </div>
        </form>

        <div className="text-center text-sm">
          <span className="text-gray-600">Don&apos;t have an account? </span>
          <Link href="/authentication/register" className="font-medium text-emerald-500 hover:text-emerald-400">
            Create Account
          </Link>
        </div>
      </div>
    </div>
  )
}

