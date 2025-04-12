import React, { useState } from 'react'
import {  BookOpen, FileText, Home } from "lucide-react"
import Link from "next/link"

export default function Sidebar() {
  const [activeTab, setActiveTab] = useState("/"); // Default active tab

  return (
    <div>
        {/* Sidebar */}
        <div className="w-64 bg-white border-gray-300 border h-screen ">
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
                            href="/teacher/dashboard"
                            className={`flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md ${activeTab === "/" ? "bg-emerald-50 text-emerald-500" : "text-gray-600 hover:bg-gray-50"}`}
                            onClick={() => setActiveTab("/")}
                        >
                            <Home className="w-5 h-5" />
                            Dashboard
                        </Link>
                        <Link
                            href="/teacher/createTest"
                            className={`flex items-center gap-3 px-3 py-2 mt-1 text-sm font-medium rounded-md ${activeTab === "/teacher/createTest" ? "bg-emerald-50 text-emerald-500" : "text-gray-600 hover:bg-gray-50"}`}
                            onClick={() => setActiveTab("/teacher/createTest")}
                        >
                            <BookOpen className="w-5 h-5" />
                            createTest
                        </Link>
                        <Link
                            href="/teacher/submittedTests"
                            className={`flex items-center gap-3 px-3 py-2 mt-1 text-sm font-medium rounded-md ${activeTab === "/teacher/submittedTests" ? "bg-emerald-50 text-emerald-500" : "text-gray-600 hover:bg-gray-50"}`}
                            onClick={() => setActiveTab("/teacher/submittedTests")}
                        >
                            <FileText className="w-5 h-5" />
                            Submitted Tests
                        </Link>
                        {/* <Link
                            href="/students"
                            className={`flex items-center gap-3 px-3 py-2 mt-1 text-sm font-medium rounded-md ${activeTab === "/students" ? "bg-emerald-50 text-emerald-500" : "text-gray-600 hover:bg-gray-50"}`}
                            onClick={() => setActiveTab("/students")}
                        >
                            <Users className="w-5 h-5" />
                            Students
                        </Link> */}
                        
                    </div>
                </nav>
            </div>
    </div>
  )
}
