"use client";

import React from 'react';
import { BookOpen, FileText, Home } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Sidebar() {
  const pathname = usePathname(); // Automatically get current path

  return (
    <div className="w-64 bg-white border-gray-300 border h-screen">
      <div className="p-4">
        <Link href="/" className="flex items-center gap-2">
          <div className="h-8 bg-indigo-500 rounded-md px-2 flex items-center justify-center">
            <span className="text-white font-bold">Aivaylatics</span>
          </div>
        </Link>
      </div>

      <nav className="mt-6 px-3">
        <SidebarLink
          href="/teacher/dashboard"
          icon={<Home className="w-5 h-5" />}
          label="Dashboard"
          active={pathname === "/teacher/dashboard"}
        />
        <SidebarLink
          href="/teacher/createTest"
          icon={<BookOpen className="w-5 h-5" />}
          label="Create Test"
          active={pathname === "/teacher/createTest"}
        />
        <SidebarLink
          href="/teacher/submittedTests"
          icon={<FileText className="w-5 h-5" />}
          label="Submitted Tests"
          active={pathname === "/teacher/submittedTests"}
        />
      </nav>
    </div>
  );
}

function SidebarLink({ href, icon, label, active }) {
  return (
    <Link
      href={href}
      className={`flex items-center gap-3 px-3 py-2 mt-1 text-sm font-medium rounded-md ${
        active ? "bg-emerald-50 text-emerald-500" : "text-gray-600 hover:bg-gray-50"
      }`}
    >
      {icon}
      {label}
    </Link>
  );
}
