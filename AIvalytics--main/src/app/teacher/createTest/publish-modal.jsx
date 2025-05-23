"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { User, Search, X, Loader2 } from "lucide-react"
import { supabase } from "@/lib/supabase/client"

export default function PublishModal({ onClose }) {
    const [searchQuery, setSearchQuery] = useState("")
    const [selectedStudents, setSelectedStudents] = useState([])
    const [selectAll, setSelectAll] = useState(false)
    const [students, setStudents] = useState([])
    const [filteredStudents, setFilteredStudents] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const [isPublishing, setIsPublishing] = useState(false)

    const test_id = "7bd83170-9780-403f-be3b-672ed0c7f19b"
    const teacher_id = "098e8e98-4b34-4a5a-898a-0dd099d9b6d1"

    const fetchStudents = async () => {
        setIsLoading(true)
        try {
            const { data, error } = await supabase
                .from("students")
                .select("*")

            if (error) throw error

            setStudents(data || [])
            setFilteredStudents(data || [])
        } catch (error) {
            console.error("Error fetching students:", error)
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        fetchStudents()
    }, [])

    // Filter students based on search query
    useEffect(() => {
        if (searchQuery.trim() === "") {
            setFilteredStudents(students)
        } else {
            setFilteredStudents(
                students.filter((student) =>
                    student.full_name.toLowerCase().includes(searchQuery.toLowerCase())
                )
            )
        }
    }, [searchQuery, students])

    // Handle select all checkbox
    useEffect(() => {
        if (selectAll) {
            setSelectedStudents(filteredStudents.map((student) => student.id))
        } else if (selectedStudents.length === filteredStudents.length) {
            setSelectedStudents([])
        }
    }, [selectAll, filteredStudents])

    // Update selectAll state when individual selections change
    useEffect(() => {
        if (filteredStudents.length > 0 && selectedStudents.length === filteredStudents.length) {
            setSelectAll(true)
        } else {
            setSelectAll(false)
        }
    }, [selectedStudents, filteredStudents])

    const handleSelectAll = () => {
        setSelectAll(!selectAll)
    }

    const handleSelectStudent = (studentId) => {
        setSelectedStudents(prev =>
            prev.includes(studentId)
                ? prev.filter(id => id !== studentId)
                : [...prev, studentId]
        )
    }

    const handlePublish = async({student_id}) => {
        setIsPublishing(true)
        try {
            const {data,error} = await supabase.from('test_assigned').insert({
                test_id: test_id,
                teacher_id: teacher_id,
                student_id,
            })
            if (error) {
                console.error("Error assigning test:", error)
                alert("Error assigning test")
                return  
            }
            console.log("Test assigned successfully:", data)
            alert("Test assigned successfully")
            
            onClose()
        } catch (error) {
            console.error("Error publishing test:", error)
            alert("Error publishing test")
        } finally {
            setIsPublishing(false)
        }
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

    return (
        <div 
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={(e) => {
                // Only close if clicking the backdrop
                if (e.target === e.currentTarget) {
                    onClose();
                }
            }}
        >
            <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col">
                <div className="p-6 border-b border-gray-200">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-2xl font-bold text-gray-900">Publish Test</h2>
                        <button
                            onClick={onClose}
                            className="p-2 text-gray-500 hover:text-gray-700 rounded-full hover:bg-gray-100 transition-all"
                        >
                            <X className="h-5 w-5" />
                        </button>
                    </div>
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <Input
                            placeholder="Search students..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-lg"
                        />
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto">
                    <div className="p-4 border-b border-gray-200 bg-gray-50">
                        <div className="flex items-center space-x-3">
                            <Checkbox
                                id="select-all"
                                checked={selectAll}
                                onCheckedChange={handleSelectAll}
                                className="h-5 w-5 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                            />
                            <label htmlFor="select-all" className="font-medium text-gray-700 cursor-pointer select-none">
                                Select All Students
                            </label>
                        </div>
                    </div>

                    <div className="divide-y divide-gray-200">
                        {isLoading ? (
                            <div className="p-8 flex flex-col items-center justify-center space-y-4">
                                <Loader2 className="h-8 w-8 text-blue-500 animate-spin" />
                                <p className="text-gray-600">Loading students...</p>
                            </div>
                        ) : filteredStudents.length > 0 ? (
                            filteredStudents.map((student) => (
                                <div key={student.id} className="p-4 hover:bg-gray-50 transition-colors">
                                    <div className="flex items-center space-x-4">
                                        <Checkbox
                                            id={`student-${student.id}`}
                                            checked={selectedStudents.includes(student.id)}
                                            onCheckedChange={() => handleSelectStudent(student.id)}
                                            className="h-5 w-5 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                                        />
                                        <div className="h-10 w-10 bg-gray-100 rounded-full flex items-center justify-center">
                                            <User className="h-6 w-6 text-gray-600" />
                                        </div>
                                        <label
                                            htmlFor={`student-${student.id}`}
                                            className="flex-1 font-medium text-gray-700 cursor-pointer select-none"
                                        >
                                            {student.full_name}
                                        </label>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="p-8 text-center">
                                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gray-100 mb-4">
                                    <User className="h-6 w-6 text-gray-600" />
                                </div>
                                <p className="text-gray-600 font-medium">
                                    {students.length === 0 ? "No students available" : "No students match your search"}
                                </p>
                            </div>
                        )}
                    </div>
                </div>

                <div className="p-6 border-t border-gray-200 bg-gray-50">
                    <div className="flex justify-end space-x-3">
                        <Button
                            variant="outline"
                            onClick={onClose}
                            className="px-4 py-2 border border-gray-300 text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all"
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={handlePublish}
                            disabled={selectedStudents.length === 0 || isPublishing}
                            className={`px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all ${
                                selectedStudents.length === 0 || isPublishing ? 'opacity-50 cursor-not-allowed' : ''
                            }`}
                        >
                            {isPublishing ? (
                                <>
                                    <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                                    Publishing...
                                </>
                            ) : (
                                'Publish Test'
                            )}
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    )
}