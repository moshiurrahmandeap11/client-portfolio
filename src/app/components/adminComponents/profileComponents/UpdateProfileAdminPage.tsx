"use client";

import React, { useState, useRef, useEffect } from "react";
import axiosInstance from "@/app/components/sharedComponents/AxiosInstance/AxiosInstance";
import Image from "next/image";
import Swal from "sweetalert2";
import { FiUpload, FiX, FiCheck, FiLink } from "react-icons/fi";

const UpdateProfileAdminPage = () => {
    const [loading, setLoading] = useState(false);
    const [fetchLoading, setFetchLoading] = useState(true);
    const [profilePicturePreview, setProfilePicturePreview] = useState<string | null>(null);
    const [resumeLink, setResumeLink] = useState("");
    const [existingProfile, setExistingProfile] = useState<any>(null);
    const profilePicRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        fetchExistingProfile();
    }, []);

    const fetchExistingProfile = async () => {
        try {
            const res = await axiosInstance.get("/profile");
            setExistingProfile(res.data.data);
            if (res.data.data?.profilePicture?.url) {
                setProfilePicturePreview(res.data.data.profilePicture.url);
            }
            if (res.data.data?.resume?.url) {
                setResumeLink(res.data.data.resume.url);
            }
        } catch {
            console.log("No existing profile");
        } finally {
            setFetchLoading(false);
        }
    };

    const handleProfilePicChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setProfilePicturePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const formData = new FormData();

        // Add profile picture
        if (profilePicRef.current?.files?.[0]) {
            formData.append("profilePicture", profilePicRef.current.files[0]);
        }

        // Add resume link
        if (resumeLink) {
            formData.append("resumeLink", resumeLink);
        }

        // Check if at least one field is changed
        if (!profilePicRef.current?.files?.[0] && !resumeLink) {
            Swal.fire({
                icon: "warning",
                title: "No Changes",
                text: "Please select a profile picture or enter a resume link.",
                background: "#1e293b",
                color: "#fff",
                confirmButtonColor: "#3b82f6",
            });
            return;
        }

        // Validate resume link if provided
        if (resumeLink && !resumeLink.match(/^https?:\/\/.+/)) {
            Swal.fire({
                icon: "warning",
                title: "Invalid Link",
                text: "Please enter a valid URL starting with http:// or https://",
                background: "#1e293b",
                color: "#fff",
                confirmButtonColor: "#3b82f6",
            });
            return;
        }

        try {
            setLoading(true);

            Swal.fire({
                title: "Updating Profile...",
                text: "Please wait while we update your profile",
                allowOutsideClick: false,
                didOpen: () => {
                    Swal.showLoading();
                },
                background: "#1e293b",
                color: "#fff",
            });

            let res;

            if (existingProfile) {
                res = await axiosInstance.put("/profile", formData, {
                    headers: { "Content-Type": "multipart/form-data" },
                });
            } else {
                res = await axiosInstance.post("/profile", formData, {
                    headers: { "Content-Type": "multipart/form-data" },
                });
            }

            console.log(res.data);

            Swal.fire({
                icon: "success",
                title: "Updated!",
                text: "Profile has been updated successfully.",
                timer: 2000,
                showConfirmButton: false,
                background: "#1e293b",
                color: "#fff",
            });

            fetchExistingProfile();

        } catch (error: any) {
            console.log(error);
            Swal.fire({
                icon: "error",
                title: "Error",
                text: error?.response?.data?.message || "Failed to update profile.",
                background: "#1e293b",
                color: "#fff",
                confirmButtonColor: "#3b82f6",
            });
        } finally {
            setLoading(false);
        }
    };

    if (fetchLoading) {
        return (
            <div className="min-h-screen bg-[#0b1120] flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-white" />
                    <p className="text-white/60 text-sm">Loading...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#0b1120] relative overflow-hidden px-3 sm:px-4 md:px-6 lg:px-8 xl:px-10 py-6 md:py-8 lg:py-10">
            <div className="absolute top-0 left-0 w-125 h-125 bg-blue-500/20 blur-[120px] rounded-full" />
            <div className="absolute bottom-0 right-0 w-125 h-125 bg-purple-500/20 blur-[120px] rounded-full" />

            <div className="relative z-10 max-w-2xl mx-auto">
                {/* Header */}
                <div className="backdrop-blur-3xl bg-white/10 border border-white/15 rounded-3xl sm:rounded-[28px] md:rounded-4xl p-4 sm:p-5 md:p-6 lg:p-8 mb-6 md:mb-8 shadow-[0_8px_40px_rgba(255,255,255,0.08)]">
                    <div className="flex items-center gap-3 sm:gap-4">
                        <div className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-xl sm:rounded-2xl bg-linear-to-br from-green-400/30 to-emerald-500/30 border border-white/20 flex items-center justify-center shadow-lg shrink-0">
                            <FiUpload className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 text-white" />
                        </div>
                        <div>
                            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white tracking-tight">
                                {existingProfile ? "Update Profile" : "Create Profile"}
                            </h1>
                            <p className="text-xs sm:text-sm text-white/60 mt-1">
                                Upload profile picture & add resume link
                            </p>
                        </div>
                    </div>
                </div>

                {/* Form */}
                <div className="backdrop-blur-3xl bg-white/10 border border-white/15 rounded-3xl sm:rounded-[28px] md:rounded-4xl p-5 sm:p-6 md:p-8 shadow-[0_8px_40px_rgba(255,255,255,0.06)]">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Profile Picture Upload */}
                        <div>
                            <label className="text-white text-sm sm:text-base font-medium mb-3 block">
                                Profile Picture
                            </label>
                            <input
                                ref={profilePicRef}
                                type="file"
                                accept="image/*"
                                onChange={handleProfilePicChange}
                                className="hidden"
                                id="profile-pic-input"
                            />
                            <div className="space-y-3">
                                <button
                                    type="button"
                                    onClick={() => profilePicRef.current?.click()}
                                    className="w-full h-12 sm:h-14 rounded-xl sm:rounded-2xl bg-white/10 border border-dashed border-white/20 text-white/60 hover:text-white hover:border-white/40 text-sm sm:text-base transition-all flex items-center justify-center gap-2"
                                >
                                    <FiUpload className="w-5 h-5" />
                                    {profilePicturePreview ? "Change Profile Picture" : "Upload Profile Picture"}
                                </button>

                                {profilePicturePreview && (
                                    <div className="relative rounded-2xl overflow-hidden border border-white/10">
                                        <Image
                                            src={profilePicturePreview}
                                            alt="Preview"
                                            width={400}
                                            height={400}
                                            className="w-full h-48 sm:h-56 object-cover"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setProfilePicturePreview(null);
                                                if (profilePicRef.current) profilePicRef.current.value = "";
                                            }}
                                            className="absolute top-2 right-2 w-8 h-8 rounded-lg bg-red-500/80 hover:bg-red-500 text-white flex items-center justify-center transition-colors"
                                        >
                                            <FiX className="w-4 h-4" />
                                        </button>
                                        {existingProfile?.profilePicture?.url && profilePicturePreview === existingProfile.profilePicture.url && (
                                            <div className="absolute top-2 left-2 px-2.5 py-1 rounded-lg bg-black/50 backdrop-blur-md border border-white/10 text-xs text-white/80">
                                                Current
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Resume Link Input */}
                        <div>
                            <label className="text-white text-sm sm:text-base font-medium mb-3 block">
                                Resume Link (Google Drive or any URL)
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                                    <FiLink className="w-5 h-5 text-white/40" />
                                </div>
                                <input
                                    type="url"
                                    value={resumeLink}
                                    onChange={(e) => setResumeLink(e.target.value)}
                                    placeholder="https://drive.google.com/file/d/..."
                                    className="w-full h-12 sm:h-14 pl-12 pr-4 rounded-xl sm:rounded-2xl bg-white/10 border border-white/10 text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-green-400/40 transition-all text-sm"
                                />
                            </div>
                            <p className="text-white/40 text-xs mt-2">
                                Upload your resume to Google Drive, make it public, and paste the shareable link here.
                            </p>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full h-12 sm:h-14 rounded-xl sm:rounded-2xl bg-linear-to-r from-green-500/30 to-emerald-500/30 border border-green-400/20 text-white hover:from-green-500/40 hover:to-emerald-500/40 text-sm sm:text-base transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 font-medium"
                        >
                            {loading ? (
                                <>
                                    <div className="animate-spin rounded-full h-4 w-4 sm:h-5 sm:w-5 border-b-2 border-white" />
                                    {existingProfile ? "Updating..." : "Creating..."}
                                </>
                            ) : (
                                <>
                                    <FiCheck className="w-4 h-4 sm:w-5 sm:h-5" />
                                    {existingProfile ? "Update Profile" : "Create Profile"}
                                </>
                            )}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default UpdateProfileAdminPage;