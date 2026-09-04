import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import {
  changePassword,
  getProfile,
  updateProfile,
} from "../services/authServices";
import formatDate from "../utils/formatDate";

const inputClassName =
  "mt-1.5 w-full rounded-lg border border-gray-700 bg-gray-800 px-4 py-2.5 text-gray-100 outline-none placeholder:text-gray-500 transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500";

const getErrorMessage = (error, fallback) => {
  const apiErrors = error.response?.data?.errors;
  return error.response?.data?.message || apiErrors?.[0]?.message || fallback;
};

function Profile() {
  const { user, updateUser } = useContext(AuthContext);
  const [profile, setProfile] = useState({
    name: user?.name || "",
    email: user?.email || "",
    user_code: user?.user_code || "",
    role: user?.role || "",
    created_at: user?.created_at,
  });
  const [profileError, setProfileError] = useState("");
  const [profileSuccess, setProfileSuccess] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState("");
  const [profileSubmitting, setProfileSubmitting] = useState(false);
  const [passwordSubmitting, setPasswordSubmitting] = useState(false);
  const [view, setView] = useState("view");
  const [confirmation, setConfirmation] = useState(null);
  const [passwords, setPasswords] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const data = await getProfile();
        setProfile(data.user);
        updateUser(data.user);
      } catch (error) {
        setProfileError(getErrorMessage(error, "Unable to load your profile."));
      }
    };

    loadProfile();
  }, [updateUser]);

  const handleProfileChange = (event) => {
    const { name, value } = event.target;
    setProfile((current) => ({ ...current, [name]: value }));
    setProfileError("");
    setProfileSuccess("");
  };

  const handleProfileSubmit = async (event) => {
    event.preventDefault();
    setProfileError("");
    setProfileSuccess("");

    const name = profile.name.trim();
    const email = profile.email.trim().toLowerCase();
    if (name.length < 3 || name.length > 100) {
      setProfileError("Name must be between 3 and 100 characters.");
      return;
    }
    if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
      setProfileError("Enter a valid email address.");
      return;
    }
    setConfirmation({ type: "profile", title: "Update profile?" });
  };

  const saveProfile = async () => {
    setProfileSubmitting(true);
    try {
      const data = await updateProfile({
        name: profile.name.trim(),
        email: profile.email.trim().toLowerCase(),
      });
      setProfile(data.user);
      updateUser(data.user);
      setProfileSuccess("Your profile has been updated.");
      setView("view");
    } catch (error) {
      setProfileError(getErrorMessage(error, "Unable to update your profile."));
    } finally {
      setProfileSubmitting(false);
    }
  };

  const handlePasswordChange = (event) => {
    const { name, value } = event.target;
    setPasswords((current) => ({ ...current, [name]: value }));
    setPasswordError("");
    setPasswordSuccess("");
  };

  const handlePasswordSubmit = async (event) => {
    event.preventDefault();
    setPasswordError("");
    setPasswordSuccess("");

    if (passwords.newPassword !== passwords.confirmPassword) {
      setPasswordError("New passwords do not match.");
      return;
    }
    if (
      passwords.newPassword.length < 6 ||
      passwords.newPassword.length > 128
    ) {
      setPasswordError("New password must be between 6 and 128 characters.");
      return;
    }
    if (!passwords.currentPassword) {
      setPasswordError("Enter your current password.");
      return;
    }
    setConfirmation({ type: "password", title: "Change password?" });
  };

  const savePassword = async () => {
    setPasswordSubmitting(true);
    try {
      await changePassword({
        currentPassword: passwords.currentPassword,
        newPassword: passwords.newPassword,
      });
      setPasswords({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      setPasswordSuccess("Your password has been changed.");
      setProfileSuccess("Your password has been changed.");
      setView("view");
    } catch (error) {
      setPasswordError(
        getErrorMessage(error, "Unable to change your password."),
      );
    } finally {
      setPasswordSubmitting(false);
    }
  };

  const handleConfirmation = async () => {
    const confirmedAction = confirmation?.type;
    setConfirmation(null);
    if (confirmedAction === "profile") {
      await saveProfile();
    }
    if (confirmedAction === "password") {
      await savePassword();
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-gray-950">
      <div className="absolute -right-32 -top-32 h-96 w-96 rounded-full bg-indigo-600/15 blur-3xl" />
      <main className="relative px-4 py-8 sm:px-6 lg:px-10">
        <div className="mx-auto max-w-5xl">
          <header className="mb-8 text-center">
            <p className="text-sm font-medium text-indigo-400">Account</p>
            <h1 className="mt-1 text-2xl font-extrabold tracking-tight text-white sm:text-3xl">
              Profile
            </h1>
            <p className="mt-1 text-sm text-gray-400">
              Manage your account details and password.
            </p>
          </header>

          {view === "view" && (
            <section className="mx-auto w-full max-w-xl rounded-2xl border border-gray-800 bg-gray-900 p-5 shadow-lg shadow-black/20 sm:p-8">
              <div className="text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-indigo-500/10 text-2xl font-bold text-indigo-300">
                  {profile.name?.charAt(0)?.toUpperCase() || "U"}
                </div>
                <h2 className="mt-4 text-xl font-semibold text-white">
                  {profile.name || "Unnamed user"}
                </h2>
                <p className="mt-1 text-sm text-gray-400">{profile.email}</p>
              </div>
              <dl className="mt-8 divide-y divide-gray-800">
                {[
                  ["User code", profile.user_code || "Unavailable"],
                  ["Role", profile.role || "Unavailable"],
                  [
                    "Account created",
                    profile.created_at
                      ? formatDate(profile.created_at)
                      : "Unavailable",
                  ],
                ].map(([label, value]) => (
                  <div
                    key={label}
                    className="flex justify-between gap-4 py-3 text-sm"
                  >
                    <dt className="text-gray-500">{label}</dt>
                    <dd className="text-right text-gray-200">{value}</dd>
                  </div>
                ))}
              </dl>
              {profileError && (
                <p className="mt-5 text-sm text-red-400" role="alert">
                  {profileError}
                </p>
              )}
              {profileSuccess && (
                <p className="mt-5 text-sm text-emerald-400" role="status">
                  {profileSuccess}
                </p>
              )}
              <div className="mt-7 flex flex-col items-center gap-4">
                <button
                  type="button"
                  onClick={() => {
                    setProfileError("");
                    setProfileSuccess("");
                    setView("edit");
                  }}
                  className="rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-500"
                >
                  Edit profile
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setPasswordError("");
                    setPasswordSuccess("");
                    setView("password");
                  }}
                  className="text-sm font-medium text-gray-400 transition hover:text-white"
                >
                  Change password
                </button>
              </div>
            </section>
          )}

          {view === "edit" && (
            <div className="mx-auto w-full max-w-xl">
              <section className="rounded-2xl border border-gray-800 bg-gray-900 p-5 shadow-lg shadow-black/20 sm:p-6">
                <div className="mb-6">
                  <h2 className="text-lg font-semibold text-white">
                    Your details
                  </h2>
                  <p className="mt-1 text-sm text-gray-400">
                    Your role and account date are read-only.
                  </p>
                </div>
                <form
                  onSubmit={handleProfileSubmit}
                  className="space-y-5"
                  noValidate
                >
                  <label className="block text-sm font-medium text-gray-300">
                    Full name
                    <input
                      name="name"
                      type="text"
                      value={profile.name}
                      onChange={handleProfileChange}
                      maxLength={100}
                      autoComplete="name"
                      className={inputClassName}
                    />
                  </label>
                  <label className="block text-sm font-medium text-gray-300">
                    Email
                    <input
                      name="email"
                      type="email"
                      value={profile.email}
                      onChange={handleProfileChange}
                      maxLength={254}
                      autoComplete="email"
                      className={inputClassName}
                    />
                  </label>
                  <div className="grid gap-5 sm:grid-cols-2">
                    <div>
                      <p className="text-sm font-medium text-gray-300">
                        User code
                      </p>
                      <p className="mt-1.5 rounded-lg border border-gray-800 bg-gray-950 px-4 py-2.5 text-sm text-gray-400">
                        {profile.user_code || "Unavailable"}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-300">Role</p>
                      <p className="mt-1.5 rounded-lg border border-gray-800 bg-gray-950 px-4 py-2.5 text-sm text-gray-400">
                        {profile.role}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-300">
                        Account created
                      </p>
                      <p className="mt-1.5 rounded-lg border border-gray-800 bg-gray-950 px-4 py-2.5 text-sm text-gray-400">
                        {profile.created_at
                          ? formatDate(profile.created_at)
                          : "Unavailable"}
                      </p>
                    </div>
                  </div>
                  {profileError && (
                    <p className="text-sm text-red-400" role="alert">
                      {profileError}
                    </p>
                  )}
                  {profileSuccess && (
                    <p className="text-sm text-emerald-400" role="status">
                      {profileSuccess}
                    </p>
                  )}
                  <button
                    type="submit"
                    disabled={profileSubmitting}
                    className="rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {profileSubmitting ? "Saving..." : "Save changes"}
                  </button>
                  <button
                    type="button"
                    onClick={() => setView("view")}
                    className="ml-3 rounded-lg border border-gray-700 px-4 py-2.5 text-sm font-semibold text-gray-300 transition hover:bg-gray-800 hover:text-white"
                  >
                    Cancel
                  </button>
                </form>
              </section>
            </div>
          )}

          {view === "password" && (
            <section className="mx-auto w-full max-w-xl rounded-2xl border border-gray-800 bg-gray-900 p-5 shadow-lg shadow-black/20 sm:p-6">
              <div className="mb-6">
                <h2 className="text-lg font-semibold text-white">
                  Change password
                </h2>
                <p className="mt-1 text-sm text-gray-400">
                  Verify your current password first.
                </p>
              </div>
              <form
                onSubmit={handlePasswordSubmit}
                className="space-y-5"
                noValidate
              >
                {[
                  ["currentPassword", "Current password", "current-password"],
                  ["newPassword", "New password", "new-password"],
                  ["confirmPassword", "Confirm new password", "new-password"],
                ].map(([name, label, autoComplete]) => (
                  <label
                    key={name}
                    className="block text-sm font-medium text-gray-300"
                  >
                    {label}
                    <input
                      name={name}
                      type="password"
                      value={passwords[name]}
                      onChange={handlePasswordChange}
                      maxLength={128}
                      autoComplete={autoComplete}
                      className={inputClassName}
                    />
                  </label>
                ))}
                {passwordError && (
                  <p className="text-sm text-red-400" role="alert">
                    {passwordError}
                  </p>
                )}
                {passwordSuccess && (
                  <p className="text-sm text-emerald-400" role="status">
                    {passwordSuccess}
                  </p>
                )}
                <button
                  type="submit"
                  disabled={passwordSubmitting}
                  className="rounded-lg border border-gray-700 px-4 py-2.5 text-sm font-semibold text-gray-200 transition hover:border-indigo-500 hover:bg-indigo-500/10 hover:text-white disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {passwordSubmitting ? "Changing..." : "Change password"}
                </button>
                <button
                  type="button"
                  onClick={() => setView("view")}
                  className="ml-3 rounded-lg border border-gray-700 px-4 py-2.5 text-sm font-semibold text-gray-300 transition hover:bg-gray-800 hover:text-white"
                >
                  Back to profile
                </button>
              </form>
            </section>
          )}
        </div>
      </main>
      {confirmation && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4 py-6 backdrop-blur-sm"
          role="presentation"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setConfirmation(null);
            }
          }}
        >
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="profile-confirmation-title"
            className="w-full max-w-md rounded-2xl border border-gray-800 bg-gray-900 p-6 shadow-2xl shadow-black/50"
          >
            <h2
              id="profile-confirmation-title"
              className="text-xl font-bold text-white"
            >
              {confirmation.title}
            </h2>
            <p className="mt-2 text-sm leading-6 text-gray-400">
              {confirmation.type === "profile"
                ? "Your name and email will be updated."
                : "Your current password will be replaced with the new password."}
            </p>
            <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={() => setConfirmation(null)}
                disabled={profileSubmitting || passwordSubmitting}
                className="rounded-lg border border-gray-700 px-4 py-2.5 text-sm font-semibold text-gray-300 transition hover:bg-gray-800 hover:text-white disabled:cursor-not-allowed disabled:opacity-60"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmation}
                disabled={profileSubmitting || passwordSubmitting}
                className="rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {confirmation.type === "profile"
                  ? "Update profile"
                  : "Change password"}
              </button>
            </div>
          </section>
        </div>
      )}
    </div>
  );
}

export default Profile;
