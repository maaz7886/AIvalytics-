import React from 'react'
import { BarChart3, BookOpen, FileText, Home, Users } from "lucide-react"
import Link from "next/link"


export default function Sidebar() {
  return (
    <div>
        {/* Sidebar */}
        <div className="w-64 bg-white ">
                <div className="p-4">
                    <Link href="/" className="flex items-center gap-2">
                        <div className=" h-8 bg-indigo-500 rounded-md px-2 flex items-center justify-center">
                            <span className="text-white font-bold">Aivaylatics</span>
                        </div>
                    </Link>
                </div>
                <nav className="mt-6">
                    <div className="px-3">
                        <Link
                            href="/"
                            className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md bg-emerald-50 text-emerald-500"
                        >
                            <Home className="w-5 h-5" />
                            Dashboard
                        </Link>
                        <Link
                            href="/mcqs"
                            className="flex items-center gap-3 px-3 py-2 mt-1 text-sm font-medium text-gray-600 rounded-md hover:bg-gray-50"
                        >
                            <BookOpen className="w-5 h-5" />
                            MCQs
                        </Link>
                        <Link
                            href="/quiz-sessions"
                            className="flex items-center gap-3 px-3 py-2 mt-1 text-sm font-medium text-gray-600 rounded-md hover:bg-gray-50"
                        >
                            <FileText className="w-5 h-5" />
                            Quiz Sessions
                        </Link>
                        <Link
                            href="/students"
                            className="flex items-center gap-3 px-3 py-2 mt-1 text-sm font-medium text-gray-600 rounded-md hover:bg-gray-50"
                        >
                            <Users className="w-5 h-5" />
                            Students
                        </Link>
                        <Link
                            href="/reports"
                            className="flex items-center gap-3 px-3 py-2 mt-1 text-sm font-medium text-gray-600 rounded-md hover:bg-gray-50"
                        >
                            <BarChart3 className="w-5 h-5" />
                            Reports
                        </Link>
                    </div>
                </nav>
            </div>
    </div>
  )
}
