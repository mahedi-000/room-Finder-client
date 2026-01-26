import React from "react";
import { Link } from "react-router";
import useRole from "../hooks/useRole";
import { useNavigate } from "react-router";
import { useEffect } from "react";
import LoadingSpinner from "../Components/LoadingSpinner";

const AdminPanel = () => {
  const [currentUserRole, isRoleLoading] = useRole();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isRoleLoading && currentUserRole !== "ADMIN") {
      navigate("/");
    }
  }, [currentUserRole, isRoleLoading, navigate]);

  if (isRoleLoading) return <LoadingSpinner />;

  if (currentUserRole !== "ADMIN") {
    return null;
  }

  const adminActions = [
    {
      title: "Add Routine",
      description: "Create a new class routine for sections",
      link: "/upload-routine",
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      ),
      color: "from-orange-500 to-red-500",
    },
    {
      title: "Add Course",
      description: "Create a new course in the system",
      link: "/upload-course",
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      ),
      color: "from-blue-500 to-indigo-500",
    },
    {
      title: "Add Section",
      description: "Create a new section for students",
      link: "/upload-section",
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
      color: "from-green-500 to-teal-500",
    },
    {
      title: "Add Room",
      description: "Create a new room or lab",
      link: "/upload-room",
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
      ),
      color: "from-purple-500 to-pink-500",
    },
    {
      title: "Add Room Status",
      description: "Set room availability status",
      link: "/upload-room-status",
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      color: "from-cyan-500 to-blue-500",
    },
  ];

  return (
    <div className="min-h-screen p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-block">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-teal-600 to-cyan-600 bg-clip-text text-transparent mb-2">
              Admin Panel
            </h1>
            <div className="h-1 bg-gradient-to-r from-teal-600 to-cyan-600 rounded-full"></div>
          </div>
          <p className="text-gray-600 mt-2">Manage routines, courses, sections, and rooms</p>
        </div>

        {/* Action Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {adminActions.map((action) => (
            <Link
              key={action.title}
              to={action.link}
              className="group bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
            >
              <div className={`w-16 h-16 rounded-full bg-gradient-to-br ${action.color} flex items-center justify-center text-white mb-4 group-hover:scale-110 transition-transform duration-300`}>
                {action.icon}
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">{action.title}</h3>
              <p className="text-gray-500 text-sm">{action.description}</p>
              <div className="mt-4 flex items-center text-teal-600 font-medium text-sm group-hover:text-teal-700">
                <span>Go to page</span>
                <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
