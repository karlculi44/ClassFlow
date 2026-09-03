import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { register } from "../services/authServices";

const initialForm = { name: "", email: "", password: "", confirmPassword: "" };

function Signup() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState(initialForm);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((current) => ({ ...current, [name]: value }));
    setError("");
  };

  const validateForm = () => {
    const name = formData.name.trim();
    const email = formData.email.trim().toLowerCase();

    if (!name) return "Full name is required.";
    if (name.length < 3) return "Full name must be at least 3 characters.";
    if (name.length > 100) return "Full name must be 100 characters or fewer.";
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return "Enter a valid email address.";
    }
    if (formData.password.length < 6) {
      return "Password must be at least 6 characters long.";
    }
    if (formData.password.length > 128) {
      return "Password must be 128 characters or fewer.";
    }
    if (formData.password !== formData.confirmPassword) {
      return "Passwords do not match.";
    }
    return "";
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    setSubmitting(true);
    setError("");
    try {
      await register({
        name: formData.name.trim(),
        email: formData.email.trim().toLowerCase(),
        password: formData.password,
      });
      navigate("/", { state: { message: "Account created. Please sign in." } });
    } catch (requestError) {
      const apiErrors = requestError.response?.data?.errors;
      setError(
        requestError.response?.data?.message ||
          apiErrors?.[0]?.message ||
          "Unable to create your account right now.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gray-950">
      <div className="relative flex flex-1 items-center justify-center overflow-hidden px-4 py-12 sm:px-6 md:order-1 md:w-1/2">
        <div className="absolute top-8 left-6 h-10 w-10 rotate-12 rounded-2xl border border-gray-800 sm:h-12 sm:w-12 md:top-16 md:left-16 md:h-14 md:w-14" />
        <div className="absolute bottom-10 right-6 h-7 w-7 rounded-full border border-gray-800 sm:h-8 sm:w-8 md:bottom-20 md:right-12 md:h-9 md:w-9" />
        <div className="absolute top-1/4 left-10 h-4 w-4 rotate-45 bg-indigo-500/10 sm:left-14 md:top-1/3 md:left-20 md:h-5 md:w-5" />
        <div className="absolute bottom-1/3 right-8 h-1.5 w-1.5 rounded-full bg-indigo-500/40 sm:right-12 md:bottom-1/4 md:right-16 md:h-2 md:w-2" />

        <div className="w-full max-w-md">
          <div className="mb-8 text-center md:hidden">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-linear-to-br from-indigo-500 to-purple-600 shadow-lg shadow-indigo-950/50">
              <span className="text-xl font-bold text-white">CF</span>
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight text-white">
              Join{" "}
              <span className="bg-linear-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                ClassFlow
              </span>
            </h1>
          </div>

          <div className="mb-8 hidden md:block">
            <h2 className="text-2xl font-bold text-white">
              Create your account
            </h2>
            <p className="mt-2 text-sm text-gray-400">
              Set up your student account to get started
            </p>
          </div>

          <div className="rounded-2xl border border-gray-800 bg-gray-900 p-6 shadow-xl shadow-black/40 sm:p-8">
            <form onSubmit={handleSubmit} className="space-y-5" noValidate>
              <label className="block text-sm font-medium text-gray-300">
                Full name
                <input
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleChange}
                  autoComplete="name"
                  maxLength={100}
                  placeholder="Your full name"
                  className="mt-1.5 w-full rounded-lg border border-gray-700 bg-gray-800 px-4 py-2.5 text-gray-100 outline-none placeholder:text-gray-500 transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500"
                />
              </label>
              <label className="block text-sm font-medium text-gray-300">
                Email
                <input
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  autoComplete="email"
                  maxLength={254}
                  placeholder="you@example.com"
                  className="mt-1.5 w-full rounded-lg border border-gray-700 bg-gray-800 px-4 py-2.5 text-gray-100 outline-none placeholder:text-gray-500 transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500"
                />
              </label>
              <label className="block text-sm font-medium text-gray-300">
                Password
                <input
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  autoComplete="new-password"
                  maxLength={128}
                  placeholder="At least 6 characters"
                  className="mt-1.5 w-full rounded-lg border border-gray-700 bg-gray-800 px-4 py-2.5 text-gray-100 outline-none placeholder:text-gray-500 transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500"
                />
              </label>
              <label className="block text-sm font-medium text-gray-300">
                Confirm password
                <input
                  name="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  autoComplete="new-password"
                  maxLength={128}
                  placeholder="Re-enter your password"
                  className="mt-1.5 w-full rounded-lg border border-gray-700 bg-gray-800 px-4 py-2.5 text-gray-100 outline-none placeholder:text-gray-500 transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500"
                />
              </label>
              {error && (
                <p className="text-sm text-red-400" role="alert">
                  {error}
                </p>
              )}
              <button
                type="submit"
                disabled={submitting}
                className="w-full rounded-lg bg-indigo-600 py-2.5 font-semibold text-white transition hover:bg-indigo-500 active:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {submitting ? "Creating account..." : "Create account"}
              </button>
            </form>
            <p className="mt-6 text-center text-sm text-gray-400">
              Already have an account?{" "}
              <Link
                to="/"
                className="font-medium text-indigo-400 transition hover:text-indigo-300"
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>

      <div className="relative hidden flex-col items-center justify-center overflow-hidden bg-linear-to-br from-indigo-600 via-indigo-800 to-purple-900 px-10 py-12 md:order-2 md:flex md:w-1/2">
        <div className="absolute -top-24 -right-24 h-72 w-72 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-purple-400/20 blur-3xl" />
        <div className="absolute top-12 left-12 h-16 w-16 rotate-12 rounded-2xl border border-white/20" />
        <div className="absolute bottom-16 right-10 h-10 w-10 rounded-full border border-white/20" />
        <div className="absolute top-1/3 right-16 h-6 w-6 rotate-45 bg-white/10" />
        <div className="absolute bottom-1/4 left-16 h-8 w-8 rotate-45 border-2 border-purple-200/20" />
        <div className="relative max-w-sm text-center">
          <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-xl border border-white/20 bg-white/10 backdrop-blur-sm">
            <span className="text-2xl font-bold text-white">CF</span>
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight text-white">
            Welcome to ClassFlow
          </h1>
          <p className="mt-3 text-indigo-100/80">
            Everything you need to stay organized, keep learning, and make
            progress.
          </p>
          <ul className="mt-8 space-y-3 text-left">
            {[
              "Keep track of your classes",
              "Stay on top of assignments",
              "Follow your academic progress",
              "Connect with your instructors",
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
    </div>
  );
}

export default Signup;
