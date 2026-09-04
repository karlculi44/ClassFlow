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
    setProfileSubmitting(true);
    setProfileError("");
    setProfileSuccess("");

    try {
      const data = await updateProfile({
        name: profile.name.trim(),
        email: profile.email.trim().toLowerCase(),
      });
      setProfile(data.user);
      updateUser(data.user);
      setProfileSuccess("Your profile has been updated.");
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
    } catch (error) {
      setPasswordError(
        getErrorMessage(error, "Unable to change your password."),
      );
    } finally {
      setPasswordSubmitting(false);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-gray-950">
      <div className="absolute -right-32 -top-32 h-96 w-96 rounded-full bg-indigo-600/15 blur-3xl" />
      <main className="relative px-4 py-8 sm:px-6 lg:px-10">
        <div className="mx-auto max-w-5xl">
          <header className="mb-8">
            <p className="text-sm font-medium text-indigo-400">Account</p>
            <h1 className="mt-1 text-2xl font-extrabold tracking-tight text-white sm:text-3xl">
              Profile
            </h1>
            <p className="mt-1 text-sm text-gray-400">
              Manage your account details and password.
            </p>
          </header>

          <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
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
              </form>
            </section>

            <section className="rounded-2xl border border-gray-800 bg-gray-900 p-5 shadow-lg shadow-black/20 sm:p-6">
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
              </form>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Profile;
