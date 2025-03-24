import { Link } from 'lucide-react'
import React from 'react'

export default function page() {
  return (
    <div>
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <h1 className="text-4xl font-bold text-gray-900">Welcome to Aialvaytics</h1>
      <p className="mt-4 text-xl text-gray-600">Get started by logging in to your account</p>
      <div className="mt-8 space-x-4">
        <Link
          href="/authentication/login"
          className="px-6 py-3 text-white bg-emerald-500 rounded-md hover:bg-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
        >
          Login
        </Link>
        <Link
          href="/authentication/register"
          className="px-6 py-3 text-emerald-600 bg-white border border-emerald-500 rounded-md hover:bg-emerald-50 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
        >
          Register
        </Link>
      </div>
    </div> 
    </div>
  )
}
