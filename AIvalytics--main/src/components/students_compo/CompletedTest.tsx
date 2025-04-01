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
interface CompletedTestProps {
    completedTests: Test[];
    loading: boolean;
}

export default function CompletedTest({ completedTests, loading }: CompletedTestProps) {
  return (
    <div>
       <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <div className="px-4 py-5 border-b border-gray-200 sm:px-6 flex justify-between items-center">
              <h3 className="text-lg leading-6 font-medium text-gray-900">Completed Tests</h3>
              <a href="#" className="text-sm font-medium text-indigo-600 hover:text-indigo-500">
                View All
              </a>
            </div>
            <div className="divide-y divide-gray-200">
              {loading ? (
                // Loading skeleton
                Array(2)
                  .fill(0)
                  .map((_, index) => (
                    <div key={index} className="px-4 py-4 sm:px-6">
                      <div className="flex items-center justify-between">
                        <div className="w-1/2">
                          <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse mb-2"></div>
                          <div className="h-3 bg-gray-200 rounded w-1/2 animate-pulse"></div>
                        </div>
                        <div className="flex items-center">
                          <div className="h-6 bg-gray-200 rounded w-12 animate-pulse mr-4"></div>
                          <div className="h-8 bg-gray-200 rounded w-24 animate-pulse"></div>
                        </div>
                      </div>
                    </div>
                  ))
              ) : completedTests.length > 0 ? (
                completedTests.map((test) => (
                  <div key={test.id} className="px-4 py-4 sm:px-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-sm font-medium text-gray-900">{test.name}</h4>
                        <p className="text-sm text-gray-500">Completed on {test.completedOn}</p>
                      </div>
                      <div className="flex items-center">
                        <span className="text-green-600 font-medium mr-4">{test.score}%</span>
                        <button className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200">
                          View Results
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="px-4 py-5 sm:px-6 text-center text-sm text-gray-500">
                  You have not completed any tests yet.
                </div>
              )}
            </div>
          </div>
    </div>
  )
}
