import React, { useState, useEffect } from "react";
import axios from "axios";
import server from "../environment";

const Auth = () => {
  useEffect(() => {
  const checkAuth = async () => {
    const token = localStorage.getItem("token");

    if (!token) return;

    try {
      const res = await axios.get(`${server}verifyToken`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.data.valid) {
        window.location.href = "http://https://main.d2fyugyyaiab9s.amplifyapp.com//videoMeet";
      }
    } catch (err) {
      console.log("Invalid token");
      localStorage.removeItem("token");
    }
  };

  checkAuth();
}, []);

  const [isLogin, setIsLogin] = useState(true);

  const [form, setForm] = useState({
    name: "",
    username: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setMessage("");

    if (!form.username || !form.password || (!isLogin && !form.name)) {
      setError("All fields are required");
      return;
    }

    try {
      setLoading(true);

      const url = isLogin
        ? `${server}login`
        : `${server}register`;

      const payload = isLogin
        ? {
            username: form.username,
            password: form.password,
          }
        : {
            name: form.name,
            username: form.username,
            password: form.password,
          };

      const res = await axios.post(url, payload);

      if (isLogin) {
        localStorage.setItem("token", res.data.token);
        setMessage("Login successful");

        setTimeout(() => {
          window.location.href = "/videoMeet";
        }, 1000);
      } else {
        setMessage("Account created successfully");
        setIsLogin(true);
      }
    } catch (err) {
      setError(err?.response?.data?.msg || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">

      {/* MOBILE TOP IMAGE */}
      <div className="lg:hidden relative h-56 w-full">
        <img
          src="/auth-visual.png"
          alt="Zune"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#08123b]/80 to-[#8582dd]/60" />
        <h1 className="absolute bottom-4 left-5 text-white text-2xl font-semibold">
          Zune
        </h1>
      </div>

      {/* LEFT SECTION */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-5 py-8 bg-white">
        <div className="w-full max-w-md bg-white shadow-lg rounded-2xl p-6">

          <h1 className="hidden lg:block text-3xl font-bold text-[#08123b] mb-2">
            Zune
          </h1>

          <p className="text-gray-500 mb-6">
            {isLogin ? "Login to your account" : "Create your account"}
          </p>

          {/* Tabs */}
          <div className="flex mb-6 bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setIsLogin(true)}
              className={`w-1/2 py-2 text-sm font-medium rounded-md ${
                isLogin ? "bg-white text-blue-600 shadow" : "text-gray-400"
              }`}
            >
              Login
            </button>
            <button
              onClick={() => setIsLogin(false)}
              className={`w-1/2 py-2 text-sm font-medium rounded-md ${
                !isLogin ? "bg-white text-blue-600 shadow" : "text-gray-400"
              }`}
            >
              Register
            </button>
          </div>

          {/* FORM */}
          <form onSubmit={handleSubmit} className="space-y-4">

            {!isLogin && (
              <input
                type="text"
                name="name"
                placeholder="Full Name"
                value={form.name}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            )}

            <input
              type="text"
              name="username"
              placeholder="Username"
              value={form.username}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500"
            />

            <input
              type="password"
              name="password"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500"
            />

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-3 rounded-lg border border-blue-600 hover:bg-white hover:text-blue-600 transition"
            >
              {loading ? "Please wait..." : isLogin ? "Login" : "Register"}
            </button>
          </form>

          {(error || message) && (
            <div
              className={`mt-4 text-sm text-center px-4 py-2 rounded-md ${
                error
                  ? "bg-red-100 text-red-600"
                  : "bg-green-100 text-green-600"
              }`}
            >
              {error || message}
            </div>
          )}

          <p className="text-sm text-gray-500 mt-6 text-center">
            {isLogin ? "Don't have an account?" : "Already have an account?"}
            <span
              className="text-blue-600 cursor-pointer ml-1 font-medium"
              onClick={() => setIsLogin(!isLogin)}
            >
              {isLogin ? "Sign up" : "Login"}
            </span>
          </p>
        </div>
      </div>

      {/* RIGHT SECTION (FULL WIDTH IMAGE FIXED) */}
      <div className="hidden lg:block w-1/2 relative">

        {/* IMAGE */}
        <img
          src="/auth-visual.png"
          alt="Zune"
          className="w-full h-full object-cover"
        />

        {/* OVERLAY */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#08123b]/80 to-[#8582dd]/70" />

        {/* TEXT */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-10">
          <h2 className="text-3xl font-semibold text-white mb-4">
            Communication built for modern teams
          </h2>
          <p className="text-gray-200 text-sm max-w-md">
            Experience seamless video conferencing, messaging, and screen sharing in one unified platform.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Auth;