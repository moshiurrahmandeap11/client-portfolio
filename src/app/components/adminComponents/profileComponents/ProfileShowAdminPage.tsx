"use client";

import React, { useEffect, useState } from "react";
import axiosInstance from "@/app/components/sharedComponents/AxiosInstance/AxiosInstance";
import Image from "next/image";
import Link from "next/link";
import { FiExternalLink, FiEdit, FiUser, FiFile, FiTrash2, FiCopy } from "react-icons/fi";
import Swal from "sweetalert2";

const ProfileShowAdminPage = () => {
    const [profile, setProfile] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [deleting, setDeleting] = useState<string | null>(null);

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            setLoading(true);
            const res = await axiosInstance.get("/profile");
            setProfile(res.data.data);
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    // Delete profile picture
    const handleDeleteProfilePicture = async () => {
        const result = await Swal.fire({
            title: "Delete Profile Picture?",
            text: "This will permanently remove your profile picture.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#ef4444",
            cancelButtonColor: "#64748b",
            confirmButtonText: "Yes, delete it!",
            cancelButtonText: "Cancel",
            background: "#1e293b",
            color: "#fff",
        });

        if (!result.isConfirmed) return;

        try {
            setDeleting("profilePicture");

            const formData = new FormData();
            // Send empty update to remove profile picture
            await axiosInstance.put("/profile/remove-picture", {});

            Swal.fire({
                icon: "success",
                title: "Deleted!",
                text: "Profile picture has been removed.",
                timer: 2000,
                showConfirmButton: false,
                background: "#1e293b",
                color: "#fff",
            });

            fetchProfile();
        } catch (error: any) {
            console.log(error);
            Swal.fire({
                icon: "error",
                title: "Error",
                text: error?.response?.data?.message || "Failed to delete profile picture.",
                background: "#1e293b",
                color: "#fff",
                confirmButtonColor: "#3b82f6",
            });
        } finally {
            setDeleting(null);
        }
    };

    // Delete resume
    const handleDeleteResume = async () => {
        const result = await Swal.fire({
            title: "Delete Resume?",
            text: "This will permanently remove your resume PDF.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#ef4444",
            cancelButtonColor: "#64748b",
            confirmButtonText: "Yes, delete it!",
            cancelButtonText: "Cancel",
            background: "#1e293b",
            color: "#fff",
        });

        if (!result.isConfirmed) return;

        try {
            setDeleting("resume");

            const formData = new FormData();
            await axiosInstance.put("/profile/remove-resume", {});

            Swal.fire({
                icon: "success",
                title: "Deleted!",
                text: "Resume has been removed.",
                timer: 2000,
                showConfirmButton: false,
                background: "#1e293b",
                color: "#fff",
            });

            fetchProfile();
        } catch (error: any) {
            console.log(error);
            Swal.fire({
                icon: "error",
                title: "Error",
                text: error?.response?.data?.message || "Failed to delete resume.",
                background: "#1e293b",
                color: "#fff",
                confirmButtonColor: "#3b82f6",
            });
        } finally {
            setDeleting(null);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-[#0b1120] flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-white" />
                    <p className="text-white/60 text-sm">Loading profile...</p>
                </div>
            </div>
        );
    }

    if (!profile) {
        return (
            <div className="min-h-screen bg-[#0b1120] flex items-center justify-center p-4">
                <div className="backdrop-blur-3xl bg-white/10 border border-white/15 rounded-4xl p-10 text-center max-w-md">
                    <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mx-auto mb-4">
                        <FiUser className="w-8 h-8 text-white/40" />
                    </div>
                    <h3 className="text-white text-lg font-semibold mb-2">No Profile Found</h3>
                    <p className="text-white/60 text-sm mb-6">Create your profile first.</p>
                    <Link href="/dashboard/update-profile">
                        <button className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm transition-all">
                            Create Profile
                        </button>
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#0b1120] relative overflow-hidden px-3 sm:px-4 md:px-6 lg:px-8 xl:px-10 py-6 md:py-8 lg:py-10">
            {/* Background Glow */}
            <div className="absolute top-0 left-0 w-125 h-125 bg-blue-500/20 blur-[120px] rounded-full" />
            <div className="absolute bottom-0 right-0 w-125 h-125 bg-purple-500/20 blur-[120px] rounded-full" />

            <div className="relative z-10 max-w-4xl mx-auto">
                {/* Header */}
                <div className="backdrop-blur-3xl bg-white/10 border border-white/15 rounded-3xl sm:rounded-[28px] md:rounded-4px p-4 sm:p-5 md:p-6 lg:p-8 mb-6 md:mb-8 shadow-[0_8px_40px_rgba(255,255,255,0.08)]">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div className="flex items-center gap-3 sm:gap-4">
                            <div className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-xl sm:rounded-2xl bg-linear-to-br from-blue-400/30 to-purple-500/30 border border-white/20 flex items-center justify-center shadow-lg shrink-0">
                                <FiUser className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 text-white" />
                            </div>
                            <div>
                                <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white tracking-tight">
                                    Profile
                                </h1>
                                <p className="text-xs sm:text-sm text-white/60 mt-1">
                                    Your profile picture & resume
                                </p>
                            </div>
                        </div>
                        <Link href="/dashboard/update-profile">
                            <button className="flex items-center gap-2 px-4 sm:px-5 py-2.5 sm:py-3 rounded-xl sm:rounded-2xl bg-amber-500/20 hover:bg-amber-500/30 border border-amber-400/20 text-amber-200 text-xs sm:text-sm transition-all">
                                <FiEdit className="w-4 h-4" />
                                Update Profile
                            </button>
                        </Link>
                    </div>
                </div>

                {/* Profile Content */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                    {/* Profile Picture Card */}
                    <div className="backdrop-blur-3xl bg-white/10 border border-white/15 rounded-3xl sm:rounded-[28px] md:rounded-4xl p-5 sm:p-6 md:p-8 shadow-[0_8px_40px_rgba(255,255,255,0.06)]">
                        <div className="flex items-center justify-between mb-5">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-blue-500/20 border border-blue-400/20 flex items-center justify-center">
                                    <FiUser className="w-5 h-5 text-blue-400" />
                                </div>
                                <h2 className="text-lg sm:text-xl font-semibold text-white">Profile Picture</h2>
                            </div>
                            {profile.profilePicture?.url && (
                                <button
                                    onClick={handleDeleteProfilePicture}
                                    disabled={deleting === "profilePicture"}
                                    className="w-8 h-8 rounded-lg bg-red-500/15 hover:bg-red-500/25 border border-red-400/20 flex items-center justify-center text-red-200 transition-all disabled:opacity-50"
                                    title="Delete profile picture"
                                >
                                    {deleting === "profilePicture" ? (
                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-200" />
                                    ) : (
                                        <FiTrash2 className="w-4 h-4" />
                                    )}
                                </button>
                            )}
                        </div>

                        {profile.profilePicture?.url ? (
                            <div className="space-y-4">
                                <div className="relative rounded-2xl overflow-hidden border border-white/10 group">
                                    <Image
                                        src={profile.profilePicture.url}
                                        alt="Profile Picture"
                                        width={400}
                                        height={400}
                                        className="w-full h-64 sm:h-72 object-cover"
                                    />
                                    <a
                                        href={profile.profilePicture.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                                    >
                                        <FiExternalLink className="w-8 h-8 text-white" />
                                    </a>
                                </div>
                                <a
                                    href={profile.profilePicture.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white/80 hover:text-white text-sm transition-all"
                                >
                                    <FiExternalLink className="w-4 h-4" />
                                    View Full Size
                                </a>
                            </div>
                        ) : (
                            <div className="text-center py-12">
                                <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mx-auto mb-3">
                                    <FiUser className="w-8 h-8 text-white/20" />
                                </div>
                                <p className="text-white/40 text-sm">No profile picture uploaded</p>
                            </div>
                        )}
                    </div>

                    {/* Resume Card */}
                    <div className="backdrop-blur-3xl bg-white/10 border border-white/15 rounded-3xl sm:rounded-[28px] md:rounded-4xl p-5 sm:p-6 md:p-8 shadow-[0_8px_40px_rgba(255,255,255,0.06)]">
                        <div className="flex items-center justify-between mb-5">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-green-500/20 border border-green-400/20 flex items-center justify-center">
                                    <FiFile className="w-5 h-5 text-green-400" />
                                </div>
                                <h2 className="text-lg sm:text-xl font-semibold text-white">Resume</h2>
                            </div>
                            {profile.resume?.url && (
                                <button
                                    onClick={handleDeleteResume}
                                    disabled={deleting === "resume"}
                                    className="w-8 h-8 rounded-lg bg-red-500/15 hover:bg-red-500/25 border border-red-400/20 flex items-center justify-center text-red-200 transition-all disabled:opacity-50"
                                    title="Delete resume link"
                                >
                                    {deleting === "resume" ? (
                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-200" />
                                    ) : (
                                        <FiTrash2 className="w-4 h-4" />
                                    )}
                                </button>
                            )}
                        </div>

                        {profile.resume?.url ? (
                            <div className="space-y-4">
                                {/* PDF Preview iframe for Google Drive links */}
                                {profile.resume.url.includes('drive.google.com') ? (
                                    <div className="rounded-2xl overflow-hidden border border-white/10">
                                        <iframe
                                            src={profile.resume.url.replace('/view?usp=sharing', '/preview').replace('/view?usp=drivesdk', '/preview')}
                                            className="w-full h-64 sm:h-72"
                                            allow="autoplay"
                                        />
                                    </div>
                                ) : (
                                    <div className="rounded-2xl bg-white/5 border border-white/10 p-6 text-center">
                                        <div className="w-16 h-16 rounded-xl bg-green-500/10 border border-green-400/20 flex items-center justify-center mx-auto mb-4">
                                            <FiFile className="w-8 h-8 text-green-400" />
                                        </div>
                                        <p className="text-white font-medium text-sm mb-1">
                                            Resume.pdf
                                        </p>
                                        <p className="text-white/40 text-xs">
                                            External Link
                                        </p>
                                    </div>
                                )}
                                <div className="flex flex-col sm:flex-row gap-3">
                                    <a
                                        href={profile.resume.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white/80 hover:text-white text-sm transition-all group"
                                    >
                                        <FiExternalLink className="w-4 h-4 group-hover:text-blue-400 transition-colors" />
                                        Open Resume
                                    </a>
                                    <button
                                        onClick={() => {
                                            navigator.clipboard.writeText(profile.resume.url);
                                            Swal.fire({
                                                icon: "success",
                                                title: "Copied!",
                                                text: "Resume link copied to clipboard.",
                                                timer: 1500,
                                                showConfirmButton: false,
                                                background: "#1e293b",
                                                color: "#fff",
                                            });
                                        }}
                                        className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-green-500/20 hover:bg-green-500/30 border border-green-400/20 text-green-200 text-sm transition-all"
                                    >
                                        <FiCopy className="w-4 h-4" />
                                        Copy Link
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="text-center py-12">
                                <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mx-auto mb-3">
                                    <FiFile className="w-8 h-8 text-white/20" />
                                </div>
                                <p className="text-white/40 text-sm">No resume link added</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfileShowAdminPage;