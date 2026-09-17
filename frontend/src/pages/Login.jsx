import { useState, useContext, useEffect, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { useTheme } from "../context/useTheme";
import LoadingSpinner from "../components/ui/LoadingSpinner";
import { ArrowRight, Check, LockKeyhole, Mail } from "lucide-react";

function Login() {
  const navigate = useNavigate();
  const { login, googleLogin } = useContext(AuthContext);
  const { theme } = useTheme();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const handleGoogleLogin = useCallback(
    async (response) => {
      try {
        setError("");

        const user = await googleLogin(response.credential);

        navigate(user.role === "Admin" ? "/admin" : "/dashboard");
      } catch (error) {
        console.error("Google login failed:", error);
        setError("Google login failed. Please try again.");
      }
    },
    [googleLogin, navigate],
  );
  const handleChange = (e) => {
    const { name, value } = e.target;
    setError("");
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (submitting) {
      return;
    }

    setSubmitting(true);
    setError("");
    try {
      const user = await login(formData);
      navigate(user.role === "Admin" ? "/admin" : "/dashboard");
    } catch (error) {
      console.error("Login failed:", error);
      setError(
        error.response?.status === 429
          ? error.response.data.message
          : "Invalid credentials. Please check your email and password.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  useEffect(() => {
    if (!window.google) {
      console.error("Google Identity Services script has not loaded.");
      return;
    }

    window.google.accounts.id.initialize({
      client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
      callback: handleGoogleLogin,
    });

    const buttonContainer = document.getElementById("google-signin-button");
    if (!buttonContainer) {
      return;
    }

    buttonContainer.replaceChildren();
    window.google.accounts.id.renderButton(buttonContainer, {
      theme: theme === "dark" ? "filled_black" : "outline",
      size: "large",
      width: 350,
      text: "continue_with",
    });
  }, [handleGoogleLogin, theme]);

  return (
    <div className="relative flex min-h-screen overflow-hidden bg-gray-950 text-gray-100">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_12%_8%,rgba(79,70,229,0.16),transparent_30%),radial-gradient(circle_at_92%_88%,rgba(8,145,178,0.1),transparent_28%)]" />
      <div className="pointer-events-none absolute inset-0 opacity-30 bg-[linear-gradient(rgba(148,163,184,0.06)_1px,transparent_1px),linear-gradient(90deg,rgba(148,163,184,0.06)_1px,transparent_1px)] bg-size-[44px_44px] mask-[linear-gradient(to_bottom,black,transparent_85%)]" />

      <aside className="relative hidden w-[42%] max-w-xl flex-col justify-between border-r border-gray-800/80 bg-gray-900/25 px-10 py-10 lg:flex xl:px-16">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500 text-sm font-extrabold text-white shadow-lg shadow-indigo-950/40">
            CF
          </div>
          <span className="font-heading text-lg font-bold tracking-tight text-white">
            ClassFlow
          </span>
        </div>
        <div className="relative max-w-md pb-8">
          <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-cyan-300/20 bg-cyan-300/10 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.16em] text-cyan-200">
            <span className="h-1.5 w-1.5 rounded-full bg-cyan-300" />
            One clear workspace
          </div>
          <h1 className="font-heading text-5xl font-extrabold leading-[1.05] tracking-tight text-white xl:text-6xl">
            Make every class feel{" "}
            <span className="text-indigo-300">in sync.</span>
          </h1>
          <p className="mt-6 max-w-sm text-base leading-7 text-gray-400">
            Bring schedules, assignments, and student progress into one calm,
            focused workspace.
          </p>
          <ul className="mt-10 space-y-4">
            {[
              "Real-time class scheduling",
              "Student progress tracking",
              "Secure, role-based access",
            ].map((feature) => (
              <li
                key={feature}
                className="flex items-center gap-3 text-sm text-gray-300"
              >
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-indigo-300/25 bg-indigo-300/10 text-indigo-200">
                  <Check size={13} strokeWidth={2.5} />
                </span>
                {feature}
              </li>
            ))}
          </ul>
        </div>
        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-gray-600">
          Built for better learning days
        </p>
      </aside>

      <main className="relative flex min-w-0 flex-1 items-center justify-center px-5 py-8 sm:px-8 sm:py-12">
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
              Welcome back
            </p>
            <h2 className="mt-3 font-heading text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Sign in to your workspace
            </h2>
            <p className="mt-3 text-sm leading-6 text-gray-400">
              Enter your details to pick up where you left off.
            </p>
          </div>

          <div className="rounded-2xl border border-gray-800/90 bg-gray-900/85 p-5 shadow-2xl shadow-black/30 backdrop-blur sm:p-7">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label
                  htmlFor="email"
                  className="mb-2 block text-sm font-semibold text-gray-300"
                >
                  Email
                </label>
                <div className="relative">
                  <Mail
                    size={17}
                    className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500"
                  />
                  <input
                    id="email"
                    type="email"
                    value={formData.email}
                    name="email"
                    onChange={handleChange}
                    placeholder="you@example.com"
                    required
                    className="h-12 w-full rounded-xl border border-gray-700 bg-gray-950/60 pl-11 pr-4 text-sm text-gray-100 placeholder-gray-600 outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400/20"
                  />
                </div>
              </div>
              <div>
                <div className="mb-2 flex items-center justify-between">
                  <label
                    htmlFor="password"
                    className="block text-sm font-semibold text-gray-300"
                  >
                    Password
                  </label>
                </div>
                <div className="relative">
                  <LockKeyhole
                    size={17}
                    className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500"
                  />
                  <input
                    id="password"
                    type="password"
                    value={formData.password}
                    name="password"
                    onChange={handleChange}
                    placeholder="••••••••"
                    required
                    className="h-12 w-full rounded-xl border border-gray-700 bg-gray-950/60 pl-11 pr-4 text-sm text-gray-100 placeholder-gray-600 outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400/20"
                  />
                </div>
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
                  <LoadingSpinner label="Signing in" />
                ) : (
                  <>
                    Sign In <ArrowRight size={17} />
                  </>
                )}
              </button>
              <Link
                to="/forgot-password"
                className="text-xs font-medium text-indigo-300 transition hover:text-indigo-200"
              >
                Forgot password?
              </Link>

              <div className="flex items-center gap-3 py-1">
                <div className="h-px flex-1 bg-gray-800" />
                <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-gray-600">
                  or
                </span>
                <div className="h-px flex-1 bg-gray-800" />
              </div>
              <div
                id="google-signin-button"
                className="flex min-h-10 w-full justify-center overflow-hidden rounded-lg"
              />
            </form>
            <p className="mt-7 text-center text-sm text-gray-400">
              Don&apos;t have an account?{" "}
              <a
                href="/signup"
                className="font-semibold text-indigo-300 transition hover:text-indigo-200"
              >
                Create one
              </a>
            </p>
          </div>
          <p className="mt-6 text-center text-xs text-gray-600">
            Your workspace, organized with intention.
          </p>
        </div>
      </main>
    </div>
  );
}

export default Login;
