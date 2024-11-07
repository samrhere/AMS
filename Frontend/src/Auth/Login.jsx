import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { loginFailure, loginStart, loginSuccess } from "../store/userSlice";
import { toast } from "react-toastify";

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isWrongCredential, setIsWrongCredential] = useState(false);

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    setError("");

    // Form validation
    if (!validateEmail(email)) {
      setError("Please enter a valid email address.");
      return;
    }
    if (password.length < 8) {
      setError("Password must be at least 8 characters long.");
      return;
    }

    try {
      dispatch(loginStart());
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const data = await res.json();
      

      if (data.success === false) {
        setIsWrongCredential(true);
        setError("Invalid email or password");
        dispatch(loginFailure(data.message));
        return;
      }

      setIsWrongCredential(false);
      toast.success("Logged In!");
      dispatch(loginSuccess(data));
      if(data.role === "student")
      navigate("/student-dashboard");
      else
      navigate("/admin-dashboard")
    } catch (error) {
      toast.error("Login failed. Please try again.");
      dispatch(loginFailure(error.message));
      setError("An error occurred. Please try again.");
    }
  };

  return (
    <>
      <nav className="bg-blue-600 text-white shadow p-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold">Attendance Management System</h1>
        <div className="relative">
          <button
            onClick={() => navigate("/register")}
            className="text-sm border border-white py-2 px-4 rounded-lg hover:bg-blue-500"
          >
            Sign Up
          </button>
        </div>
      </nav>
      <div className="h-full flex items-center justify-center">
        <div className="p-6 w-[400px] md:w-[500px]">
          <h3 className="text-2xl mb-10 font-bold text-center mt-10">
            Login to your account
          </h3>
          <form onSubmit={submitHandler}>
            <div className="flex flex-col">
              <label className="text-left font-normal" htmlFor="email">
                Email Address
              </label>
              <input
                name="email"
                className="border focus:border-2 focus:border-blue-600 outline-none py-2 px-3 mt-2 rounded-lg"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="flex flex-col mt-4">
              <label className="font-sm" htmlFor="password">
                Password
              </label>
              <input
                name="password"
                className="border focus:border-2 focus:border-blue-600 outline-none py-2 px-3 mt-2 rounded-lg"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            {error && <h3 className="text-red-600 mt-4">{error}</h3>}
            <button
              type="submit"
              className="bg-blue-600 mt-6 py-2 text-white rounded-lg font-medium w-full mb-3"
            >
              Login
            </button>
          </form>
          <p className="text-lg font-semibold mt-2">
            Do not have an account?{" "}
            <Link to="/register" className="font-normal text-blue-600">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </>
  );
};

export default Login;
