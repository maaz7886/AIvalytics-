// import React from 'react'

// export default function TopNavBar() {
//   return (
//     <div>
//        <header className="bg-white border-b border-gray-200">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="flex justify-between h-16">
//             <div className="flex items-center">
//               <svg className="h-8 w-8 text-indigo-600" viewBox="0 0 24 24" fill="currentColor">
//                 <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"></path>
//               </svg>
//             </div>
//             <div className="flex items-center">
//               <button className="p-1 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none">
//                 <span className="sr-only">View notifications</span>
//                 <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                   <path
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                     strokeWidth={2}
//                     d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
//                   />
//                 </svg>
//               </button>
//               <div className="ml-3 relative flex items-center">
// <div className="flex items-center">
//   <img
//     className="h-8 w-8 rounded-full"
//     src="https://media.licdn.com/dms/image/v2/D5603AQEsnkbsu4SOOQ/profile-displayphoto-shrink_400_400/profile-displayphoto-shrink_400_400/0/1703611781428?e=1746662400&v=beta&t=vRjNdVVL9Wd4w1FBBIdKa2Lg4Y3Occyc_-SF9XhBhlI"
//     alt=""
//   />
//   <span className="ml-2 text-gray-700">Chetan more</span>
// </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </header>
//     </div>
//   )
// }












import { Bell, Book, User, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";

const TopNavBar = ({ name }: { name: string }) => {
  const handleLogout = () => {
    localStorage.removeItem('Authstudents');
    window.location.href = '/';
  };

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="bg-indigo-600 text-white p-2 rounded">
            <Book className="h-6 w-6" />
          </div>
          <h1 className="text-xl font-bold text-gray-800">Aivaylatics</h1>
        </div>
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon">
            <Bell className="h-5 w-5" />
          </Button>
        
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
                <User className="h-5 w-5 text-gray-500" />
              </div>
              <div className="hidden md:block">
                <span className="text-sm font-medium">{name}</span>
              </div>
            </div>
            <Button 
              variant="ghost" 
              size="icon"
              onClick={handleLogout}
              className="text-gray-600 hover:text-red-600 hover:bg-red-50"
            >
              <LogOut className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default TopNavBar;