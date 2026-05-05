import React, { useState } from "react";

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-white">

      {/* MOBILE TOP VISUAL */}
      <div
        className="lg:hidden w-full h-48 flex items-center justify-center text-white relative"
        style={{
          background: "linear-gradient(to bottom, #08123b, #8582dd)"
        }}
      >
        <div className="absolute inset-0 bg-black/30" />
        <img
          src="/auth-visual.png"
          alt="Zune"
          className="absolute inset-0 w-full h-full object-cover opacity-30"
        />
        <h1 className="relative z-10 text-2xl font-semibold tracking-tight">
          Zune
        </h1>
      </div>

      {/* LEFT SECTION */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-5 py-8 lg:py-12">
        
        <div className="w-full max-w-md bg-white rounded-2xl shadow-md p-6 sm:p-8">

          {/* Logo (desktop only) */}
          <h1 className="hidden lg:block text-3xl font-bold text-[#08123b] mb-2">
            Zune
          </h1>

          <p className="text-gray-500 mb-6 text-sm sm:text-base">
            {isLogin ? "Login to your account" : "Create your account"}
          </p>

          {/* Tabs */}
          <div className="flex mb-6 bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setIsLogin(true)}
              className={`w-1/2 py-2 text-sm font-medium rounded-md transition ${
                isLogin
                  ? "bg-white text-blue-600 shadow"
                  : "text-gray-400"
              }`}
            >
              Login
            </button>
            <button
              onClick={() => setIsLogin(false)}
              className={`w-1/2 py-2 text-sm font-medium rounded-md transition ${
                !isLogin
                  ? "bg-white text-blue-600 shadow"
                  : "text-gray-400"
              }`}
            >
              Register
            </button>
          </div>

          {/* FORM */}
          <form className="space-y-4">

            {!isLogin && (
              <input
                type="text"
                placeholder="Full Name"
                className="w-full px-4 py-3 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              />
            )}

            <input
              type="text"
              placeholder="Username"
              className="w-full px-4 py-3 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            />

            <input
              type="password"
              placeholder="Password"
              className="w-full px-4 py-3 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            />

            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-3 rounded-lg border border-blue-600 hover:bg-white hover:text-blue-600 transition font-medium"
            >
              {isLogin ? "Login" : "Register"}
            </button>
          </form>

          {/* Footer */}
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

      {/* RIGHT SECTION (DESKTOP ONLY) */}
      <div
        className="hidden lg:flex w-1/2 items-center justify-center relative text-white overflow-hidden"
        style={{
          background: "linear-gradient(to bottom, #08123b, #8582dd, #ffffff)"
        }}
      >
        <div className="absolute inset-0 bg-[#08123b]/60" />

        <img
          src="/auth-visual.png"
          alt="Zune Preview"
          className="absolute inset-0 w-full h-full object-cover opacity-40"
        />

        <div className="relative z-10 max-w-md text-center px-6">
          <h2 className="text-3xl font-semibold mb-4 leading-snug">
            Communication built for modern teams
          </h2>
          <p className="text-gray-200 text-sm leading-relaxed">
            Experience seamless video conferencing, instant messaging, and screen sharing with a platform designed for speed and reliability.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Auth;