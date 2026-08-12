"use client";

import { useEffect, useState } from "react";
import { CheckCircle2, Loader2, X } from "lucide-react";

interface PasswordConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: {
    password?: string;
    currentPassword?: string;
    newPassword?: string;
  }) => void;
  isLoading?: boolean;
  title?: string;
  description?: string;
  submitLabel?: string;
  cancelLabel?: string;
  error?: string;
  success?: string;
  mode?: "email" | "password";
}

function passwordError(value: string) {
  if (value.length < 8) return "Use at least 8 characters.";
  if (!/[a-z]/.test(value) || !/[A-Z]/.test(value) || !/\d/.test(value))
    return "Include uppercase, lowercase, and a number.";
  return "";
}

export function PasswordConfirmDialog({
  isOpen,
  onClose,
  onSubmit,
  isLoading = false,
  title = "Authentication required",
  description = "Enter your current password to continue.",
  submitLabel = "Submit",
  cancelLabel = "Cancel",
  error,
  success,
  mode = "email",
}: PasswordConfirmDialogProps) {
  const [password, setPassword] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [clientError, setClientError] = useState("");

  useEffect(() => {
    if (!isOpen) return;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape" && !isLoading) handleClose();
    };
    document.addEventListener("keydown", closeOnEscape);
    return () => document.removeEventListener("keydown", closeOnEscape);
  });

  if (!isOpen) return null;

  function handleClose() {
    setPassword("");
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setClientError("");
    onClose();
  }

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (isLoading) return;
    if (mode === "email") {
      if (!password.trim()) {
        setClientError("Enter your current password.");
        return;
      }
      setClientError("");
      onSubmit({ password });
      return;
    }
    if (!currentPassword) {
      setClientError("Enter your current password.");
      return;
    }
    const strengthError = passwordError(newPassword);
    if (strengthError) {
      setClientError(strengthError);
      return;
    }
    if (newPassword === currentPassword) {
      setClientError(
        "Your new password must be different from the current password.",
      );
      return;
    }
    if (newPassword !== confirmPassword) {
      setClientError("The new passwords do not match.");
      return;
    }
    setClientError("");
    onSubmit({ currentPassword, newPassword });
  }

  const shownError = clientError || error;
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#061b4f]/55 p-4 backdrop-blur-sm"
      onClick={(event) =>
        event.target === event.currentTarget && !isLoading && handleClose()
      }
    >
      <div
        className="w-full max-w-md overflow-hidden rounded-3xl border border-white bg-white shadow-2xl"
        role="dialog"
        aria-modal="true"
        aria-labelledby="profile-dialog-title"
        aria-describedby="profile-dialog-description"
      >
        <form onSubmit={handleSubmit} noValidate>
          <header className="flex items-start justify-between border-b border-slate-100 px-6 py-5">
            <div>
              <h3
                id="profile-dialog-title"
                className="text-lg font-semibold text-[#071e55]"
              >
                {title}
              </h3>
              <p
                id="profile-dialog-description"
                className="mt-1 text-sm leading-6 text-slate-500"
              >
                {description}
              </p>
            </div>
            <button
              type="button"
              onClick={handleClose}
              disabled={isLoading}
              aria-label="Close dialog"
              className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100"
            >
              <X size={17} />
            </button>
          </header>
          <section className="space-y-4 px-6 py-5">
            {mode === "email" ? (
              <PasswordInput
                id="email-current-password"
                label="Current password"
                value={password}
                onChange={setPassword}
                autoFocus
              />
            ) : (
              <>
                <PasswordInput
                  id="password-current"
                  label="Current password"
                  value={currentPassword}
                  onChange={setCurrentPassword}
                  autoFocus
                />
                <PasswordInput
                  id="password-new"
                  label="New password"
                  value={newPassword}
                  onChange={setNewPassword}
                  helper="8+ characters with uppercase, lowercase, and a number."
                />
                <PasswordInput
                  id="password-confirm"
                  label="Confirm new password"
                  value={confirmPassword}
                  onChange={setConfirmPassword}
                />
              </>
            )}
            {shownError && (
              <p
                role="alert"
                className="rounded-xl bg-rose-50 px-3 py-2.5 text-sm text-rose-700"
              >
                {shownError}
              </p>
            )}
            {success && (
              <p
                role="status"
                className="flex items-center gap-2 rounded-xl bg-emerald-50 px-3 py-2.5 text-sm text-emerald-700"
              >
                <CheckCircle2 size={16} />
                {success}
              </p>
            )}
          </section>
          <footer className="flex justify-end gap-3 border-t border-slate-100 px-6 py-4">
            <button
              type="button"
              onClick={handleClose}
              disabled={isLoading}
              className="rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-100"
            >
              {cancelLabel}
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="inline-flex min-w-32 items-center justify-center gap-2 rounded-xl bg-[#173b9a] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#0f2e7d] disabled:opacity-50"
            >
              {isLoading && <Loader2 size={16} className="animate-spin" />}
              {isLoading ? "Submitting…" : submitLabel}
            </button>
          </footer>
        </form>
      </div>
    </div>
  );
}

function PasswordInput({
  id,
  label,
  value,
  onChange,
  helper,
  autoFocus = false,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  helper?: string;
  autoFocus?: boolean;
}) {
  return (
    <div>
      <label
        htmlFor={id}
        className="mb-1.5 block text-sm font-semibold text-slate-700"
      >
        {label}
      </label>
      <input
        id={id}
        type="password"
        autoComplete={
          label.startsWith("Current") ? "current-password" : "new-password"
        }
        autoFocus={autoFocus}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
      />
      {helper && <p className="mt-1.5 text-xs text-slate-400">{helper}</p>}
    </div>
  );
}
