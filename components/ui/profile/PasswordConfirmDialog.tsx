'use client';

import { useState } from 'react';
import { Loader2 } from 'lucide-react';

interface PasswordConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { password?: string; currentPassword?: string; newPassword?: string }) => void;
  isLoading?: boolean;
  title?: string;
  description?: string;
  submitLabel?: string;
  cancelLabel?: string;
  error?: string;
  success?: string; // New: success message
  mode?: 'email' | 'password';
}

export function PasswordConfirmDialog({
  isOpen,
  onClose,
  onSubmit,
  isLoading = false,
  title = 'Authentication Required',
  description = 'To change your email, please enter your current password.',
  submitLabel = 'Submit',
  cancelLabel = 'Cancel',
  error,
  success, // Receive success prop
  mode = 'email',
}: PasswordConfirmDialogProps) {
  const [password, setPassword] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading) return;

    if (mode === 'email') {
      if (!password.trim()) return;
      onSubmit({ password });
    } else {
      if (!currentPassword.trim() || !newPassword.trim()) return;
      onSubmit({ currentPassword, newPassword });
    }
  };

  const handleClose = () => {
    setPassword('');
    setCurrentPassword('');
    setNewPassword('');
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
      onClick={(e) => e.target === e.currentTarget && handleClose()}
    >
      <div
        className="bg-white rounded-lg shadow-2xl w-full max-w-md mx-4 overflow-hidden"
        role="dialog"
        aria-labelledby="auth-dialog-title"
        aria-describedby="auth-dialog-desc"
      >
        <form onSubmit={handleSubmit} className="flex flex-col">
          <header className="px-6 py-4 border-b border-gray-200">
            <h3 id="auth-dialog-title" className="text-lg font-semibold text-gray-900">
              {title}
            </h3>
            <p id="auth-dialog-desc" className="text-sm text-gray-500 mt-1">
              {description}
            </p>
          </header>

          <section className="px-6 py-4 space-y-3">
            {mode === 'email' ? (
              <div className="space-y-1">
                <label htmlFor="current-password" className="block text-sm font-medium text-gray-700">
                  Password
                </label>
                <input
                  type="password"
                  id="current-password"
                  placeholder="Enter your password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            ) : (
              <>
                <div className="space-y-1">
                  <label htmlFor="current-password" className="block text-sm font-medium text-gray-700">
                    Current Password
                  </label>
                  <input
                    type="password"
                    id="current-password"
                    placeholder="Current password"
                    required
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="space-y-1">
                  <label htmlFor="new-password" className="block text-sm font-medium text-gray-700">
                    New Password
                  </label>
                  <input
                    type="password"
                    id="new-password"
                    placeholder="New password"
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </>
            )}

            {/* Error message */}
            {error && <p className="text-sm text-red-600">{error}</p>}

            {/* Success message */}
            {success && <p className="text-sm text-green-600">{success}</p>}
          </section>

          <footer className="px-6 py-4 border-t border-gray-200 flex justify-end gap-3">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
              disabled={isLoading}
            >
              {cancelLabel}
            </button>
            <button
              type="submit"
              disabled={
                isLoading ||
                (mode === 'email' ? !password.trim() : !currentPassword.trim() || !newPassword.trim())
              }
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isLoading && <Loader2 size={16} className="animate-spin" />}
              {isLoading ? 'Submitting...' : submitLabel}
            </button>
          </footer>
        </form>
      </div>
    </div>
  );
}