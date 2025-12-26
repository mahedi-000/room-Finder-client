import React, { useContext, useState } from "react";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router";
import { FaEye } from "react-icons/fa";
import { IoEyeOff } from "react-icons/io5";
import { auth } from "../firebase/firebase.config";
import { AuthContext } from "../provider/authContext";
const Register = () => {
  const [show, setShow] = useState(false);
  const [error, setError] = useState("");
  const {
    createUser,
    updateUserProfile,
    signInWithGoogle,
    setUser,
    setLoading,
  } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleRegister = (e) => {
    e.preventDefault();
    const displayName = e.target.name?.value;
    const email = e.target.email?.value;
    const password = e.target.password?.value;
    const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z]).{6,}$/;
    if (!passwordPattern.test(password)) {
      setError(
        "Password must be at least 6 characters long and include at least one uppercase letter, one lowercase letter"
      );
      return;
    }
    setError("");
    createUser(email, password)
      .then(() => {
        updateUserProfile(displayName)
          .then(() => {
            setUser({ ...auth.currentUser });
            toast.success("Registration Successful");
            e.target.reset();
            setLoading(false);
            navigate("/");
          })
          .catch((err) => {
            toast.error(err.message);
          });
      })
      .catch((e) => {
        if (e.code === "auth/email-already-in-use") {
          toast.error("User already exists in the database.");
        } else if (e.code === "auth/weak-password") {
          toast.error(
            "You password should be 6 character long and must contain one uppercase & lowercase letter"
          );
        } else if (e.code === "auth/invalid-email") {
          toast.error("Invalid email format. Please check your email.");
        } else if (e.code === "auth/user-not-found") {
          toast.error("User not found. Please sign up first.");
        } else if (e.code === "auth/wrong-password") {
          toast.error("Wrong password. Please try again.");
        } else if (e.code === "auth/user-disabled") {
          toast.error("This user account has been disabled.");
        } else if (e.code === "auth/too-many-requests") {
          toast.error("Too many attempts. Please try again later.");
        } else if (e.code === "auth/operation-not-allowed") {
          toast.error("Operation not allowed. Please contact support.");
        } else if (e.code === "auth/network-request-failed") {
          toast.error("Network error. Please check your connection.");
        } else {
          toast.error(e.message || "An unexpected error occurred.");
        }
      });
  };
  const handleGoogleSignin = () => {
    signInWithGoogle()
      .then((res) => {
        console.log(res);
        setLoading(false);
        setUser(res.user);
        toast.success("Google signin successful");
        navigate("/");
      })
      .catch((err) => {
        console.log(err);
        toast.error(err.message);
      });
  };
  return (
    <div>
      {" "}
      <div
        className=" px-4 bg-white flex justify-center items-center  
 animate-gradient"
      >
        <div className=" w-112.5 p-6 rounded-2xl shadow-2xl my-4  border border-gray-100">
          <div className="text-center mb-3">
            <h1 className="text-2xl font-bold mt-2 primary">Register</h1>
          </div>

          <form onSubmit={handleRegister}>
            {" "}
            <div className="mb-3 ">
              <label className=" font-semibold text-sm  ">Name</label>
              <input
                type="text"
                name="name"
                placeholder="Enter Your Name"
                required
                className="w-full px-5 py-3 rounded-md  shadow-md border  border-gray-100 focus:outline-none "
              />
            </div>{" "}
            <div className="mb-3 ">
              <label className="  text-sm   font-semibold">Email</label>
              <input
                type="text"
                name="email"
                placeholder="example@gmail.com"
                required
                className="w-full px-5 py-3 rounded-md  shadow-md border border-gray-100 focus:outline-none "
              />
            </div>
            <div className="relative mb-3">
              <label className="text-sm font-semibold">Password</label>
              <input
                type={show ? "text" : "password"}
                name="password"
                placeholder="••••••••"
                required
                className="w-full px-5 py-3 rounded-md  shadow-md border border-gray-100 focus:outline-none"
              />
              <span
                onClick={() => setShow(!show)}
                className="absolute right-4 top-10 cursor-pointer "
              >
                {show ? <FaEye /> : <IoEyeOff />}
              </span>
            </div>
            {error && <p className="text-red-600 my-2">{error}</p>}
            <button
              type="submit"
              className="w-full mt-3 py-3 rounded-full bg-teal-600 text-white hover:bg-teal-600/80 font-semibold   shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 "
            >
              Register
            </button>
            <div className="flex items-center my-5 text-gray-400 text-sm">
              <div className="flex-1 h-px bg-gray-300"></div>
              <span className="mx-3">or continue with</span>
              <div className="flex-1 h-px bg-gray-300"></div>
            </div>
            <div className="flex justify-center gap-4">
              <button
                onClick={handleGoogleSignin}
                className="btn    w-full h-12 shadow-lg hover:shadow-xl   hover:scale-105 hover:bg-teal-600/80  bg-teal-600 text-white rounded-full transition-all duration-300 "
              >
                <svg
                  aria-label="Google logo"
                  width="16"
                  height="16"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 512 512"
                >
                  <g>
                    <path d="m0 0H512V512H0" fill="#fff"></path>
                    <path
                      fill="#34a853"
                      d="M153 292c30 82 118 95 171 60h62v48A192 192 0 0190 341"
                    ></path>
                    <path
                      fill="#4285f4"
                      d="m386 400a140 175 0 0053-179H260v74h102q-7 37-38 57"
                    ></path>
                    <path
                      fill="#fbbc02"
                      d="m90 341a208 200 0 010-171l63 49q-12 37 0 73"
                    ></path>
                    <path
                      fill="#ea4335"
                      d="m153 219c22-69 116-109 179-50l55-54c-78-75-230-72-297 55"
                    ></path>
                  </g>
                </svg>
                Login with Google
              </button>{" "}
            </div>
            <p className="text-center text-gray-500 text-sm mt-6">
              Already have an account?{" "}
              <Link
                to={"/login"}
                className=" font-semibold hover:text-teal-600"
              >
                Login
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
