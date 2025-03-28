"use client"

import React from 'react'
import { Plus } from "lucide-react"
import { useRouter } from 'next/navigation';



export default function Active_test() {

  const router = useRouter();

  return (
    <div>
      {/* Active Test */}
      <div className="mt-6">
        <div className="p-6 bg-white rounded-lg shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-800">Active Test Sessions</h2>
            <button
              onClick={() => router.push('/teacher/createTest')}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-emerald-500 rounded-md hover:bg-emerald-600"
            >
              <Plus className="w-4 h-4" />
              Create Test Session
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <th className="px-6 py-3">Quiz Title</th>
                  <th className="px-6 py-3">Class</th>
                  <th className="px-6 py-3">Students</th>
                  <th className="px-6 py-3">Progress</th>
                  <th className="px-6 py-3">Status</th>
                  <th className="px-6 py-3">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                <QuizSessionRow title="Physics Mid-Term" className="SYBCA-C" students="45/50" progress={45 / 50 * 100} />
                <QuizSessionRow title="Chemistry Quiz" className="FYBCA-A" students="38/40" progress={38 / 40 * 100} />
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}



function QuizSessionRow({ title, className, students, progress }) {
  return (
    <tr>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm font-medium text-gray-900">{title}</div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm text-gray-500">{className}</div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm text-gray-500">{students}</div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div className="bg-emerald-500 h-2.5 rounded-full" style={{ width: `${progress}%` }}></div>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <span className="px-2 py-1 text-xs font-medium text-emerald-800 bg-emerald-100 rounded-full">Active</span>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
        <a href="#" className="text-emerald-500 hover:text-emerald-700">
          View Details
        </a>
      </td>
    </tr>
  )
}


