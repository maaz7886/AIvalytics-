"use client"
import Image from "next/image";
import Infobar_top from "@/components/teacher_compo/Infobar_top";
import Active_test from "@/components/teacher_compo/Active_test";
import Recent_activity from "@/components/teacher_compo/Recent_activity";
import { useEffect, useState } from "react";
import { useRouter } from 'next/navigation';

export default function Dashboard() {
    const [teacher, setTeacher] = useState(null); // Initialize with null
    const router = useRouter();

    useEffect(() => {
        const teacherData = localStorage.getItem('Authteachers');
        if (teacherData) {  
            const parsedData = JSON.parse(teacherData);
            console.log('teacher data from localStorage:', parsedData);
            setTeacher(parsedData);
        }
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('Authteachers'); // Remove teacher data from localStorage
        setTeacher(null); // Clear teacher state
        router.push('/'); // Redirect to login page
    };

    return (
        <div className="flex min-h-screen bg-gray-50">
            {/* Sidebar */}

            {/* Main Content */}
            <div className="flex-1 border-2 border-t-0 border-gray-400">
                <header className="bg-white border-b">
                    <div className="flex items-center justify-between px-6 py-4">
                        <h1 className="text-2xl font-semibold text-gray-800">Dashboard</h1>
                        <div className="flex items-center gap-4">
                            {teacher && ( // Check if teacher data is available
                                <>
                                    <p className="text-gray-600 font-medium">{teacher.full_name}</p>
                                    <div className="w-8 h-8 overflow-hidden rounded-full">
                                        <Image
                                            src="https://media.licdn.com/dms/image/v2/D5603AQEsnkbsu4SOOQ/profile-displayphoto-shrink_400_400/profile-displayphoto-shrink_400_400/0/1703611781428?e=1746662400&v=beta&t=vRjNdVVL9Wd4w1FBBIdKa2Lg4Y3Occyc_-SF9XhBhlI"
                                            alt="Profile"
                                            width={32}
                                            height={32}
                                            className="object-cover"
                                        />
                                    </div>
                                    <button
                                        onClick={handleLogout}
                                        className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 transition-colors"
                                    >
                                        Logout
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                </header>

                <main className="p-6">
                    {/* Info Bar */}
                    <Infobar_top />

                    {/* Active Test */}
                    <Active_test />

                    {/* Recent Activity */}
                    <Recent_activity />
                </main>
            </div>
        </div>
    );
}
