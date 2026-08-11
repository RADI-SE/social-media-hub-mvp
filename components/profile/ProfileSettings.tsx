"use client";

import { useRef, useState } from "react";
import { useClerk, useUser } from "@clerk/nextjs";
import { KeyRound, Loader2, ShieldCheck, X } from "lucide-react";
import PageHeader from "@/components/hub/PageHeader";
import { ProfilePhoto } from "../ui/profile/ProfilePhoto";
import { ProfileField } from "../ui/profile/ProfileField";
import { DangerZone } from "../ui/profile/DangerZone";
import { PasswordConfirmDialog } from "../ui/profile/PasswordConfirmDialog";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const NAME_PATTERN = /^[\p{L}\p{M}][\p{L}\p{M}\s.'-]*$/u;
const IMAGE_TYPES = ["image/jpeg", "image/png", "image/gif", "image/webp"];
const MAX_IMAGE_SIZE = 5 * 1024 * 1024;

function messageFrom(error: unknown, fallback: string) {
  return error instanceof Error ? error.message : fallback;
}

async function responseData(response: Response): Promise<{ error?: string; code?: string }> {
  try { return await response.json(); } catch { return {}; }
}

export function ProfileSettings() {
  const { user, isLoaded } = useUser();
  const { signOut } = useClerk();
  const [nameDraft, setNameDraft] = useState<string | null>(null);
  const [emailDraft, setEmailDraft] = useState<string | null>(null);
  const [nameError, setNameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [nameSuccess, setNameSuccess] = useState("");
  const [emailSuccess, setEmailSuccess] = useState("");
  const [savingField, setSavingField] = useState<"name" | "email" | null>(null);
  const [showEmailDialog, setShowEmailDialog] = useState(false);
  const [emailDialogError, setEmailDialogError] = useState("");
  const [showPasswordDialog, setShowPasswordDialog] = useState(false);
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState("");
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [imageError, setImageError] = useState("");
  const [imageSuccess, setImageSuccess] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [deletePassword, setDeletePassword] = useState("");
  const [deleteError, setDeleteError] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  if (!isLoaded) return <ProfileSkeleton />;
  if (!user) return <div className="rounded-2xl bg-rose-50 p-5 text-sm text-rose-700">Please sign in to manage your profile.</div>;

  const nameValue = user.fullName ?? user.firstName ?? "";
  const emailValue = user.primaryEmailAddress?.emailAddress ?? "";
  const shownName = nameDraft ?? nameValue;
  const shownEmail = emailDraft ?? emailValue;

  async function saveName() {
    const normalized = shownName.trim().replace(/\s+/g, " ");
    setNameError(""); setNameSuccess("");
    if (normalized.length < 2) { setNameError("Enter at least 2 characters."); return; }
    if (normalized.length > 60) { setNameError("Name must be 60 characters or fewer."); return; }
    if (!NAME_PATTERN.test(normalized)) { setNameError("Use letters, spaces, apostrophes, periods, or hyphens only."); return; }
    if (normalized === nameValue) { setNameError("Make a change before saving."); return; }
    const [firstName, ...lastParts] = normalized.split(" ");
    setSavingField("name");
    try {
      await user!.update({ firstName, lastName: lastParts.join(" ") || null });
      await user!.reload();
      setNameDraft(null); setNameSuccess("Name updated successfully.");
    } catch (error) { setNameError(messageFrom(error, "Could not update your name.")); }
    finally { setSavingField(null); }
  }

  function requestEmailChange() {
    const normalized = shownEmail.trim().toLowerCase();
    setEmailError(""); setEmailSuccess("");
    if (!EMAIL_PATTERN.test(normalized)) { setEmailError("Enter a valid email address, such as name@example.com."); return; }
    if (normalized === emailValue.toLowerCase()) { setEmailError("Enter a different email address."); return; }
    setEmailDraft(normalized); setShowEmailDialog(true);
  }

  async function confirmEmailChange(data: { password?: string }) {
    setSavingField("email"); setEmailDialogError("");
    try {
      const response = await fetch("/api/user/update-email", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ newEmail: shownEmail.trim().toLowerCase(), currentPassword: data.password }) });
      const result = await responseData(response);
      if (!response.ok) { setEmailDialogError(result.code === "EMAIL_EXISTS" ? "This email address is already in use." : result.error || "Could not update the email address."); return; }
      await user!.reload(); setShowEmailDialog(false); setEmailDraft(null); setEmailSuccess("Email updated successfully.");
    } catch (error) { setEmailDialogError(messageFrom(error, "Network error. Please try again.")); }
    finally { setSavingField(null); }
  }

  async function updatePassword(data: { currentPassword?: string; newPassword?: string }) {
    setIsUpdatingPassword(true); setPasswordError(""); setPasswordSuccess("");
    try {
      const response = await fetch("/api/user/update-password", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
      const result = await responseData(response);
      if (!response.ok) { setPasswordError(result.code === "form_password_incorrect" ? "Current password is incorrect." : result.code === "additional_verification_required" ? "Additional verification is required. Sign in again, then retry." : result.error || "Could not update the password."); return; }
      setPasswordSuccess("Password updated successfully.");
      window.setTimeout(() => { setShowPasswordDialog(false); setPasswordSuccess(""); }, 1200);
    } catch (error) { setPasswordError(messageFrom(error, "Network error. Please try again.")); }
    finally { setIsUpdatingPassword(false); }
  }

  async function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    setImageError(""); setImageSuccess("");
    if (!IMAGE_TYPES.includes(file.type)) { setImageError("Choose a JPEG, PNG, GIF, or WebP image."); event.target.value = ""; return; }
    if (file.size > MAX_IMAGE_SIZE) { setImageError("Image must be 5 MB or smaller."); event.target.value = ""; return; }
    setIsUploadingImage(true);
    try {
      const formData = new FormData(); formData.append("file", file);
      const response = await fetch("/api/user/update-profile-image", { method: "POST", body: formData });
      const result = await responseData(response);
      if (!response.ok) throw new Error(result.error || "Could not upload the image.");
      await user!.reload(); setImageSuccess("Profile photo updated.");
    } catch (error) { setImageError(messageFrom(error, "Could not upload the image.")); }
    finally { setIsUploadingImage(false); if (fileInputRef.current) fileInputRef.current.value = ""; }
  }

  async function removeImage() {
    if (!user!.hasImage) return;
    setIsUploadingImage(true); setImageError(""); setImageSuccess("");
    try {
      const response = await fetch("/api/user/update-profile-image", { method: "DELETE" });
      const result = await responseData(response);
      if (!response.ok) throw new Error(result.error || "Could not remove the image.");
      await user!.reload(); setImageSuccess("Profile photo removed.");
    } catch (error) { setImageError(messageFrom(error, "Could not remove the image.")); }
    finally { setIsUploadingImage(false); }
  }

  async function deleteAccount() {
    setDeleteError("");
    if (!deletePassword.trim()) { setDeleteError("Enter your current password to confirm deletion."); return; }
    setIsDeleting(true);
    try {
      const response = await fetch("/api/user/delete-account", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ password: deletePassword }) });
      const result = await responseData(response);
      if (!response.ok) { setDeleteError(result.code === "form_password_incorrect" ? "Current password is incorrect." : result.error || "Could not delete the account."); return; }
      await signOut({ redirectUrl: "/" });
    } catch (error) { setDeleteError(messageFrom(error, "Network error. Please try again.")); }
    finally { setIsDeleting(false); }
  }

  return <><PageHeader eyebrow="Account" title="Profile settings" description="Manage the identity and security details connected to your Spiders AI workspace." /><div className="grid gap-6 xl:grid-cols-[0.72fr_1.28fr]"><aside className="glass-card h-fit rounded-3xl p-6 sm:p-8"><ProfilePhoto avatarUrl={user.imageUrl} disabled={isUploadingImage} onClick={() => fileInputRef.current?.click()} /><input ref={fileInputRef} type="file" accept={IMAGE_TYPES.join(",")} onChange={handleFileChange} className="hidden" disabled={isUploadingImage} />{isUploadingImage && <p className="mt-4 flex items-center gap-2 text-xs text-slate-500"><Loader2 size={14} className="animate-spin" />Updating photo…</p>}{imageError && <p role="alert" className="mt-4 text-xs text-rose-600">{imageError}</p>}{imageSuccess && <p role="status" className="mt-4 text-xs text-emerald-700">{imageSuccess}</p>}{user.hasImage && !isUploadingImage && <button type="button" onClick={removeImage} className="mt-4 text-xs font-semibold text-rose-600 hover:underline">Remove photo</button>}<div className="mt-8 rounded-2xl bg-blue-50/70 p-4"><div className="flex items-center gap-2 text-[#173b9a]"><ShieldCheck size={16} /><p className="text-xs font-bold uppercase tracking-[0.12em]">Secured by Clerk</p></div><p className="mt-2 text-xs leading-5 text-slate-500">Sensitive changes require your current password and are processed through protected API routes.</p></div></aside><section className="space-y-4"><ProfileField label="Full name" value={shownName} onChange={(event) => { setNameDraft(event.target.value); setNameError(""); setNameSuccess(""); }} onSave={saveName} disabled={!shownName.trim() || shownName === nameValue} isSaving={savingField === "name"} error={nameError} success={nameSuccess} helper="2–60 characters. Arabic and English names are supported." /><ProfileField label="Email" type="email" value={shownEmail} onChange={(event) => { setEmailDraft(event.target.value); setEmailError(""); setEmailSuccess(""); }} onSave={requestEmailChange} disabled={!shownEmail.trim() || shownEmail.toLowerCase() === emailValue.toLowerCase()} isSaving={savingField === "email"} error={emailError} success={emailSuccess} warning helper="Changing email requires your current password." /><div className="rounded-2xl border border-white/90 bg-white/65 p-5"><div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center"><div><div className="flex items-center gap-2"><KeyRound size={17} className="text-[#3556d9]" /><h2 className="text-sm font-semibold text-[#071e55]">Password</h2></div><p className="mt-2 text-xs text-slate-500">Use at least 8 characters with uppercase, lowercase, and a number.</p></div><button type="button" onClick={() => setShowPasswordDialog(true)} className="rounded-xl border border-blue-200 bg-blue-50 px-4 py-2.5 text-sm font-semibold text-[#173b9a] hover:bg-blue-100">Change password</button></div></div><DangerZone onDelete={() => setShowDeleteDialog(true)} /></section></div><PasswordConfirmDialog isOpen={showEmailDialog} onClose={() => { setShowEmailDialog(false); setEmailDialogError(""); }} onSubmit={confirmEmailChange} isLoading={savingField === "email"} error={emailDialogError} title="Confirm email change" description={`Enter your current password to change your email to ${shownEmail}.`} submitLabel="Update email" mode="email" /><PasswordConfirmDialog isOpen={showPasswordDialog} onClose={() => { setShowPasswordDialog(false); setPasswordError(""); setPasswordSuccess(""); }} onSubmit={updatePassword} isLoading={isUpdatingPassword} error={passwordError} success={passwordSuccess} title="Change password" description="Confirm your current password and choose a secure new one." submitLabel="Update password" mode="password" />{showDeleteDialog && <DeleteDialog password={deletePassword} error={deleteError} isDeleting={isDeleting} onPasswordChange={(value) => { setDeletePassword(value); setDeleteError(""); }} onCancel={() => { setShowDeleteDialog(false); setDeletePassword(""); setDeleteError(""); }} onConfirm={deleteAccount} />}</>;
}

