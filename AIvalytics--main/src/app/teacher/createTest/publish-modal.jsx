"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { User } from "lucide-react"
import { supabase } from "@/lib/supabase/client"

export default function PublishModal({ onClose }) {
    const [searchQuery, setSearchQuery] = useState("")
    const [selectedStudents, setSelectedStudents] = useState([])
    const [selectAll, setSelectAll] = useState(false)
    const [students, setStudents] = useState([])
    const [filteredStudents, setFilteredStudents] = useState([])
    const [isLoading, setIsLoading] = useState(true)


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
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg w-full max-w-md flex flex-col max-h-[90vh]">
                <div className="p-4 border-b">
                    <Input
                        placeholder="Search students..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full"
                    />
                </div>

                <div className="overflow-y-auto flex-grow">
                    <div className="p-4 border-b">
                        <div className="flex items-center space-x-2">
                            <Checkbox
                                id="select-all"
                                checked={selectAll}
                                onCheckedChange={handleSelectAll}
                            />
                            <label htmlFor="select-all" className="font-medium cursor-pointer">
                                Select All Students
                            </label>
                        </div>
                    </div>

                    <div className="divide-y">
                        {isLoading ? (
                            [...Array(5)].map((_, i) => (
                                <div key={i} className="p-4 flex items-center space-x-3">
                                    <div className="h-5 w-5 bg-gray-200 rounded animate-pulse"></div>
                                    <div className="h-10 w-10 bg-gray-200 rounded-full animate-pulse"></div>
                                    <div className="h-5 w-32 bg-gray-200 rounded animate-pulse"></div>
                                </div>
                            ))
                        ) : filteredStudents.length > 0 ? (
                            filteredStudents.map((student) => (
                                <div key={student.id} className="p-4 flex items-center space-x-3">
                                    <Checkbox
                                        id={`student-${student.id}`}
                                        checked={selectedStudents.includes(student.id)}
                                        onCheckedChange={() => handleSelectStudent(student.id)}
                                    />
                                    <div className="h-10 w-10">
                                        <User className="w-8 h-8 p-1 rounded-full border border-gray-400" />
                                    </div>
                                    <label htmlFor={`student-${student.id}`} className="font-medium cursor-pointer flex-grow">
                                        {student.full_name}
                                    </label>
                                </div>
                            ))
                        ) : (
                            <div className="p-4 text-center text-gray-500">
                                {students.length === 0 ? "No students available" : "No students match your search"}
                            </div>
                        )}
                    </div>
                </div>

                <div className="p-4 border-t flex justify-end space-x-2">
                    <Button variant="outline" onClick={onClose}>
                        Cancel
                    </Button>
                    <Button onClick={handlePublish} disabled={selectedStudents.length === 0}>
                        Publish Test
                    </Button>
                </div>
            </div>
        </div>
    )
}