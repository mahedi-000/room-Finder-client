import React from "react";
import { Link, NavLink, useNavigate } from "react-router";
import toast from "react-hot-toast";
import useAuth from "../hooks/useAuth";
import useRole from "../hooks/useRole";

const Navbar = () => {
  const { user, logOut } = useAuth();
  const [currentUserRole, isRoleLoading] = useRole();
  const navigate = useNavigate();
  const isAdmin = currentUserRole === "ADMIN";

  const handleLogout = () => {
    logOut()
      .then(() => {
        toast.success("Logout successful");
        navigate("/");
      })
      .catch((err) => {
        toast.error(err.message || "Logout failed");
      });
  };
  return (
    <div>
      <div className="fixed top-0 left-0 right-0 bg-white border-b-2 border-gray-300 z-50">
        <div className="navbar px-4">
          <div className=" navbar-start">
            <div className="dropdown">
              <div
                tabIndex={0}
                role="button"
                className="btn btn-ghost md:hidden"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 12h8m-8 6h16"
                  />
                </svg>
              </div>
              <ul
                tabIndex={0}
                className=" menu-sm dropdown-content bg-base-100 rounded-box z-50 mt-3 w-52  shadow font-semibold"
              >
                <li>
                  <NavLink to="/">Home</NavLink>
                </li>
                {isAdmin && (
                  <>
                    <li>
                      <NavLink to="/admin">Admin Panel</NavLink>
                    </li>
                    <li>
                      <NavLink to="/all-users">All Users</NavLink>
                    </li>
                  </>
                )}
                <li className="py-2 px-3 font-semibold text-gray-600">
                  Routines
                </li>
                <li className="pl-4">
                  <NavLink to="/routines">Section Routine</NavLink>
                </li>
                <li className="pl-4">
                  <NavLink to="/teacher-routine">Teacher Routine</NavLink>
                </li>
                <li className="pl-4">
                  <NavLink to="/room-routine">Room Routine</NavLink>
                </li>
                <li>
                  <NavLink to="/rooms">Rooms</NavLink>
                </li>
              </ul>
            </div>
            <div className="flex gap-1">
              <Link
                to="/"
                className="flex items-center text-center text-[14px] sm:text-xl font-semibold ml-2 btn-ghost bg-linear-to-r from-teal-600 to-teal-400
 bg-clip-text text-transparent "
              >
                RoomFinder
              </Link>
            </div>
          </div>
          <div className="navbar-end gap-4">
            <ul className="menu-horizontal px-1 font-semibold gap-4 hidden md:flex">
              <li>
                <NavLink to="/">Home</NavLink>
              </li>
              {isAdmin && (
                <>
                  <li>
                    <NavLink to="/admin">Admin Panel</NavLink>
                  </li>
                  <li>
                    <NavLink to="/all-users">All Users</NavLink>
                  </li>
                </>
              )}
              <li className="relative group">
                <span className="cursor-pointer hover:text-teal-600 flex items-center gap-1">
                  Routines
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </span>
                <ul className="absolute left-0 top-full mt-2 w-44 bg-white border border-gray-200 rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                  <li>
                    <NavLink
                      to="/routines"
                      className="block px-4 py-2 hover:bg-teal-50 hover:text-teal-600 rounded-t-lg"
                    >
                      Section Routine
                    </NavLink>
                  </li>
                  <li>
                    <NavLink
                      to="/teacher-routine"
                      className="block px-4 py-2 hover:bg-teal-50 hover:text-teal-600"
                    >
                      Teacher Routine
                    </NavLink>
                  </li>
                  <li>
                    <NavLink
                      to="/room-routine"
                      className="block px-4 py-2 hover:bg-teal-50 hover:text-teal-600 rounded-b-lg"
                    >
                      Room Routine
                    </NavLink>
                  </li>
                </ul>
              </li>
              <li>
                <NavLink to="/rooms">Rooms</NavLink>
              </li>
            </ul>
            {user ? (
              <div className="flex items-center gap-3">
                {isRoleLoading ? (
                  <span className="px-2 py-1 bg-teal-50 text-teal-700 rounded-full text-sm font-medium">
                    Loading...
                  </span>
                ) : (
                  currentUserRole && (
                    <span className="px-2 py-1 bg-teal-50 text-teal-700 rounded-full text-sm font-medium">
                      {currentUserRole}
                    </span>
                  )
                )}

                <button
                  onClick={handleLogout}
                  className="btn bg-teal-600 text-white rounded-full hover:scale-105"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex gap-2">
                <Link
                  to="/login"
                  className="btn bg-teal-600 text-white rounded-full hover:scale-105"
                >
                  LogIn
                </Link>
                <Link
                  to="/register"
                  className="btn bg-teal-600 text-white rounded-full hover:scale-105"
                >
                  SignUp
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
