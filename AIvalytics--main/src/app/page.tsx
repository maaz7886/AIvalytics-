import React from 'react'
import Dashboard from './dashboard/page'
import Link from "next/link"
import LoginPage from './authentication/login/page'
import StudentDashboard from './student/page'

function page() {
  return (
    <div>
      <Dashboard/>
      {/* <LoginPage/> */}

      {/* <StudentDashboard /> */}
    </div>
  )
}

export default page
