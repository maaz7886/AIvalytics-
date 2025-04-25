"use client"

import { useState, useEffect } from "react"
import { Search, Calendar, BarChart, X, ChevronLeft, ChevronRight, User } from "lucide-react"
import { supabase } from "@/lib/supabase/client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger } from "@/components/ui/select"

import TestResultViewer from "./test-preview"

export default function SubmittedTestsPage() {
    const [submittedTests, setSubmittedTests] = useState([])
    const [searchQuery, setSearchQuery] = useState("")
    const [dateFilter, setDateFilter] = useState("all")
    const [scoreFilter, setScoreFilter] = useState("all")
    const [statusFilter, setStatusFilter] = useState("all")
    const [currentPage, setCurrentPage] = useState(1)
    const [selectedTest, setSelectedTest] = useState(null)
    const [showTestModal, setShowTestModal] = useState(false)
    const itemsPerPage = 7
    const [viewTest, setViewTest] = useState([])
    const [loading, setLoading] = useState(true)

    const fetchSubmittedTests = async () => {
        try {
            // Fetch all test attempts
            const { data: attempts, error: attemptsError } = await supabase
                .from("test_attempts")
                .select("*");

            if (attemptsError) throw new Error(attemptsError.message);

            // Fetch student and test details
            const detailedTests = await Promise.all(attempts.map(async (attempt) => {
                const { data: studentData, error: studentError } = await supabase
                    .from("students")
                    .select("full_name")
                    .eq("id", attempt.student_id)
                    .single();

                if (studentError) throw new Error(studentError.message);

                const { data: testData, error: testError } = await supabase
                    .from("tests")
                    .select("Title")
                    .eq("id", attempt.test_id)
                    .single();

                if (testError) throw new Error(testError.message);

                return {
                    ...attempt,
                    student_name: studentData.full_name,
                    test_name: testData.Title,
                };
            }));

            setSubmittedTests(detailedTests);
            console.log('====================================');
            console.log(detailedTests);
            console.log('====================================');
        } catch (error) {
            console.error("Error fetching submitted tests:", error);
        } finally {
            setLoading(false)
        }
    };

    useEffect(() => {
        fetchSubmittedTests();
    }, []);

    // Filter submissions based on search query and filters
    const filteredSubmissions = submittedTests.filter((submission) => {
        // Search filter
        const searchLower = searchQuery.toLowerCase()
        const nameMatch = submission.student_name.toLowerCase().includes(searchLower)
        const testMatch = submission.test_name.toLowerCase().includes(searchLower)
        const searchMatch = nameMatch || testMatch

        // Date filter
        let dateMatch = true
        if (dateFilter === "today") {
            dateMatch = submission.submissionDate === "Apr 12, 2025"
        } else if (dateFilter === "yesterday") {
            dateMatch = submission.submissionDate === "Apr 11, 2025"
        } else if (dateFilter === "thisWeek") {
            dateMatch = ["Apr 8, 2025", "Apr 9, 2025", "Apr 10, 2025", "Apr 11, 2025", "Apr 12, 2025"].includes(
                submission.submissionDate,
            )
        }

        // Score filter
        let scoreMatch = true
        if (scoreFilter === "high") {
            scoreMatch = submission.score === 5
        } else if (scoreFilter === "medium") {
            scoreMatch = submission.score >= 2 && submission.score < 4
        } else if (scoreFilter === "low") {
            scoreMatch = submission.score !== null && submission.score < 2
        }

        // Status filter
        let statusMatch = true
        if (statusFilter === "graded") {
            statusMatch = submission.status === "graded"
        } else if (statusFilter === "pending") {
            statusMatch = submission.status === "pending"
        }

        return searchMatch && dateMatch && scoreMatch && statusMatch
    })

    // Calculate pagination
    const totalPages = Math.ceil(filteredSubmissions.length / itemsPerPage)
    const startIndex = (currentPage - 1) * itemsPerPage
    const endIndex = startIndex + itemsPerPage
    // const currentSubmissions = filteredSubmissions.slice(startIndex, endIndex)

    // Handle view details click
    const handleViewDetails = (submission) => {
        setViewTest(submission.id)
        setSelectedTest(submission)
        setShowTestModal(true)
    }

    return (
        <div className=" ">



            <div className="p-6 ">

                <div className="mb-6">
                    <h1 className="text-2xl font-bold">Submitted Tests</h1>
                    <p className="text-muted-foreground">View and manage all test submissions from your students</p>
                </div>

                <div className="flex flex-col md:flex-row gap-4 mb-6">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                        <Input
                            placeholder="Search by student or test name"
                            className="pl-10"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <div className="flex gap-2">
                        <Select value={dateFilter} onValueChange={setDateFilter}>
                            <SelectTrigger className="w-[140px]">
                                <div className="flex items-center gap-2">
                                    <Calendar className="h-4 w-4" />
                                    <span>Date Range</span>
                                </div>
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Dates</SelectItem>
                                <SelectItem value="today">Today</SelectItem>
                                <SelectItem value="yesterday">Yesterday</SelectItem>
                                <SelectItem value="thisWeek">This Week</SelectItem>
                            </SelectContent>
                        </Select>

                        <Select value={scoreFilter} onValueChange={setScoreFilter}>
                            <SelectTrigger className="w-[120px]">
                                <div className="flex items-center gap-2">
                                    <BarChart className="h-4 w-4" />
                                    <span>Score</span>
                                </div>
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Scores</SelectItem>
                                <SelectItem value="high">5</SelectItem>
                                <SelectItem value="medium">2-4</SelectItem>
                                <SelectItem value="low">0-1</SelectItem>
                            </SelectContent>
                        </Select>

                        <Select value={statusFilter} onValueChange={setStatusFilter}>
                            <SelectTrigger className="w-[120px]">
                                <div className="flex items-center gap-2">
                                    <span>Status</span>
                                </div>
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Status</SelectItem>
                                <SelectItem value="graded">Graded</SelectItem>
                                <SelectItem value="pending">Pending</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                <div className="border rounded-md">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[200px]">STUDENT</TableHead>
                                <TableHead>TEST NAME</TableHead>
                                <TableHead>SUBMISSION DATE</TableHead>
                                <TableHead className="text-center">SCORE</TableHead>
                                <TableHead className="text-center">STATUS</TableHead>
                                <TableHead className="text-center">ACTIONS</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {loading ? (
                                // Loading skeleton
                                Array.from({ length: itemsPerPage }).map((_, index) => (
                                    <TableRow key={index}>
                                        <TableCell>
                                            <div className="flex items-center gap-3">
                                                <div className="h-8 w-8 bg-gray-300 rounded-full animate-pulse"></div>
                                                <div className="h-4 bg-gray-300 rounded animate-pulse w-1/2"></div>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="h-4 bg-gray-300 rounded animate-pulse w-3/4"></div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="h-4 bg-gray-300 rounded animate-pulse w-1/2"></div>
                                        </TableCell>
                                        <TableCell className="text-center">
                                            <div className="h-4 bg-gray-300 rounded animate-pulse "></div>
                                        </TableCell>
                                        <TableCell className="">
                                            <div className="h-8 bg-gray-300 rounded animate-pulse"></div>
                                        </TableCell>
                                        <TableCell className="">
                                            <div className="h-8 bg-gray-300 rounded animate-pulse"></div>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                filteredSubmissions.map((submission) => (
                                    <TableRow key={submission.id}>
                                        <TableCell>
                                            <div className="flex items-center gap-3">
                                                <User className={`h-8 w-8 bg-gray-300 p-1 rounded-2xl `} />
                                                <div>
                                                    <div className="font-medium">{submission.student_name}</div>
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div>
                                                <div className="font-medium text-primary">{submission.test_name}</div>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div>
                                                <div className="text-sm text-muted-foreground">{new Date(submission.completed_at).toLocaleString()}</div>
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-center">
                                            {submission.score > 0 ? (
                                                <Badge
                                                    variant="outline"
                                                    className=" h-8 w-8 text-center text-[16px]   justify-center "
                                                >
                                                    {submission.score}
                                                </Badge>
                                            ) : (
                                                <Badge variant="outline" className="bg-gray-100">
                                                    Pending
                                                </Badge>
                                            )}
                                        </TableCell>
                                        <TableCell className="text-center">

                                            <p
                                                className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${false ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800" }`}                                            >
                                                Pending
                                            </p>

                                        </TableCell>
                                        <TableCell className=" text-center">

                                            <button
                                                className=" bg-indigo-500 font-semibold text-white border p-2 rounded-[8px]  border-gray-400 "
                                                onClick={() => handleViewDetails(submission)}
                                            >
                                                View Details
                                            </button>

                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                    <div className="flex items-center justify-between p-4 border-t">
                        <div className="text-sm text-muted-foreground">
                            Showing {startIndex + 1} to {Math.min(endIndex, filteredSubmissions.length)} of {filteredSubmissions.length}{" "}
                            results
                        </div>
                        <div className="flex items-center gap-1">
                            <Button
                                variant="outline"
                                size="icon"
                                disabled={currentPage === 1}
                                onClick={() => setCurrentPage(currentPage - 1)}
                            >
                                <ChevronLeft className="h-4 w-4" />
                            </Button>

                            {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                                const pageNumber = i + 1
                                return (
                                    <Button
                                        key={pageNumber}
                                        variant={pageNumber === currentPage ? "default" : "outline"}
                                        size="sm"
                                        className="h-8 w-8"
                                        onClick={() => setCurrentPage(pageNumber)}
                                    >
                                        {pageNumber}
                                    </Button>
                                )
                            })}

                            {totalPages > 5 && <span className="mx-2">...</span>}

                            {totalPages > 5 && (
                                <Button variant="outline" size="sm" className="h-8 w-8" onClick={() => setCurrentPage(totalPages)}>
                                    {totalPages}
                                </Button>
                            )}

                            <Button
                                variant="outline"
                                size="icon"
                                disabled={currentPage === totalPages}
                                onClick={() => setCurrentPage(currentPage + 1)}
                            >
                                <ChevronRight className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Test Preview Modal */}
                {showTestModal && selectedTest && (
                    <div className="fixed inset-0 bg-transparent backdrop-blur-md flex items-center justify-center z-50 p-4">
                        <div className="bg-white rounded-lg border shadow-lg w-full max-w-4xl max-h-[90vh] overflow-auto">
                            <div className="flex justify-between items-center p-4 border-b border-gray-300">
                                <h2 className="text-xl font-bold">Test</h2>
                                <button onClick={() => setShowTestModal(false)} className="text-gray-500 hover:text-gray-700">
                                    <X className="w-6 h-6" />
                                </button>
                            </div>
                            <div className="p-6">
                                {
                                    console.log("sending")
                                }
                                <TestResultViewer attemptId={viewTest} />
                            </div>
                            <div className="p-4 border-t border-gray-300 flex justify-end">
                                <button
                                    onClick={() => setShowTestModal(false)}
                                    className="px-4 py-2 border border-gray-400 rounded hover:bg-gray-200 transition"
                                >
                                    Close Preview
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>



        </div>

    )
}

