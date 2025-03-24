import { BookOpen, Clock, TrendingUp, CheckCircle } from 'lucide-react'
import React from 'react'

type Test = {
  id: string
  name: string
  subject: string
  dueDate: string
  status: "New" | "Pending" | "Completed"
  score?: number
  completedOn?: string
}

interface StatsCardsProps {
  tests: Test[];
  completedTests: Test[];
}

export default function StatsCards({ tests, completedTests }: StatsCardsProps) {

     // Calculate statistics
  const totalTests = tests.length
  const upcomingTests = tests.filter((test) => test.status !== "Completed").length
  const averageScore =
    completedTests.length > 0
      ? Math.round(completedTests.reduce((sum, test) => sum + (test.score || 0), 0) / completedTests.length)
      : 0
  const completionRate = totalTests > 0 ? Math.round((completedTests.length / totalTests) * 100) : 0



  return (
    <div>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {/* Total Tests Card */}
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-green-100 rounded-md p-3">
                  <BookOpen className="h-6 w-6 text-green-600" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dt className="text-sm font-medium text-gray-500 truncate">Total Tests</dt>
                  <dd className="flex items-baseline">
                    <div className="text-2xl font-semibold text-gray-900">{totalTests}</div>
                    <div className="ml-2 flex items-baseline text-sm font-semibold text-green-600">
                      <span>+8% from last month</span>
                    </div>
                  </dd>
                </div>
              </div>
            </div>
          </div>

         

          {/* Average Score Card */}
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-green-100 rounded-md p-3">
                  <TrendingUp className="h-6 w-6 text-green-600" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dt className="text-sm font-medium text-gray-500 truncate">Average Score</dt>
                  <dd className="flex items-baseline">
                    <div className="text-2xl font-semibold text-gray-900">{averageScore}%</div>
                    <div className="ml-2 flex items-baseline text-sm font-semibold text-green-600">
                      <span>+5% improvement</span>
                    </div>
                  </dd>
                </div>
              </div>
            </div>
          </div>

          {/* Completion Rate Card */}
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-green-100 rounded-md p-3">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dt className="text-sm font-medium text-gray-500 truncate">Completion Rate</dt>
                  <dd className="flex items-baseline">
                    <div className="text-2xl font-semibold text-gray-900">{completionRate}%</div>
                    <div className="ml-2 flex items-baseline text-sm font-semibold text-green-600">
                      <span>+3% from last week</span>
                    </div>
                  </dd>
                </div>
              </div>
            </div>
          </div>
        </div>
    </div>
  )
}
