import { useState } from "react";
import { Link } from "react-router-dom";
import { forgotPassword } from "../services/authServices";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const normalizedEmail = email.trim().toLowerCase();
    if (!normalizedEmail || !/^\S+@\S+\.\S+$/.test(normalizedEmail)) {
      setError("Enter a valid email address.");
      return;
    }

    setSubmitting(true);
    setError("");
    try {
      await forgotPassword(normalizedEmail);
      setSuccess(true);
    } catch (requestError) {
      const apiErrors = requestError.response?.data?.errors;
      setError(
        requestError.response?.data?.message ||
          apiErrors?.[0]?.message ||
          "Unable to process your request right now.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-950 px-4 py-12 sm:px-6">
      <main className="w-full max-w-md">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-extrabold tracking-tight text-white">
            Reset your password
          </h1>
          <p className="mt-2 text-sm text-gray-400">
            Enter your email and we will send you a secure reset link.
          </p>
        </div>

        <section className="rounded-2xl border border-gray-800 bg-gray-900 p-6 shadow-xl shadow-black/40 sm:p-8">
          {success ? (
            <div role="status">
              <p className="text-sm leading-6 text-emerald-400">
                If an account exists for this email, you will receive a password
                reset link.
              </p>
              <Link
                to="/"
                className="mt-6 inline-flex w-full items-center justify-center rounded-lg bg-indigo-600 py-2.5 font-semibold text-white transition hover:bg-indigo-500 cursor-pointer"
              >
                Back to Login
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5" noValidate>
              <label className="block text-sm font-medium text-gray-300">
                Email
                <input
                  name="email"
                  type="email"
                  value={email}
                  onChange={(event) => {
                    setEmail(event.target.value);
                    setError("");
                  }}
                  autoComplete="email"
                  maxLength={254}
                  placeholder="you@example.com"
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
                className="w-full rounded-lg bg-indigo-600 py-2.5 font-semibold text-white transition hover:bg-indigo-500 active:bg-indigo-700 cursor-pointer disabled:cursor-not-allowed disabled:opacity-60"
              >
                {submitting ? "Sending..." : "Send reset link"}
              </button>
            </form>
          )}
          {!success && (
            <Link
              to="/"
              className="mt-6 block text-center text-sm font-medium text-indigo-400 transition hover:text-indigo-300 cursor-pointer"
            >
              Back to Login
            </Link>
          )}
        </section>
      </main>
    </div>
  );
}

export default ForgotPassword;
