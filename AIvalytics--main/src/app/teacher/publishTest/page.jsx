"use client"

import { useState, useEffect } from "react"
import { ArrowLeft, Search, Eye, User } from "lucide-react"
import { supabase } from "@/lib/supabase/client"
import Image from "next/image"

export default function PublishQuizPage() {
  // State for tracking selected classes and students
  const [selectedClasses, setSelectedClasses] = useState(["CS101", "MATH202"])
  const [selectedStudents, setSelectedStudents] = useState([])
  const [allStudentsSelected, setAllStudentsSelected] = useState(false)

  // Retrieve MCQs from localStorage
  const [mcqs, setMcqs] = useState( []);
  useEffect(() => {
    const storedMcqs = localStorage.getItem("mcqs");
    if (storedMcqs) {
      setMcqs(JSON.parse(storedMcqs));
    }
   
   
  }, []);

  // Search state
  const [classSearchTerm, setClassSearchTerm] = useState("")
  const [studentSearchTerm, setStudentSearchTerm] = useState("")

  // State for tracking which class's students are being viewed
  const [viewingClassId, setViewingClassId] = useState(null)

  // Mock data for university classes
  const classes = [
    { id: "CS101", name: "CS 101", description: "Introduction to Computer Science", students: 31 },
    { id: "MATH202", name: "MATH 202", description: "Calculus II", students: 32 },
    { id: "PHYS101", name: "PHYS 101", description: "Physics Fundamentals", students: 30 },
    { id: "ENG205", name: "ENG 205", description: "Creative Writing", students: 25 },
    { id: "BIO110", name: "BIO 110", description: "Introduction to Biology", students: 28 },
    { id: "CHEM103", name: "CHEM 103", description: "General Chemistry", students: 24 },
    { id: "HIST201", name: "HIST 201", description: "World History", students: 22 },
    { id: "ECON101", name: "ECON 101", description: "Principles of Economics", students: 35 },
    { id: "PSYCH110", name: "PSYCH 110", description: "Introduction to Psychology", students: 40 },
  ]
const [students, setStudents] = useState([
  { id: "1", full_name: "Alex Johnson", class: "MATH202", avatar: "/placeholder.svg?height=40&width=40" },
  { id: "2", full_name: "Emma Wilson", class: "MATH202", avatar: "/placeholder.svg?height=40&width=40" },
  { id: "3", full_name: "Michael Brown", class: "CS101", avatar: "/placeholder.svg?height=40&width=40" },
  { id: "15", full_name: "Mason Wright", class: "BIO110", avatar: "/placeholder.svg?height=40&width=40" },
])

const fetchStudents = async()=>{

  const {data,error}= await supabase
  .from("students")
  .select("*")
  console.log('====================================');
  console.log(error);
  console.log('====================================');
console.log('====================================');
console.log([...data]);
console.log('====================================');
setStudents([...data])

}

useEffect(() => {
  fetchStudents()
}, [])



  // Filter classes based on search term
  const filteredClasses = classes.filter(
    (classItem) =>
      classItem.name.toLowerCase().includes(classSearchTerm.toLowerCase()) ||
      classItem.description.toLowerCase().includes(classSearchTerm.toLowerCase()),
  )

  // Filter students based on search term and selected classes or viewing class
  const filteredStudents = students.filter((student) => {
    const matchesSearch =
    student.full_name.toLocaleLowerCase().includes(studentSearchTerm.toLowerCase())
    //  ||
    // student.class.toLowerCase().includes(studentSearchTerm.toLowerCase())
    
    // If viewing a specific class, only show students from that class
    // if (viewingClassId) {
    //   return matchesSearch === viewingClassId
    // }

    // Otherwise show students from all selected classes
    return matchesSearch 
    // return matchesSearch && (selectedClasses.length === 0 || selectedClasses.includes(student.class))
  })

  // Toggle class selection
  const toggleClass = (classId) => {
    if (selectedClasses.includes(classId)) {
      setSelectedClasses(selectedClasses.filter((id) => id !== classId))

      // Also deselect students from this class
      setSelectedStudents(
        selectedStudents.filter((id) => {
          const student = students.find((s) => s.id === id)
          return student?.class !== classId
        }),
      )
    } else {
      setSelectedClasses([...selectedClasses, classId])
    }

    // Update all students selected state
    updateAllStudentsSelectedState()
  }

  // Toggle student selection
  const toggleStudent = (studentId) => {
    if (selectedStudents.includes(studentId)) {
      setSelectedStudents(selectedStudents.filter((id) => id !== studentId))
      setAllStudentsSelected(false)
    } else {
      setSelectedStudents([...selectedStudents, studentId])

      // Check if all visible students are now selected
      const allSelected = filteredStudents.every(
        (student) => selectedStudents.includes(student.id) || student.id === studentId,
      )
      setAllStudentsSelected(allSelected)
    }
  }

  // Toggle all students
  const toggleAllStudents = () => {
    if (allStudentsSelected) {
      setSelectedStudents([])
    } else {
      setSelectedStudents(filteredStudents.map((student) => student.id))
    }
    setAllStudentsSelected(!allStudentsSelected)
  }

  // Update all students selected state when filtered students change
  const updateAllStudentsSelectedState = () => {
    if (filteredStudents.length === 0) {
      setAllStudentsSelected(false)
      return
    }

    const allSelected = filteredStudents.every((student) => selectedStudents.includes(student.id))
    setAllStudentsSelected(allSelected)
  }

  const publishTest = async () => {
    try {
      // 1. First insert all questions
      const { data: questionsData, error: insertError } = await supabase
        .from('questions')
        .insert(mcqs)
        .select('id, created_at');
  
      if (insertError) {
        console.error('Question insertion error details:', insertError);
        throw new Error(`Failed to insert questions: ${insertError.message}`);
      }
  
      // 2. Check if questions were actually inserted
      if (!questionsData || questionsData.length === 0) {
        throw new Error('No questions were inserted - check your data');
      }
  
      // 3. Attempt to create test
      const { data, error } = await supabase
      .rpc('create_tests_in_batches');
    
    if (error) throw error;
    
    if (data) {
      alert(`Successfully created tests! First test ID: ${data.Title}`);
    } else {
      alert('No tests created - need at least 5 unused questions');
    }

    } catch (err) {
      // Proper error formatting
      const errorMessage = err instanceof Error ? err.message : JSON.stringify(err);
      console.error('Full publish error:', err);
      alert(`❌ Publish failed: ${errorMessage}`);
    }
  };
  

  // Update all students selected state when filtered students change
  useEffect(() => {
    updateAllStudentsSelectedState();
  }, [filteredStudents, selectedStudents, updateAllStudentsSelectedState]);

  // Calculate total selected students
  const totalSelectedStudents = selectedClasses.reduce((total, classId) => {
    const classObj = classes.find((c) => c.id === classId)
    return total + (classObj?.students || 0)
  }, 0)

  // Handle view students click
  const handleViewStudents = (classId) => {
    if (viewingClassId === classId) {
      // If already viewing this class, clear the filter
      setViewingClassId(null)
    } else {
      // Otherwise, set to view this class
      setViewingClassId(classId)
      // Also ensure the class is selected
      if (!selectedClasses.includes(classId)) {
        setSelectedClasses([...selectedClasses, classId])
      }
    }
    // Clear student search when switching views
    setStudentSearchTerm("")
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <header className="border-b bg-white p-4 flex items-center">
        <button className="mr-2"
          onClick={() => window.history.back()}>
          <ArrowLeft className="h-5 w-5 text-gray-600" />
        </button>
        <h1 className="text-lg font-medium">
          Publish Test: <span className="text-emerald-500">Mathematics Quiz</span>
        </h1>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto p-6">
        {/* Test Information Section */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Test Title */}
            <div>
              <h2 className="text-sm text-gray-500 mb-1">Test Title</h2>
              <p className="font-medium">Mathematics Quiz - Algebra Basics</p>
            </div>

            {/* Difficulty Level */}
            <div>
              <h2 className="text-sm text-gray-500 mb-1">Difficulty Level</h2>
              <p className="font-medium">Easy</p>
            </div>

            {/* Topic */}
            <div>
              <h2 className="text-sm text-gray-500 mb-1">Topic</h2>
              <p className="font-medium">Algebra</p>
            </div>
          </div>
        </div>

        {/* Selection Area */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Classes Selection Section */}
          <div>
            {/* Search Classes */}
            <div className="relative mb-6">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search classes..."
                value={classSearchTerm}
                onChange={(e) => setClassSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border rounded-md w-full focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              />
            </div>

            {/* Classes List */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {filteredClasses.map((classItem) => (
                <div key={classItem.id} className="border rounded-lg p-4 flex justify-between items-center">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id={`class-${classItem.id}`}
                      checked={selectedClasses.includes(classItem.id)}
                      onChange={() => toggleClass(classItem.id)}
                      className="h-4 w-4 text-emerald-500 focus:ring-emerald-500 border-gray-300 rounded"
                    />
                    <div className="ml-4">
                      <label htmlFor={`class-${classItem.id}`} className="block font-medium">
                        {classItem.name}
                      </label>
                      <span className="text-sm text-gray-500">{classItem.students} students</span>
                      <p className="text-xs text-gray-400">{classItem.description}</p>
                    </div>
                  </div>

                  {/* View Students Button */}
                  <button
                    onClick={() => handleViewStudents(classItem.id)}
                    className={`flex items-center text-sm font-medium ${viewingClassId === classItem.id ? "text-blue-500" : "text-emerald-500"
                      }`}
                  >
                    <Eye
                      className={`h-4 w-4 mr-1 ${viewingClassId === classItem.id ? "text-blue-500" : "text-emerald-500"
                        }`}
                    />
                    View Students
                  </button>
                </div>
              ))}
            </div>
          </div>



          {/* Students Selection Section */}
          <div>
            {/* Search Students */}
            <div className="relative mb-6">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search students..."
                value={studentSearchTerm}
                onChange={(e) => setStudentSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border rounded-md w-full focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              />
            </div>

            {/* Select All Students */}
            <div className="flex items-center mb-4 p-2">
              <input
                type="checkbox"
                id="select-all"
                checked={allStudentsSelected && filteredStudents.length > 0}
                onChange={toggleAllStudents}
                className="h-4 w-4 text-emerald-500 focus:ring-emerald-500 border-gray-300 rounded"
              />
              <label htmlFor="select-all" className="ml-2 font-medium">
                Select All Students
              </label>
            </div>

            {/* Students List Header */}
            {viewingClassId && (
              <div className="mb-4 p-2 bg-blue-50 rounded-md">
                <h3 className="font-medium text-blue-700 flex items-center">
                  <Eye className="h-4 w-4 mr-2" />
                  Viewing students from {classes.find((c) => c.id === viewingClassId)?.name}
                  <button
                    onClick={() => setViewingClassId(null)}
                    className="ml-auto text-xs text-blue-600 hover:text-blue-800"
                  >
                    Show All
                  </button>
                </h3>
              </div>
            )}

            {/* Students List */}
            <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2">
              {filteredStudents.length > 0 ? (
                filteredStudents.map((student) => (
                  <div key={student.id} className="flex items-center p-2">
                    <input
                      type="checkbox"
                      id={`student-${student.id}`}
                      checked={selectedStudents.includes(student.id) || allStudentsSelected}
                      onChange={() => toggleStudent(student.id)}
                      className="h-4 w-4 text-emerald-500 focus:ring-emerald-500 border-gray-300 rounded"
                    />
                    <div className="ml-2 flex items-center">
                      {/* Student Avatar - Using Unsplash for random student images */}
                      <User className=" w-8 h-8 p-1 rounded-full border border-gray-400 "/>
                      <div className="ml-3">
                        <label htmlFor={`student-${student.id}`} className="block font-medium">
                          {student.full_name}
                        </label>
                        <span className="text-sm text-gray-500">
                          {classes.find((c) => c.id === student.class)?.full_name || student.class}
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-4 text-gray-500">
                  {selectedClasses.length === 0 ? "Select a class to see students" : "No students match your search"}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Footer Section */}
      <footer className="fixed bottom-0 left-0 right-0 bg-white border-t p-4 flex justify-between items-center">
        <div className="text-sm">
          {selectedClasses.length} classes selected ({totalSelectedStudents} students)
        </div>
        <div className="flex space-x-3">
          <button className="px-4 py-2 border border-gray-500 rounded-md text-gray-700 hover:bg-gray-50">
            Cancel</button>
          <button  className=" border border-gray-500 px-2 rounded-md"
            onClick={() => publishTest()}
          >
            Publish Test
          </button>
        </div>
      </footer>
    </div>
  )
}

