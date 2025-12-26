import React from 'react'
import { Link } from 'react-router'

const Home = () => {
  return (
    <>
      <header className="bg-gradient-to-b from-teal-50 to-white">
        <div className="max-w-6xl mx-auto px-6 py-20 sm:py-28 text-center">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-slate-900 leading-tight">
            Find Your Perfect
            <span className="text-teal-600 block md:inline md:ml-3">Classroom</span>
          </h1>
          <p className="mt-6 text-slate-600 text-base sm:text-lg max-w-3xl mx-auto">Discover available rooms, check schedules, and manage academic routine efficiently.</p>
        </div>
      </header>

      <section className="bg-white -mt-8">
        <div className="max-w-6xl mx-auto px-6 pb-12">
          <div className="text-center pt-12">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">Everything You Need</h2>
            <p className="mt-2 text-sm sm:text-base text-slate-600 max-w-2xl mx-auto">Comprehensive tools to help you navigate campus rooms and schedules.</p>
          </div>

          <div className="mt-8 grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
       
            <div className="bg-white border rounded-xl shadow-sm p-6 flex gap-6 items-start">
              <div className="w-12 h-12 flex items-center justify-center rounded-lg bg-teal-50 text-teal-600">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-slate-900">Live Schedule</h3>
                <p className="mt-2 text-sm text-slate-600">View real-time classroom schedules and find available rooms instantly.</p>
              </div>
            </div>

            <div className="bg-white border rounded-xl shadow-sm p-6 flex gap-6 items-start">
              <div className="w-12 h-12 flex items-center justify-center rounded-lg bg-teal-50 text-teal-600">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 12.414a4 4 0 10-5.657 5.657l4.243 4.243a8 8 0 0011.314-11.314l-4.243 4.243z" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-slate-900">Room Finding</h3>
                <p className="mt-2 text-sm text-slate-600">Quickly locate classrooms and labs across the campus with ease.</p>
              </div>
            </div>

  
            <div className="bg-white border rounded-xl shadow-sm p-6 flex gap-6 items-start">
              <div className="w-12 h-12 flex items-center justify-center rounded-lg bg-teal-50 text-teal-600">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3M3 11h18M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-slate-900">Information Center</h3>
                <p className="mt-2 text-sm text-slate-600">Access comprehensive information about rooms, teachers, and sections.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-slate-50 py-10">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
            <div>
              <div className="text-3xl sm:text-4xl font-extrabold text-teal-600">40+</div>
              <div className="text-sm text-slate-600 mt-1">Classrooms</div>
            </div>
            <div>
              <div className="text-3xl sm:text-4xl font-extrabold text-teal-600">10+</div>
              <div className="text-sm text-slate-600 mt-1">Labs</div>
            </div>
            <div>
              <div className="text-3xl sm:text-4xl font-extrabold text-teal-600">80+</div>
              <div className="text-sm text-slate-600 mt-1">Teachers</div>
            </div>
            <div>
              <div className="text-3xl sm:text-4xl font-extrabold text-teal-600">1200+</div>
              <div className="text-sm text-slate-600 mt-1">Students</div>
            </div>
          </div>
        </div>
      </section> 

      <section className="py-12">
        <div className="max-w-4xl mx-auto px-6">
          <div className="bg-teal-400 rounded-2xl text-white p-10 md:p-14 text-center">
            <div className="flex flex-col items-center">
              <div className="bg-white/20 rounded-full p-3 mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-2xl sm:text-3xl font-extrabold">Ready to Get Started?</h3>
              <p className="mt-3 text-sm sm:text-base max-w-2xl">Register now to access all features including personalized schedules and room availability notifications.</p>

              <div className="mt-6">
                <Link to="/register" className="bg-teal-600 text-white rounded-full px-6 py-3 font-semibold shadow">Create Account</Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

export default Home