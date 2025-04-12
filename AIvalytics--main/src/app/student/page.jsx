"use client"

import { useState, useEffect } from "react"
import { Search, RefreshCw, Trophy, X } from "lucide-react"
import TopNavBar from "@/components/students_compo/TopNavBar"
import StatsCards from "@/components/students_compo/StatsCards"
import CompletedTest from "@/components/students_compo/CompletedTest"
import Test from "@/app/student/test"
import { supabase } from "@/lib/supabase/client"


export default function StudentDashboard() {
  // State for tests data
  const [tests, setTests] = useState([])
  const [filteredTests, setFilteredTests] = useState([])
  const [completedTests, setCompletedTests] = useState([])
  const [leaderboard, setLeaderboard] = useState([])
  const [showPreview, setShowPreview] = useState(false)
  const [student, setStudent] = useState({})





  // State for search and filters
  const [searchQuery, setSearchQuery] = useState("")
  const [subjectFilter, setSubjectFilter] = useState("All Subjects")
const [test_id, setTest_id] = useState("")
  // State for loading and last synced
  const [loading, setLoading] = useState(true)
  const [lastSynced, setLastSynced] = useState(new Date())


  const fetchTests = async () => {
// Add `.eq()` filter to bypass RLS (temporarily for debugging)
const { data } = await supabase
  .from('tests')
  .select('*')

  setTests(data)

console.log('Test data:', data);
  }
  // Mock data initialization
  useEffect(() => {
      fetchTests()
    // const mockTests = [
    //   { id: "1", name: "Physics Mid-Term", subject: "Physics", dueDate: "Dec 15, 2023", status: "Pending" },
    //   { id: "2", name: "Chemistry Quiz", subject: "Chemistry", dueDate: "Dec 18, 2023", status: "New" },
    //   { id: "3", name: "Biology Final", subject: "Biology", dueDate: "Dec 20, 2023", status: "Pending" },
    //   {
    //     id: "4",
    //     name: "Mathematics Final",
    //     subject: "Mathematics",
    //     dueDate: "Dec 10, 2023",
    //     status: "Completed",
    //     score: 92,
    //     completedOn: "Dec 10, 2023",
    //   },
    //   {
    //     id: "5",
    //     name: "Biology Quiz",
    //     subject: "Biology",
    //     dueDate: "Dec 8, 2023",
    //     status: "Completed",
    //     score: 88,
    //     completedOn: "Dec 8, 2023",
    //   },
    //   {
    //     id: "6",
    //     name: "Computer Science Project",
    //     subject: "Computer Science",
    //     dueDate: "Dec 22, 2023",
    //     status: "Pending",
    //   },
    //   { id: "7", name: "History Essay", subject: "History", dueDate: "Dec 19, 2023", status: "New" },
    // ]

    const mockLeaderboard = [
      { id: "1", name: "Sarah Johnson", averageScore: 95.5, rank: 1 },
      { id: "2", name: "Michael Chen", averageScore: 93.2, rank: 2 },
      { id: "3", name: "Emily Brown", averageScore: 91.8, rank: 3 },
    ]

    // setFilteredTests(mockTests.filter((test) => test.status !== "Completed"))
    // setCompletedTests(mockTests.filter((test) => test.status === "Completed"))
    setLeaderboard(mockLeaderboard)
    setLoading(false)
  }, [])

  // Function to handle search and filtering
  useEffect(() => {
    const availableTests = tests.filter((test) => test.status !== "Completed")

    if (searchQuery || subjectFilter !== "All Subjects") {
      const filtered = availableTests.filter((test) => {
        const matchesSearch =
          test.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          test.subject.toLowerCase().includes(searchQuery.toLowerCase())
        const matchesSubject = subjectFilter === "All Subjects" || test.subject === subjectFilter
        return matchesSearch && matchesSubject
      })
      setFilteredTests(filtered)
    } else {
      setFilteredTests(availableTests)
    }
  }, [searchQuery, subjectFilter, tests])

  // Function to refresh data
  const refreshData = () => {
    setLoading(true)
    // In a real app, this would fetch fresh data from the API
    setTimeout(() => {
      setLastSynced(new Date())
      setLoading(false)
    }, 1000)
  }

  const togglePreview = () => {
    setShowPreview(!showPreview)
}



  useEffect(() => {
    const studentData = localStorage.getItem('Authstudents')
    if (studentData) {
      const parsedData = JSON.parse(studentData)
      console.log('Student data from localStorage:', parsedData)
      setStudent(parsedData)
    }
  }, [])


  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
     <TopNavBar name={student.full_name}/>

      {/* Main content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {/* Stats cards */}
        <StatsCards tests={tests} completedTests={completedTests}/>

        {/* Available Tests Section */}
        <div className="mt-8">
          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <div className="px-4 py-5 border-b border-gray-200 sm:px-6">
              <div className="flex justify-between items-center flex-wrap sm:flex-nowrap">
                <h3 className="text-lg leading-6 font-medium text-gray-900">Available Tests</h3>
                <div className="flex mt-2 sm:mt-0 sm:ml-4">
                  {/* Search input */}
                  <div className="relative flex justify-center rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Search className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      className="focus:ring-indigo-500 outline-none focus:border-indigo-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
                      placeholder="Search tests..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>

                
                </div>
              </div>
            </div>

            {/* Tests table */}
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Test Name
                    </th>
                   
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Due Date
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Status
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {loading ? (
                    // Loading skeleton
                    Array(3)
                      .fill(0)
                      .map((_, index) => (
                        <tr key={index}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse"></div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="h-4 bg-gray-200 rounded w-1/2 animate-pulse"></div>
                          </td>
                         
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="h-4 bg-gray-200 rounded w-1/4 animate-pulse"></div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="h-8 bg-gray-200 rounded w-24 animate-pulse"></div>
                          </td>
                        </tr>
                      ))
                  ) : filteredTests.length > 0 ? (
                    filteredTests.map((test) => (
                      <tr key={test.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{test.Title}</div>
                        </td>
                        
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-500">{test.created_at}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${test.status === "New" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
                              }`}
                          >
                            {/* {test.status} */}
                            Pending
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button
                          onClick={()=>{
                            setTest_id(test.id)
                            togglePreview()}
                          }
                          className="bg-emerald-500 hover:bg-emerald-600 text-white py-1 px-4 rounded">
                            Start Test
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="px-6 py-4 text-center text-sm text-gray-500">
                        No tests found matching your search criteria.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Completed Tests and Leaderboard Section */}
        <div className="mt-8 grid grid-cols-1 gap-5 lg:grid-cols-2">
          {/* Completed Tests */}
          <CompletedTest completedTests={completedTests} loading={loading} />

          {/* Leaderboard */}
          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <div className="px-4 py-5 border-b border-gray-200 sm:px-6 flex justify-between items-center">
              <h3 className="text-lg leading-6 font-medium text-gray-900">Leaderboard</h3>
              <a href="#" className="text-sm font-medium text-indigo-600 hover:text-indigo-500">
                View Full
              </a>
            </div>
            <div className="divide-y divide-gray-200">
              {loading
                ? // Loading skeleton
                Array(3)
                  .fill(0)
                  .map((_, index) => (
                    <div key={index} className="px-4 py-4 sm:px-6">
                      <div className="flex items-center">
                        <div className="h-8 w-8 rounded-full bg-gray-200 animate-pulse mr-3"></div>
                        <div className="flex-1">
                          <div className="h-4 bg-gray-200 rounded w-1/3 animate-pulse mb-2"></div>
                          <div className="h-3 bg-gray-200 rounded w-1/4 animate-pulse"></div>
                        </div>
                      </div>
                    </div>
                  ))
                : leaderboard.map((student) => (
                  <div key={student.id} className="px-4 py-4 sm:px-6">
                    <div className="flex items-center">
                      <div
                        className={`flex items-center justify-center h-8 w-8 rounded-full ${student.rank === 1 ? "bg-green-100 text-green-600" : "bg-gray-100 text-gray-600"
                          }`}
                      >
                        {student.rank}
                      </div>
                      <div className="ml-3 flex-1">
                        <p className="text-sm font-medium text-gray-900">{student.name}</p>
                        <p className="text-sm text-gray-500">{student.averageScore} Average Score</p>
                      </div>
                      {student.rank === 1 && <Trophy className="h-5 w-5 text-yellow-500" />}
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>

        {/* Last synced info */}
        <div className="mt-6 flex items-center justify-end text-sm text-gray-500">
          <span>
            Last synced:{" "}
            {loading
              ? "Syncing..."
              : `${Math.floor((new Date().getTime() - lastSynced.getTime()) / 60000)} minutes ago`}
          </span>
          <button
            onClick={refreshData}
            className="ml-2 flex items-center text-indigo-600 hover:text-indigo-900"
            disabled={loading}
          >
            <RefreshCw className={`h-4 w-4 mr-1 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </button>
        </div>
      </main>
       {/* Preview Modal */}
                  {showPreview && (
                      <div
                          className="fixed inset-0 bg-transparent backdrop-blur-md  flex items-center justify-center z-50 p-4">
                          <div className="bg-white rounded-l border   shadow-lg w-full max-w-4xl max-h-[90vh] overflow-auto">
                              <div className="flex  justify-between items-center p-4 border-b border-gray-300-b">
                                  <h2 className="text-xl font-bold">Test </h2>
                                  <button onClick={togglePreview} className="text-gray-500 hover:text-gray-700">
                                      <X className="w-6 h-6" />
                                  </button>
                              </div>
                              <div className="p-6">
                                  <Test
                                     test_id={test_id} student_id={student.id}
                                  />
                              </div>
                              <div className="p-4 border-t border-gray-300-t flex justify-end">
                                  <button onClick={togglePreview} className="px-4 py-2  border border-gray-400 rounded hover:bg-gray-200 transition">
                                      Close Preview
                                  </button>
                              </div>
                          </div>
                      </div>
                  )}
    </div>
  )
}

