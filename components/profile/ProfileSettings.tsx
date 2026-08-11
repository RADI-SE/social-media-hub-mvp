"use client";

import { useState, useRef } from "react";
import { useUser } from '@clerk/nextjs';
import { ProfilePhoto } from "../ui/profile/ProfilePhoto";
import { ProfileField } from "../ui/profile/ProfileField";
import { DangerZone } from "../ui/profile/DangerZone";
import { PasswordConfirmDialog } from "../ui/profile/PasswordConfirmDialog";

export function ProfileSettings() {
    const { user, isLoaded } = useUser();

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [showAuthDialog, setShowAuthDialog] = useState(false);
    const [isSubmittingPassword, setIsSubmittingPassword] = useState(false);
    const [emailDialogError, setEmailDialogError] = useState("");

    const [showPasswordDialog, setShowPasswordDialog] = useState(false);
    const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);
    const [passwordChangeError, setPasswordChangeError] = useState("");
    const [passwordChangeSuccess, setPasswordChangeSuccess] = useState("");
 
    const [isUploadingImage, setIsUploadingImage] = useState(false);
    const [imageError, setImageError] = useState("");
    const fileInputRef = useRef<HTMLInputElement>(null);
 
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [deletePassword, setDeletePassword] = useState("");
    const [deleteError, setDeleteError] = useState("");
    const [isDeleting, setIsDeleting] = useState(false);

    const handleEmailChange = async (data: { password?: string }) => {
        const password = data.password!;
        setIsSubmittingPassword(true);
        setEmailDialogError("");

        try {
            const res = await fetch("/api/user/update-email", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    newEmail: email || emailValue,
                    currentPassword: password,
                }),
            });

            const dataRes = await res.json();

            if (!res.ok) {
                if (dataRes.code === "EMAIL_PENDING") {
                    await user.reload();
                    setIsSubmittingPassword(false);
                    return;
                }

                if (dataRes.code === "EMAIL_EXISTS") {
                    setEmailDialogError("This email is already in use.");
                    setIsSubmittingPassword(false);
                    return;
                }

                setEmailDialogError(dataRes.error || "Failed to update email");
                setIsSubmittingPassword(false);
                return;
            }

            await user.reload();
            setShowAuthDialog(false);
            setEmail("");
            setEmailDialogError("");
        } catch (error: any) {
            // silent
        } finally {
            setIsSubmittingPassword(false);
        }
    };

    const handlePasswordUpdate = async (data: { currentPassword?: string; newPassword?: string }) => {
        setIsUpdatingPassword(true);
        setPasswordChangeError("");
        setPasswordChangeSuccess("");

        try {
            const res = await fetch("/api/user/update-password", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    currentPassword: data.currentPassword!,
                    newPassword: data.newPassword!,
                }),
            });

            const result = await res.json();

            if (!res.ok) {
                if (res.status === 400 && result.code === "form_password_incorrect") {
                    setPasswordChangeError("Current password is incorrect.");
                } else if (res.status === 403 && result.code === "additional_verification_required") {
                    setPasswordChangeError(
                        "Additional verification is required. If you have 2FA enabled, please use the sign‑in flow instead."
                    );
                } else {
                    setPasswordChangeError(result.error || "Could not update password. Please try again.");
                }
                return;
            }

            setPasswordChangeSuccess("Password updated successfully!");
            setTimeout(() => {
                setShowPasswordDialog(false);
                setPasswordChangeSuccess("");
            }, 1500);

        } catch (error: any) {
            console.error("Password update failed:", error);
            setPasswordChangeError("Network error. Please try again.");
        } finally {
            setIsUpdatingPassword(false);
        }
    };

    const handleSave = async (field: string) => {
        try {
            if (field === "Name") {
                await user.update({ firstName: name });
                await user.reload();
                console.log("Name updated.");
            }

            if (field === "Email") {
                if (!email || email === user.primaryEmailAddress?.emailAddress) return;
                setShowAuthDialog(true);
            }
        } catch (error) {
            console.error(`Failed to save ${field}:`, error);
        }
    };

    // ---- Profile image handlers ----
    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const allowedTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
        if (!allowedTypes.includes(file.type)) {
            setImageError("Unsupported file type. Please use JPEG, PNG, GIF, or WebP.");
            if (fileInputRef.current) fileInputRef.current.value = "";
            return;
        }
        if (file.size > 5 * 1024 * 1024) {
            setImageError("File is too large. Max size is 5 MB.");
            if (fileInputRef.current) fileInputRef.current.value = "";
            return;
        }

        setIsUploadingImage(true);
        setImageError("");

        try {
            const formData = new FormData();
            formData.append("file", file);

            const res = await fetch("/api/user/update-profile-image", {
                method: "POST",
                body: formData,
            });

            let data;
            try {
                const text = await res.text();
                data = text ? JSON.parse(text) : {};
            } catch {
                data = {};
            }

            if (!res.ok) {
                throw new Error(data.error || `Upload failed (${res.status})`);
            }

            await user.reload();
            if (fileInputRef.current) fileInputRef.current.value = "";
        } catch (error: any) {
            console.error("Failed to upload image:", error);
            setImageError(error.message || "Could not upload image.");
        } finally {
            setIsUploadingImage(false);
        }
    };

    const handleRemoveImage = async () => {
        if (!user.hasImage) return;
        setIsUploadingImage(true);
        setImageError("");

        try {
            const res = await fetch("/api/user/update-profile-image", {
                method: "DELETE",
            });

            let data;
            try {
                const text = await res.text();
                data = text ? JSON.parse(text) : {};
            } catch {
                data = {};
            }

            if (!res.ok) {
                throw new Error(data.error || `Remove failed (${res.status})`);
            }

            await user.reload();
        } catch (error: any) {
            console.error("Failed to remove image:", error);
            setImageError(error.message || "Could not remove image.");
        } finally {
            setIsUploadingImage(false);
        }
    };

    // ---- Delete account handler ----
    const handleDeleteAccount = async () => {
        setIsDeleting(true);
        setDeleteError("");

        try {
            const res = await fetch("/api/user/delete-account", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ password: deletePassword }),
            });

            const data = await res.json();

            if (!res.ok) {
                if (res.status === 400 && data.code === "form_password_incorrect") {
                    setDeleteError("Current password is incorrect.");
                } else {
                    setDeleteError(data.error || "Failed to delete account. Please try again.");
                }
                return;
            }

            // Account deleted successfully – sign out the user (Clerk will handle)
            await user.signOut();
            // Optionally redirect to home or login page
            window.location.href = "/";
        } catch (error: any) {
            console.error("Delete account failed:", error);
            setDeleteError("Network error. Please try again.");
        } finally {
            setIsDeleting(false);
        }
    };

    if (!isLoaded) return <div>Loading...</div>;
    if (!user) return <div>Please sign in.</div>;

    const nameValue = user.fullName ?? "";
    const emailValue = user.primaryEmailAddress?.emailAddress ?? "";
    const avatarUrl = user.imageUrl;

    return (
        <div className="mx-auto max-w-4xl space-y-6 p-6">
            <header className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-gray-900">Profile</h1>
            </header> 
            <div>
                <ProfilePhoto 
                    avatarUrl={avatarUrl} 
                    onClick={() => fileInputRef.current?.click()} 
                />
                <input
                    type="file"
                    ref={fileInputRef}
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                    id="profile-upload"
                    disabled={isUploadingImage}
                />
                {imageError && <p className="text-sm text-red-600 mt-1">{imageError}</p>}
                <div className="flex items-center gap-3 mt-1">
                    {isUploadingImage && (
                        <span className="text-sm text-gray-500">Uploading...</span>
                    )}
                    {user.hasImage && !isUploadingImage && (
                        <button
                            onClick={handleRemoveImage}
                            className="text-sm text-red-600 hover:underline"
                        >
                            Remove
                        </button>
                    )}
                </div>
            </div>

            <ProfileField
                label="Name"
                value={name || nameValue}
                onChange={(e) => setName(e.target.value)}
                onSave={() => handleSave("Name")}
            />

            <ProfileField
                label="Email"
                value={email || emailValue}
                onChange={(e) => setEmail(e.target.value)}
                onSave={() => handleSave("Email")}
                warning={true}
            />

            <div className="flex justify-between items-center border-b border-gray-200 py-3">
                <div>
                    <label className="block text-sm font-medium text-gray-700">Password</label>
                    <p className="text-sm text-gray-500">Change your password</p>
                </div>
                <button
                    onClick={() => setShowPasswordDialog(true)}
                    className="px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-800 border border-blue-600 rounded-md hover:bg-blue-50"
                >
                    Change Password
                </button>
            </div>

            <PasswordConfirmDialog
                isOpen={showAuthDialog}
                onClose={() => {
                    setShowAuthDialog(false);
                    setEmailDialogError("");
                }}
                onSubmit={handleEmailChange}
                isLoading={isSubmittingPassword}
                error={emailDialogError}
                title="Authentication Required"
                description="To change your email, please enter your current password."
                mode="email"
            />

            <PasswordConfirmDialog
                isOpen={showPasswordDialog}
                onClose={() => {
                    setShowPasswordDialog(false);
                    setPasswordChangeError("");
                    setPasswordChangeSuccess("");
                }}
                onSubmit={handlePasswordUpdate}
                isLoading={isUpdatingPassword}
                error={passwordChangeError}
                success={passwordChangeSuccess}
                title="Change Password"
                description="Enter your current and new password."
                submitLabel="Update Password"
                mode="password"
            />

            <hr className="border-gray-200" />

            <DangerZone onDelete={() => setShowDeleteDialog(true)} />
 
            {showDeleteDialog && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
                    <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full">
                        <h2 className="text-xl font-bold text-red-600 mb-2">Delete Account</h2>
                        <p className="text-gray-600 mb-4">
                            This action is <strong>permanent</strong> and cannot be undone. All your data will be erased.
                            Please enter your current password to confirm.
                        </p>
                        <div className="mb-4">
                            <label htmlFor="delete-password" className="block text-sm font-medium text-gray-700 mb-1">
                                Current Password
                            </label>
                            <input
                                id="delete-password"
                                type="password"
                                value={deletePassword}
                                onChange={(e) => setDeletePassword(e.target.value)}
                                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500"
                                placeholder="Enter your password"
                                disabled={isDeleting}
                            />
                            {deleteError && <p className="text-sm text-red-600 mt-1">{deleteError}</p>}
                        </div>
                        <div className="flex justify-end gap-3">
                            <button
                                onClick={() => {
                                    setShowDeleteDialog(false);
                                    setDeletePassword("");
                                    setDeleteError("");
                                }}
                                className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 border border-gray-300 rounded-md hover:bg-gray-50"
                                disabled={isDeleting}
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleDeleteAccount}
                                className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-md disabled:opacity-50"
                                disabled={isDeleting || !deletePassword}
                            >
                                {isDeleting ? "Deleting..." : "Delete Account"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}