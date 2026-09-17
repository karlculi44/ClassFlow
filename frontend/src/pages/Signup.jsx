import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { register } from "../services/authServices";
import LoadingSpinner from "../components/ui/LoadingSpinner";
import { ArrowRight, Check, LockKeyhole, Mail, UserRound } from "lucide-react";

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
    <div className="relative flex min-h-screen overflow-hidden bg-gray-950 text-gray-100">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_88%_8%,rgba(79,70,229,0.16),transparent_30%),radial-gradient(circle_at_10%_88%,rgba(8,145,178,0.1),transparent_28%)]" />
      <div className="pointer-events-none absolute inset-0 opacity-30 [background-image:linear-gradient(rgba(148,163,184,0.06)_1px,transparent_1px),linear-gradient(90deg,rgba(148,163,184,0.06)_1px,transparent_1px)] [background-size:44px_44px] [mask-image:linear-gradient(to_bottom,black,transparent_85%)]" />

      <main className="relative flex min-w-0 flex-1 items-center justify-center px-5 py-8 sm:px-8 sm:py-12 lg:order-2 lg:w-[58%]">
        <div className="w-full max-w-md">
          <div className="mb-8 flex items-center gap-3 lg:hidden">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-500 text-xs font-extrabold text-white">
              CF
            </div>
            <span className="font-heading text-lg font-bold text-white">
              ClassFlow
            </span>
          </div>
          <div className="mb-7">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-indigo-300">
              Build your workspace
            </p>
            <h1 className="mt-3 font-heading text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Create your ClassFlow account
            </h1>
            <p className="mt-3 text-sm leading-6 text-gray-400">
              A focused home for your classes, assignments, and progress.
            </p>
          </div>

          <div className="rounded-2xl border border-gray-800/90 bg-gray-900/85 p-5 shadow-2xl shadow-black/30 backdrop-blur sm:p-7">
            <form onSubmit={handleSubmit} className="space-y-4" noValidate>
              <label className="block text-sm font-semibold text-gray-300">
                Full name
                <span className="relative mt-2 block">
                  <UserRound
                    size={17}
                    className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500"
                  />
                  <input
                    name="name"
                    type="text"
                    value={formData.name}
                    onChange={handleChange}
                    autoComplete="name"
                    maxLength={100}
                    placeholder="Your full name"
                    className="h-12 w-full rounded-xl border border-gray-700 bg-gray-950/60 pl-11 pr-4 text-sm text-gray-100 outline-none placeholder:text-gray-600 transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400/20"
                  />
                </span>
              </label>
              <label className="block text-sm font-semibold text-gray-300">
                Email
                <span className="relative mt-2 block">
                  <Mail
                    size={17}
                    className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500"
                  />
                  <input
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    autoComplete="email"
                    maxLength={254}
                    placeholder="you@example.com"
                    className="h-12 w-full rounded-xl border border-gray-700 bg-gray-950/60 pl-11 pr-4 text-sm text-gray-100 outline-none placeholder:text-gray-600 transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400/20"
                  />
                </span>
              </label>
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block text-sm font-semibold text-gray-300">
                  Password
                  <span className="relative mt-2 block">
                    <LockKeyhole
                      size={17}
                      className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500"
                    />
                    <input
                      name="password"
                      type="password"
                      value={formData.password}
                      onChange={handleChange}
                      autoComplete="new-password"
                      maxLength={128}
                      placeholder="At least 6 characters"
                      className="h-12 w-full rounded-xl border border-gray-700 bg-gray-950/60 pl-11 pr-3 text-sm text-gray-100 outline-none placeholder:text-gray-600 transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400/20"
                    />
                  </span>
                </label>
                <label className="block text-sm font-semibold text-gray-300">
                  Confirm password
                  <span className="relative mt-2 block">
                    <LockKeyhole
                      size={17}
                      className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500"
                    />
                    <input
                      name="confirmPassword"
                      type="password"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      autoComplete="new-password"
                      maxLength={128}
                      placeholder="Re-enter password"
                      className="h-12 w-full rounded-xl border border-gray-700 bg-gray-950/60 pl-11 pr-3 text-sm text-gray-100 outline-none placeholder:text-gray-600 transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400/20"
                    />
                  </span>
                </label>
              </div>
              {error && (
                <p
                  className="rounded-lg border border-red-400/20 bg-red-400/10 px-3 py-2.5 text-sm text-red-300"
                  role="alert"
                >
                  {error}
                </p>
              )}
              <button
                type="submit"
                disabled={submitting}
                className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-indigo-500 text-sm font-bold text-white shadow-lg shadow-indigo-950/30 transition hover:bg-indigo-400 active:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:ring-offset-2 focus:ring-offset-gray-900 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {submitting ? (
                  <LoadingSpinner label="Creating account" />
                ) : (
                  <>
                    Create account <ArrowRight size={17} />
                  </>
                )}
              </button>
            </form>
            <p className="mt-7 text-center text-sm text-gray-400">
              Already have an account?{" "}
              <Link
                to="/"
                className="font-semibold text-indigo-300 transition hover:text-indigo-200"
              >
                Sign in
              </Link>
            </p>
          </div>
          <p className="mt-6 text-center text-xs text-gray-600">
            Set up once. Stay in sync.
          </p>
        </div>
      </main>

      <aside className="relative hidden w-[42%] max-w-xl flex-col justify-between border-l border-gray-800/80 bg-gray-900/25 px-10 py-10 lg:order-1 lg:flex xl:px-16">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500 text-sm font-extrabold text-white shadow-lg shadow-indigo-950/40">
            CF
          </div>
          <span className="font-heading text-lg font-bold tracking-tight text-white">
            ClassFlow
          </span>
        </div>
        <div className="relative max-w-md pb-8">
          <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-indigo-300/20 bg-indigo-300/10 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.16em] text-indigo-200">
            <span className="h-1.5 w-1.5 rounded-full bg-indigo-300" />
            Start with clarity
          </div>
          <h2 className="font-heading text-5xl font-extrabold leading-[1.05] tracking-tight text-white xl:text-6xl">
            A better rhythm for <span className="text-cyan-300">learning.</span>
          </h2>
          <p className="mt-6 max-w-sm text-base leading-7 text-gray-400">
            Create one place for the work that matters and make each school day
            easier to navigate.
          </p>
          <ul className="mt-10 space-y-4">
            {[
              "Create your student profile",
              "Access enrolled classes",
              "Stay on top of assignments",
            ].map((feature) => (
              <li
                key={feature}
                className="flex items-center gap-3 text-sm text-gray-300"
              >
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-cyan-300/25 bg-cyan-300/10 text-cyan-200">
                  <Check size={13} strokeWidth={2.5} />
                </span>
                {feature}
              </li>
            ))}
          </ul>
        </div>
        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-gray-600">
          Your next chapter starts here
        </p>
      </aside>
    </div>
  );
}

export default Signup;
