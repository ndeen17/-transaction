import { useRef, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { ComingSoonToast } from "../components/dashboard/ComingSoonToast";
import { DashboardBottomNav, DashboardSidebar } from "../components/dashboard/DashboardNav";
import { DashboardButton } from "../components/dashboard/DashboardButton";
import { CameraIcon, TrashIcon } from "../components/dashboard/icons";
import { DASH_CARD } from "../components/dashboard/theme";
import { useAuthedUser } from "../lib/useAuthedUser";
import { useComingSoonToast } from "../lib/useComingSoonToast";
import { ApiRequestError, removeProfileImage, uploadProfileImage } from "../lib/api";

const ACCEPTED_TYPES = ["image/jpeg", "image/png", "image/webp"];
const MAX_FILE_SIZE_MB = 5;

export function SettingsPage() {
  const navigate = useNavigate();
  const { token, cachedUser, user, setUser } = useAuthedUser();
  const { toast, show } = useComingSoonToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [uploading, setUploading] = useState(false);
  const [removing, setRemoving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function handleLogout() {
    localStorage.removeItem("authToken");
    localStorage.removeItem("authUser");
    navigate("/");
  }

  if (!token || !cachedUser) {
    return <Navigate to="/" replace />;
  }

  function persistUser(updated: NonNullable<typeof user>) {
    setUser(updated);
    localStorage.setItem("authUser", JSON.stringify(updated));
  }

  async function handleFileSelected(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file || !token) return;

    setError(null);

    if (!ACCEPTED_TYPES.includes(file.type)) {
      setError("Upload a JPG, PNG, or WEBP image.");
      return;
    }
    if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
      setError(`File must be under ${MAX_FILE_SIZE_MB}MB.`);
      return;
    }

    setUploading(true);
    try {
      const updated = await uploadProfileImage(token, file);
      persistUser(updated);
    } catch (err) {
      setError(err instanceof ApiRequestError ? err.message : "Something went wrong. Please try again.");
    } finally {
      setUploading(false);
    }
  }

  async function handleRemove() {
    if (!token) return;
    setError(null);
    setRemoving(true);
    try {
      const updated = await removeProfileImage(token);
      persistUser(updated);
    } catch (err) {
      setError(err instanceof ApiRequestError ? err.message : "Something went wrong. Please try again.");
    } finally {
      setRemoving(false);
    }
  }

  const initial = user?.firstName.charAt(0).toUpperCase() ?? "";

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-28 lg:pb-0 lg:pl-64">
      <DashboardSidebar onComingSoon={show} onLogout={handleLogout} />

      <div className="mx-auto max-w-[600px] px-4 pb-10 pt-6 sm:px-6 sm:pt-10">
        <h1 className="text-xl font-semibold text-[#111827]">Settings</h1>

        <div className={`${DASH_CARD} mt-5 p-5 sm:p-6`}>
          <h2 className="text-[15px] font-semibold text-[#111827]">Profile photo</h2>
          <p className="mt-1 text-sm text-[#6B7280]">
            Shown in your dashboard header. JPG, PNG, or WEBP, up to {MAX_FILE_SIZE_MB}MB.
          </p>

          <div className="mt-5 flex items-center gap-5">
            {user?.avatarUrl ? (
              <img
                src={user.avatarUrl}
                alt="Your profile"
                className="h-20 w-20 rounded-full object-cover shadow-[0_2px_8px_rgba(0,0,0,0.1)]"
              />
            ) : (
              <span className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-blue-700 text-2xl font-semibold text-white shadow-[0_2px_8px_rgba(0,0,0,0.1)]">
                {initial}
              </span>
            )}

            <div className="flex flex-col gap-2">
              <input
                ref={fileInputRef}
                type="file"
                accept={ACCEPTED_TYPES.join(",")}
                onChange={handleFileSelected}
                className="hidden"
              />
              <DashboardButton
                type="button"
                variant="secondary"
                disabled={uploading || removing}
                onClick={() => fileInputRef.current?.click()}
                className="gap-1.5"
              >
                <CameraIcon className="h-4 w-4" />
                {uploading ? "Uploading…" : user?.avatarUrl ? "Change photo" : "Upload photo"}
              </DashboardButton>

              {user?.avatarUrl && (
                <button
                  type="button"
                  onClick={handleRemove}
                  disabled={uploading || removing}
                  className="inline-flex items-center gap-1.5 self-start text-sm font-medium text-[#DC2626] hover:underline disabled:opacity-60"
                >
                  <TrashIcon className="h-4 w-4" />
                  {removing ? "Removing…" : "Remove photo"}
                </button>
              )}
            </div>
          </div>

          {error && <p className="mt-4 rounded-xl bg-[#FEF2F2] px-4 py-3 text-sm text-[#DC2626]">{error}</p>}
        </div>

        {user && (
          <div className={`${DASH_CARD} mt-5 p-5 sm:p-6`}>
            <h2 className="text-[15px] font-semibold text-[#111827]">Account</h2>
            <dl className="mt-4 grid grid-cols-1 gap-x-6 gap-y-3 sm:grid-cols-2">
              <div>
                <dt className="text-xs text-[#6B7280]">Full name</dt>
                <dd className="mt-0.5 text-sm text-[#111827]">
                  {user.firstName} {user.lastName}
                </dd>
              </div>
              <div>
                <dt className="text-xs text-[#6B7280]">Login ID</dt>
                <dd className="mt-0.5 text-sm text-[#111827]">{user.loginId}</dd>
              </div>
              <div>
                <dt className="text-xs text-[#6B7280]">Account type</dt>
                <dd className="mt-0.5 text-sm capitalize text-[#111827]">{user.accountType}</dd>
              </div>
              <div>
                <dt className="text-xs text-[#6B7280]">Account number</dt>
                <dd className="mt-0.5 text-sm text-[#111827]">{user.account.accountNumber}</dd>
              </div>
            </dl>
          </div>
        )}
      </div>

      <DashboardBottomNav onComingSoon={show} onLogout={handleLogout} />
      {toast && <ComingSoonToast label={toast} />}
    </div>
  );
}
