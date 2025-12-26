import React from "react";
import { Link, NavLink, useNavigate } from "react-router";
import toast from "react-hot-toast";
import useAuth from "../hooks/useAuth";

const Navbar = () => {
  const { user, logOut } = useAuth();
  const navigate = useNavigate();
  console.log(user);

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
      <div className="bg-white  border-b-2 border-gray-300">
        <div className="navbar   px-4">
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
                <li>
                  <NavLink to="/about-us">About US</NavLink>
                </li>
                <li>
                  <NavLink to="/profile">Routine</NavLink>
                </li>
                <li>
                  <NavLink to="/rooms">Rooms</NavLink>
                </li>
              </ul>
            </div>
            <div className="flex gap-1">
              <Link
                to="/"
                className="flex items-center text-center text-[14px] sm:text-xl font-semibold ml-2 btn-ghost bg-linear-to-r from-[#e14486] to-[#e14459]
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
              <li>
                <NavLink to="/about-us">About Us</NavLink>
              </li>
              <li>
                <NavLink to="/profile">Routine</NavLink>
              </li>
              <li>
                <NavLink to="/rooms">Rooms</NavLink>
              </li>
            </ul>
            {user ? (
              <button
                onClick={handleLogout}
                className="btn bg-secondary text-white rounded-full hover:scale-105"
              >
                Logout
              </button>
            ) : (
              <div className="flex gap-2">
                <Link
                  to="/login"
                  className="btn bg-secondary text-white rounded-full hover:scale-105"
                >
                  LogIn
                </Link>
                <Link
                  to="/register"
                  className="btn bg-secondary text-white rounded-full hover:scale-105"
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
