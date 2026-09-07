import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { resetPassword } from "../services/authServices";

function ResetPassword() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token") || "";
  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState(
    token ? "" : "This password reset link is missing its token.",
  );
  const [success, setSuccess] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!token) {
      setError("This password reset link is missing its token.");
      return;
    }
    if (formData.password.length < 6 || formData.password.length > 128) {
      setError("Password must be between 6 and 128 characters long.");
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setSubmitting(true);
    setError("");
    try {
      await resetPassword(token, formData.password, formData.confirmPassword);
      setSuccess(true);
    } catch (requestError) {
      const apiErrors = requestError.response?.data?.errors;
      setError(
        requestError.response?.data?.message ||
          apiErrors?.[0]?.message ||
          "This password reset link is invalid or has expired.",
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
            Choose a new password
          </h1>
          <p className="mt-2 text-sm text-gray-400">
            Create a new password for your ClassFlow account.
          </p>
        </div>

        <section className="rounded-2xl border border-gray-800 bg-gray-900 p-6 shadow-xl shadow-black/40 sm:p-8">
          {success ? (
            <div role="status">
              <p className="text-sm leading-6 text-emerald-400">
                Your password has been reset successfully.
              </p>
              <Link
                to="/"
                className="mt-6 inline-flex w-full items-center justify-center rounded-lg bg-indigo-600 py-2.5 font-semibold text-white transition hover:bg-indigo-500 cursor-pointer"
              >
                Return to Login
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5" noValidate>
              <label className="block text-sm font-medium text-gray-300">
                New password
                <input
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={(event) => {
                    setFormData((current) => ({
                      ...current,
                      password: event.target.value,
                    }));
                    setError("");
                  }}
                  autoComplete="new-password"
                  maxLength={128}
                  placeholder="At least 6 characters"
                  className="mt-1.5 w-full rounded-lg border border-gray-700 bg-gray-800 px-4 py-2.5 text-gray-100 outline-none placeholder:text-gray-500 transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500"
                />
              </label>
              <label className="block text-sm font-medium text-gray-300">
                Confirm new password
                <input
                  name="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={(event) => {
                    setFormData((current) => ({
                      ...current,
                      confirmPassword: event.target.value,
                    }));
                    setError("");
                  }}
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
                disabled={submitting || !token}
                className="w-full rounded-lg bg-indigo-600 py-2.5 font-semibold text-white transition hover:bg-indigo-500 active:bg-indigo-700 cursor-pointer disabled:cursor-not-allowed disabled:opacity-60"
              >
                {submitting ? "Resetting..." : "Reset password"}
              </button>
            </form>
          )}
          {!success && (
            <div className="mt-6 flex justify-center gap-4 text-sm">
              <Link
                to="/forgot-password"
                className="font-medium text-indigo-400 transition hover:text-indigo-300 cursor-pointer"
              >
                Forgot password
              </Link>
              <Link
                to="/"
                className="font-medium text-gray-400 transition hover:text-white cursor-pointer"
              >
                Back to Login
              </Link>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

export default ResetPassword;
