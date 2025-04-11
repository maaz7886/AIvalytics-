// import { BookOpen, Clock, TrendingUp, CheckCircle } from 'lucide-react'
// import React from 'react'

// type Test = {
//   id: string
//   name: string
//   subject: string
//   dueDate: string
//   status: "New" | "Pending" | "Completed"
//   score?: number
//   completedOn?: string
// }

// interface StatsCardsProps {
//   tests: Test[];
//   completedTests: Test[];
// }

// export default function StatsCards({ tests, completedTests }: StatsCardsProps) {

//      // Calculate statistics
//   const totalTests = tests.length
//   const upcomingTests = tests.filter((test) => test.status !== "Completed").length
//   const averageScore =
//     completedTests.length > 0
//       ? Math.round(completedTests.reduce((sum, test) => sum + (test.score || 0), 0) / completedTests.length)
//       : 0
//   const completionRate = totalTests > 0 ? Math.round((completedTests.length / totalTests) * 100) : 0



//   return (
//     <div>
//         <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
//           {/* Total Tests Card */}
//           <div className="bg-white overflow-hidden shadow rounded-lg">
//             <div className="px-4 py-5 sm:p-6">
//               <div className="flex items-center">
//                 <div className="flex-shrink-0 bg-green-100 rounded-md p-3">
//                   <BookOpen className="h-6 w-6 text-green-600" />
//                 </div>
//                 <div className="ml-5 w-0 flex-1">
//                   <dt className="text-sm font-medium text-gray-500 truncate">Total Tests</dt>
//                   <dd className="flex items-baseline">
//                     <div className="text-2xl font-semibold text-gray-900">{totalTests}</div>
//                     <div className="ml-2 flex items-baseline text-sm font-semibold text-green-600">
//                       <span>+8% from last month</span>
//                     </div>
//                   </dd>
//                 </div>
//               </div>
//             </div>
//           </div>

         

//           {/* Average Score Card */}
//           <div className="bg-white overflow-hidden shadow rounded-lg">
//             <div className="px-4 py-5 sm:p-6">
//               <div className="flex items-center">
//                 <div className="flex-shrink-0 bg-green-100 rounded-md p-3">
//                   <TrendingUp className="h-6 w-6 text-green-600" />
//                 </div>
//                 <div className="ml-5 w-0 flex-1">
//                   <dt className="text-sm font-medium text-gray-500 truncate">Average Score</dt>
//                   <dd className="flex items-baseline">
//                     <div className="text-2xl font-semibold text-gray-900">{averageScore}%</div>
//                     <div className="ml-2 flex items-baseline text-sm font-semibold text-green-600">
//                       <span>+5% improvement</span>
//                     </div>
//                   </dd>
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* Completion Rate Card */}
//           <div className="bg-white overflow-hidden shadow rounded-lg">
//             <div className="px-4 py-5 sm:p-6">
//               <div className="flex items-center">
//                 <div className="flex-shrink-0 bg-green-100 rounded-md p-3">
//                   <CheckCircle className="h-6 w-6 text-green-600" />
//                 </div>
//                 <div className="ml-5 w-0 flex-1">
//                   <dt className="text-sm font-medium text-gray-500 truncate">Completion Rate</dt>
//                   <dd className="flex items-baseline">
//                     <div className="text-2xl font-semibold text-gray-900">{completionRate}%</div>
//                     <div className="ml-2 flex items-baseline text-sm font-semibold text-green-600">
//                       <span>+3% from last week</span>
//                     </div>
//                   </dd>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//     </div>
//   )
// }










import { Card } from "@/components/ui/card";
import { Book, LineChart, Target, TrendingUp } from "lucide-react";


type Test = {
  id: string
  name: string
  subject: string
  dueDate: string
  status: "New" | "Pending" | "Completed"
  score?: number
  completedOn?: string
}
type StatsCardsProps = {
  tests:Test[];
  completedTests:Test[]
};

const StatsCards = ({ tests, completedTests }: StatsCardsProps) => {
  // Calculate statistics
  const totalTests = tests.length;
  const averageScore =
    completedTests.length > 0
      ? Math.round(completedTests.reduce((sum, test) => sum + (test.score || 0), 0) / completedTests.length)
      : 0;
  const completionRate = totalTests > 0 ? Math.round((completedTests.length / totalTests) * 100) : 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <Card className="p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-gray-500 font-medium mb-1">Total Tests</p>
            <h2 className="text-3xl font-bold">{totalTests}</h2>
            <div className="flex items-center mt-1 text-green-500 text-sm font-medium">
              <TrendingUp className="h-4 w-4 mr-1" />
              <span>+8% from last month</span>
            </div>
          </div>
          <div className="bg-green-100 p-2 rounded-md">
            <Book className="h-6 w-6 text-green-600" />
          </div>
        </div>
      </Card>

      <Card className="p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-gray-500 font-medium mb-1">Average Score</p>
            <h2 className="text-3xl font-bold">{averageScore}%</h2>
            <div className="flex items-center mt-1 text-green-500 text-sm font-medium">
              <TrendingUp className="h-4 w-4 mr-1" />
              <span>+5% improvement</span>
            </div>
          </div>
          <div className="bg-blue-100 p-2 rounded-md">
            <LineChart className="h-6 w-6 text-blue-600" />
          </div>
        </div>
      </Card>

      <Card className="p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-gray-500 font-medium mb-1">Completion Rate</p>
            <h2 className="text-3xl font-bold">{completionRate}%</h2>
            <div className="flex items-center mt-1 text-green-500 text-sm font-medium">
              <TrendingUp className="h-4 w-4 mr-1" />
              <span>+3% from last week</span>
            </div>
          </div>
          <div className="bg-emerald-100 p-2 rounded-md">
            <Target className="h-6 w-6 text-emerald-600" />
          </div>
        </div>
      </Card>
    </div>
  );
};

export default StatsCards;