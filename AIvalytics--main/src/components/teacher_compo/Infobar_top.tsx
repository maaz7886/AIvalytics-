"use client";


import { BookOpen, FileText, LineChart, Users } from "lucide-react"
import { JSX } from "react";



function Infobar_top() {
   

    const info = { activeTestCount: 0, count: 0 }
    const { activeTestCount, count } = info;
 


    return (
        <div>
            {/* Stats Grid */}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
                <StatCard
                    title="Total Test's"
                    value={count}
                    change="+12% from last month"
                    icon={
                        <div className="p-2 h-fit bg-emerald-100 rounded-full">
                            <BookOpen className="w-5 h-5 text-emerald-500" />
                        </div>
                    }
                    positive={true}
                />
                <StatCard
                    title="Active Students"
                    value="47"
                    change="+8% from last month"
                    icon={
                        <div className="p-2 h-fit bg-blue-100 rounded-full">
                            <Users className="w-5 h-5 text-blue-500" />
                        </div>
                    }
                    positive={true}
                />
                <StatCard
                    title="Active Test's"
                    value={activeTestCount}
                    change="+24% from last hour"
                    icon={
                        <div className="p-2 h-fit bg-emerald-100 rounded-full">
                            <FileText className="w-5 h-5 text-emerald-500" />
                        </div>
                    }
                    positive={true}
                />
                <StatCard
                    title="Completion Rate"
                    value="92%"
                    change="+3% from last week"
                    icon={
                        <div className="p-2 h-fit bg-green-100 rounded-full">
                            <LineChart className="w-5 h-5 text-green-500" />
                        </div>
                    }
                    positive={true}
                />
            </div>
        </div>
    )
}

function StatCard({ title, value, change, icon, positive = true }: { title: string; value: string | number; change: string; icon: JSX.Element; positive?: boolean }) {
    return (
      <div className="p-6 bg-white rounded-lg shadow-sm">
        <div className="flex justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">{title}</p>
            <p className="mt-2 text-3xl font-bold text-gray-900">{value}</p>
            <p className={`mt-2 text-sm ${positive ? "text-green-600" : "text-red-600"}`}>{change}</p>
          </div>
          {icon}
        </div>
      </div>
    )
  }

export default Infobar_top
