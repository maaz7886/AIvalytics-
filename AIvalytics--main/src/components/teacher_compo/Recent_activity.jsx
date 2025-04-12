import React from 'react'
import { FileText, Plus, Users } from "lucide-react"
import Link from "next/link"



export default function Recent_activity() {
  return (
    <div>
      <div className="p-6 mt-6 bg-white rounded-lg shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-800">Recent Activity</h2>
              <Link href="/activity" className="text-sm text-emerald-500 hover:underline">
                View all
              </Link>
            </div>
            <div className="space-y-4">
              <ActivityItem
                icon={
                  <div className="p-1.5 bg-emerald-100 rounded-full">
                    <FileText className="w-4 h-4 text-emerald-500" />
                  </div>
                }
                title="Physics Quiz completed by Class 10A"
                time="2 minutes ago"
              />
              <ActivityItem
                icon={
                  <div className="p-1.5 bg-emerald-100 rounded-full">
                    <Plus className="w-4 h-4 text-emerald-500" />
                  </div>
                }
                title="25 new MCQs added to Chemistry"
                time="15 minutes ago"
              />
              <ActivityItem
                icon={
                  <div className="p-1.5 bg-emerald-100 rounded-full">
                    <Users className="w-4 h-4 text-emerald-500" />
                  </div>
                }
                title="New student group added: Class 11B"
                time="1 hour ago"
              />
            </div>
          </div>
    </div>
  )
}

function ActivityItem({ icon, title, time }) {
    return (
      <div className="flex items-start gap-3">
        {icon}
        <div>
          <p className="text-sm font-medium text-gray-800">{title}</p>
          <p className="text-xs text-gray-500">{time}</p>
        </div>
      </div>
    )
  }