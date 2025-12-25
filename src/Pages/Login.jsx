import React, { useContext, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router";
import toast from "react-hot-toast";
import { FaEye } from "react-icons/fa";
import { IoEyeOff } from "react-icons/io5";
import { AuthContext } from "../provider/authContext";
const Login = () => {
  const [show, setShow] = useState(false);
  const [email, setEmail] = useState("");
  const { signIn, signInWithGoogle, setUser, setLoading } =
    useContext(AuthContext);
  const location = useLocation();
  const from = location.state || "/";
  const navigate = useNavigate();
  const handleSignin = (e) => {
    e.preventDefault();

    const email = e.target.email.value;
    const password = e.target.password.value;
    console.log(email, password);
    signIn(email, password)
      .then((res) => {
        setLoading(false);
        console.log(res);
        setUser(res.user);
        navigate(from);
        toast.success("Login successful");
        e.target.reset();
      })
      .catch((err) => {
        console.log(err);
        toast.error(err.message);
      });
  };
  const handleGoogleSignin = () => {
    setLoading(true);
    signInWithGoogle()
      .then((res) => {
        console.log(res);
        setUser(res.user);
        toast.success("Google signin successful");
        setLoading(false);
        navigate(from);
      })
      .catch((err) => {
        console.log(err);
        toast.error(err.message);
      });
  };

  return (
    <div>
      <div
        className="min-h-screen bg-white px-4 flex justify-center items-center   
 animate-gradient"
      >
        <div className="w-[450px] p-6 rounded-2xl shadow-2xl  ">
          <div className="text-center mb-3">
            <h1 className="text-2xl font-bold mt-2 ">Login</h1>
          </div>

          <form onSubmit={handleSignin}>
            <div className="mb-3 ">
              <label className="  text-sm  font-semibold">Email</label>
              <input
                type="text"
                name="email"
                onChange={(e) => setEmail(e.target.value)}
                placeholder="example@gmail.com"
                required
                className="w-full px-5 py-3 rounded-xl border border-gray-100 shadow-md  focus:outline-none "
              />
            </div>

            <div className="relative mb-3">
              <label className="  text-sm font-semibold">Password</label>
              <input
                type={show ? "text" : "password"}
                name="password"
                placeholder="••••••••"
                required
                className="w-full px-5 py-3 rounded-xl border border-gray-100  shadow-md  focus:outline-none"
              />
              <span
                onClick={() => setShow(!show)}
                className="absolute right-4 top-10 cursor-pointer "
              >
                {show ? <FaEye /> : <IoEyeOff />}
              </span>
            </div>

            <div className="flex justify-between items-center font-semibold text-sm mb-6">
              <Link
                state={email}
                to={""}
                className=" hover:text-secondary"
              >
                Forgot password?
              </Link>
            </div>

            <button
              type="submit"
              className="w-full py-3   bg-secondary  font-semibold rounded-full text-white  hover:bg-secondary/80  shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 "
            >
              Login
            </button>

            <div className="flex items-center my-5 text-gray-400 text-sm">
              <div className="flex-1 h-px bg-gray-300"></div>
              <span className="mx-3">or continue with</span>
              <div className="flex-1 h-px bg-gray-300"></div>
            </div>

            <div className="flex justify-center gap-4">
              <button
                onClick={handleGoogleSignin}
                className="btn    w-full h-12 shadow-lg hover:shadow-xl   hover:scale-105 hover:bg-secondary/80  bg-secondary text-white rounded-full transition-all duration-300 "
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

            <p className="text-center  text-sm mt-6">
              Don't have an account?{" "}
              <Link
                to={"/register"}
                className=" font-semibold hover:text-secondary"
              >
                Register
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
