import { BarChart3, BookOpen, ChevronDown, FileText, Home, LineChart, Plus, Users } from "lucide-react"
import Image from "next/image"
import Infobar_top from "../../components/Infobar_top"
import Active_test from "../../components/Active_test"
import Recent_activity from "../../components/Recent_activity"
import Sidebar from "../../components/Sidebar"


// import mongo from "./api/mongodb"
export default function Dashboard() {
    return (
        <div className="flex min-h-screen bg-gray-50">
            {/* Sidebar */}
            
            <Sidebar/>

            {/* Main Content */}
            <div className="flex-1  border-2 border-t-0 border-gray-400">
                <header className="bg-white border-b">
                    <div className="flex items-center justify-between px-6 py-4">
                        <h1 className="text-2xl font-semibold text-gray-800">Dashboard</h1>
                        <div className="flex items-center gap-4">
                            <p className=" text-gray-600 font-medium">
                                Mr. Chetan The Dev
                            </p>
                            <div className="w-8 h-8 overflow-hidden rounded-full">
                                <Image
                                    src="https://media.licdn.com/dms/image/v2/D5603AQEsnkbsu4SOOQ/profile-displayphoto-shrink_400_400/profile-displayphoto-shrink_400_400/0/1703611781428?e=1746662400&v=beta&t=vRjNdVVL9Wd4w1FBBIdKa2Lg4Y3Occyc_-SF9XhBhlI"
                                    alt="Profile"
                                    width={32}
                                    height={32}
                                    className="object-cover"
                                />
                            </div>
                        </div>
                    </div>
                </header>

                <main className="p-6">


                    <Infobar_top />

                    {/* Active Test */}
                    <Active_test />

                    {/* Recent activity  */}

                    <Recent_activity />


                </main>
            </div>
        </div>
    )
}