function ProfileSkeleton() { return <div className="space-y-5"><div className="h-24 animate-pulse rounded-3xl bg-white/55" /><div className="h-72 animate-pulse rounded-3xl bg-white/55" /></div>; }

function DeleteDialog({ password, error, isDeleting, onPasswordChange, onCancel, onConfirm }: { password: string; error: string; isDeleting: boolean; onPasswordChange: (value: string) => void; onCancel: () => void; onConfirm: () => void }) {
  return <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#061b4f]/55 p-4 backdrop-blur-sm"><div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl" role="dialog" aria-modal="true" aria-labelledby="delete-account-title"><div className="flex items-start justify-between"><div><h2 id="delete-account-title" className="text-xl font-semibold text-rose-700">Delete account permanently?</h2><p className="mt-2 text-sm leading-6 text-slate-500">All account access will be removed. This action cannot be undone.</p></div><button type="button" onClick={onCancel} disabled={isDeleting} aria-label="Close dialog" className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100"><X size={17} /></button></div><label htmlFor="delete-password" className="mt-5 block text-sm font-semibold text-slate-700">Current password</label><input id="delete-password" type="password" autoComplete="current-password" autoFocus value={password} onChange={(event) => onPasswordChange(event.target.value)} disabled={isDeleting} aria-invalid={Boolean(error)} className={`mt-2 w-full rounded-xl border px-4 py-3 text-sm outline-none ${error ? "border-rose-300 focus:ring-2 focus:ring-rose-100" : "border-slate-200 focus:ring-2 focus:ring-blue-100"}`} />{error && <p role="alert" className="mt-2 text-sm text-rose-600">{error}</p>}<div className="mt-6 flex justify-end gap-3"><button type="button" onClick={onCancel} disabled={isDeleting} className="rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-100">Cancel</button><button type="button" onClick={onConfirm} disabled={isDeleting || !password.trim()} className="inline-flex min-w-32 items-center justify-center gap-2 rounded-xl bg-rose-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-rose-700 disabled:opacity-50">{isDeleting && <Loader2 size={15} className="animate-spin" />}{isDeleting ? "Deleting…" : "Delete account"}</button></div></div></div>;
}
