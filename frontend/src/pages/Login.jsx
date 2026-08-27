import { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext.jsx";
import { useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate();
  const { login, user } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    console.log(user);
    e.preventDefault();
    try {
      await login(formData);
      navigate(user.role === "Admin" ? "/admin" : "/dashboard");
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gray-950">
      {/* Branding panel */}
      <div className="relative hidden md:flex md:w-1/2 flex-col justify-center items-center bg-linear-to-br from-indigo-600 via-indigo-800 to-purple-900 px-10 py-12 overflow-hidden">
        <div className="absolute -top-24 -left-24 h-72 w-72 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute -bottom-24 -right-24 h-72 w-72 rounded-full bg-purple-400/20 blur-3xl" />

        {/* Decorative geometric shapes */}
        <div className="absolute top-12 right-12 h-16 w-16 rounded-2xl border border-white/20 rotate-12" />
        <div className="absolute bottom-16 left-10 h-10 w-10 rounded-full border border-white/20" />
        <div className="absolute top-1/3 left-16 h-6 w-6 bg-white/10 rotate-45" />
        <div className="absolute bottom-1/4 right-16 h-8 w-8 border-2 border-purple-200/20 rotate-45" />
        <div className="absolute top-20 left-1/3 h-3 w-3 rounded-full bg-white/30" />
        <div className="absolute bottom-1/3 right-1/4 h-2 w-2 rounded-full bg-white/40" />
        <div className="relative text-center max-w-sm">
          <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-xl bg-white/10 backdrop-blur-sm border border-white/20">
            <span className="text-2xl font-bold text-white">CF</span>
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight text-white">
            Welcome to ClassFlow
          </h1>
          <p className="mt-3 text-indigo-100/80">
            Manage your classes, schedules, and students all in one place.
          </p>

          <ul className="mt-8 space-y-3 text-left">
            {[
              "Real-time class scheduling",
              "Student progress tracking",
              "Seamless attendance management",
              "Secure, role-based access",
            ].map((feature) => (
              <li key={feature} className="flex items-center gap-3">
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-white/15">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    className="h-3 w-3 text-white"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.704 5.29a1 1 0 010 1.415l-7.5 7.5a1 1 0 01-1.415 0l-3.5-3.5a1 1 0 111.415-1.414L8.5 12.086l6.79-6.796a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </span>
                <span className="text-sm text-indigo-50/90">{feature}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Form panel */}
      <div className="relative flex flex-1 items-center justify-center px-4 py-12 sm:px-6 md:w-1/2 overflow-hidden">
        {/* Decorative geometric shapes */}
        <div className="absolute top-8 right-6 h-10 w-10 sm:h-12 sm:w-12 md:top-16 md:right-16 md:h-14 md:w-14 rounded-2xl border border-gray-800 rotate-12" />
        <div className="absolute bottom-10 left-6 h-7 w-7 sm:h-8 sm:w-8 md:bottom-20 md:left-12 md:h-9 md:w-9 rounded-full border border-gray-800" />
        <div className="absolute top-1/4 right-10 sm:right-14 md:top-1/3 md:right-20 h-4 w-4 md:h-5 md:w-5 bg-indigo-500/10 rotate-45" />
        <div className="absolute bottom-1/3 left-8 sm:left-12 md:bottom-1/4 md:left-16 h-1.5 w-1.5 md:h-2 md:w-2 rounded-full bg-indigo-500/40" />

        <div className="w-full max-w-md">
          <div className="text-center mb-8 md:hidden">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-linear-to-br from-indigo-500 to-purple-600 shadow-lg shadow-indigo-950/50">
              <span className="text-xl font-bold text-white">CF</span>
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight text-white">
              Welcome to{" "}
              <span className="bg-linear-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                ClassFlow
              </span>
            </h1>
          </div>

          <div className="hidden md:block mb-8">
            <h2 className="text-2xl font-bold text-white">Sign in</h2>
            <p className="mt-2 text-sm text-gray-400">
              Enter your credentials to access your dashboard
            </p>
          </div>

          <div className="bg-gray-900 border border-gray-800 rounded-2xl shadow-xl shadow-black/40 p-6 sm:p-8">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-300 mb-1.5"
                >
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  value={formData.email}
                  name="email"
                  onChange={handleChange}
                  placeholder="you@example.com"
                  required
                  className="w-full rounded-lg bg-gray-800 border border-gray-700 text-gray-100 placeholder-gray-500 px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium text-gray-300"
                  >
                    Password
                  </label>
                </div>
                <input
                  id="password"
                  type="password"
                  value={formData.password}
                  name="password"
                  onChange={handleChange}
                  placeholder="••••••••"
                  required
                  className="w-full rounded-lg bg-gray-800 border border-gray-700 text-gray-100 placeholder-gray-500 px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                />
              </div>

              <button
                type="submit"
                className="w-full rounded-lg bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 text-white font-semibold py-2.5 transition"
              >
                Sign In
              </button>
              <a
                href="#"
                className="text-xs text-indigo-400 hover:text-indigo-300 transition"
              >
                Forgot password?
              </a>
            </form>

            <div className="mt-6 text-center text-sm text-gray-400">
              Don&apos;t have an account?{" "}
              <a
                href="#"
                className="text-indigo-400 hover:text-indigo-300 font-medium transition"
              >
                Sign up
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
