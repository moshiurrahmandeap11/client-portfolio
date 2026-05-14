"use client";

import axiosInstance from "@/app/components/sharedComponents/AxiosInstance/AxiosInstance";
import Image from "next/image";
import React, { useState, useRef } from "react";
import { RichTextEditor } from "richmoshiur";
import Swal from "sweetalert2";

const CreateBlogsPage = () => {
    const [loading, setLoading] = useState(false);
    const [content, setContent] = useState<string>("");
    const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);
    const [mediaPreview, setMediaPreview] = useState<string | null>(null);
    const [mediaType, setMediaType] = useState<"image" | "video" | null>(null);
    const thumbnailRef = useRef<HTMLInputElement>(null);
    const mediaRef = useRef<HTMLInputElement>(null);

    // Handle content change from RichTextEditor
    const handleContentChange = (newContent: string) => {
        setContent(newContent);
    };

    // Handle thumbnail preview
    const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setThumbnailPreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    // Handle media preview
    const handleMediaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setMediaPreview(reader.result as string);
                if (file.type.startsWith("video/")) {
                    setMediaType("video");
                } else {
                    setMediaType("image");
                }
            };
            reader.readAsDataURL(file);
        }
    };

    const handleCreateBlog = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        // Validate content
        if (!content || content === "<p><br></p>" || content === "<p></p>") {
            Swal.fire({
                icon: "warning",
                title: "Content Required",
                text: "Please add some content to your blog.",
                background: "#1e293b",
                color: "#fff",
                confirmButtonColor: "#3b82f6",
            });
            return;
        }

        const form = e.currentTarget;
        const formData = new FormData(form);

        // Add rich text content to formData
        formData.set("content", content);

        try {
            setLoading(true);

            // Show loading alert
            Swal.fire({
                title: "Creating Blog...",
                text: "Please wait while we publish your blog",
                allowOutsideClick: false,
                didOpen: () => {
                    Swal.showLoading();
                },
                background: "#1e293b",
                color: "#fff",
            });

            const res = await axiosInstance.post("/blogs", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });

            console.log(res.data);

            // Success alert
            Swal.fire({
                icon: "success",
                title: "Success!",
                text: "Blog created successfully!",
                timer: 2000,
                showConfirmButton: false,
                background: "#1e293b",
                color: "#fff",
            });

            // Reset form
            form.reset();
            setContent("");
            setThumbnailPreview(null);
            setMediaPreview(null);
            setMediaType(null);

        } catch (error: any) {
            console.log(error);

            // Error alert
            Swal.fire({
                icon: "error",
                title: "Error",
                text: error?.response?.data?.message || "Failed to create blog. Please try again.",
                background: "#1e293b",
                color: "#fff",
                confirmButtonColor: "#3b82f6",
            });
        } finally {
            setLoading(false);
        }
    };

    const handleReset = () => {
        Swal.fire({
            title: "Reset Form?",
            text: "All entered data will be lost.",
            icon: "question",
            showCancelButton: true,
            confirmButtonColor: "#3b82f6",
            cancelButtonColor: "#64748b",
            confirmButtonText: "Yes, reset it!",
            cancelButtonText: "Cancel",
            background: "#1e293b",
            color: "#fff",
        }).then((result) => {
            if (result.isConfirmed) {
                setContent("");
                setThumbnailPreview(null);
                setMediaPreview(null);
                setMediaType(null);
                const form = document.querySelector("form");
                if (form) form.reset();

                Swal.fire({
                    icon: "success",
                    title: "Reset!",
                    text: "Form has been reset successfully.",
                    timer: 1500,
                    showConfirmButton: false,
                    background: "#1e293b",
                    color: "#fff",
                });
            }
        });
    };

    return (
        <div className="min-h-screen bg-[#0b1120] relative overflow-hidden px-3 sm:px-4 md:px-6 lg:px-8 xl:px-10 py-6 md:py-8 lg:py-10">
            {/* Background Glow */}
            <div className="absolute top-0 left-0 w-75 sm:w-100 md:w-125 h-75 sm:h-100 md:h-125 bg-blue-500/20 blur-[120px] rounded-full" />
            <div className="absolute bottom-0 right-0 w-75 sm:w-100 md:w-125 h-75 sm:h-100 md:h-125 bg-purple-500/20 blur-[120px] rounded-full" />

            <div className="relative z-10 max-w-4xl mx-auto">
                {/* Header */}
                <div className="backdrop-blur-3xl bg-white/10 border border-white/15 rounded-3xl sm:rounded-[28px] md:rounded-4xl p-4 sm:p-5 md:p-6 lg:p-8 mb-6 md:mb-8 shadow-[0_8px_40px_rgba(255,255,255,0.08)]">
                    <div className="flex items-center gap-3 sm:gap-4">
                        <div className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-xl sm:rounded-2xl bg-linear-to-br from-blue-400/30 to-purple-500/30 border border-white/20 flex items-center justify-center shadow-lg shrink-0">
                            <svg className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                            </svg>
                        </div>
                        <div>
                            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white tracking-tight">
                                Create Blog
                            </h1>
                            <p className="text-xs sm:text-sm text-white/60 mt-1">
                                Publish a new blog with rich content & media
                            </p>
                        </div>
                    </div>
                </div>

                {/* Form Container */}
                <div className="backdrop-blur-3xl bg-white/10 border border-white/15 rounded-3xl sm:rounded-[28px] md:rounded-4xl p-4 sm:p-5 md:p-6 lg:p-8 shadow-[0_8px_40px_rgba(255,255,255,0.06)]">
                    <form onSubmit={handleCreateBlog} className="space-y-5 sm:space-y-6">
                        {/* Title */}
                        <div>
                            <label className="text-white text-sm sm:text-base font-medium mb-2 block">
                                Blog Title <span className="text-red-400">*</span>
                            </label>
                            <input
                                type="text"
                                name="title"
                                placeholder="Enter blog title..."
                                required
                                className="w-full h-12 sm:h-14 px-4 sm:px-5 rounded-xl sm:rounded-2xl bg-white/10 border border-white/10 text-white text-sm sm:text-base placeholder:text-white/40 outline-none focus:ring-2 focus:ring-blue-400/40 transition-all"
                            />
                        </div>

                        {/* Author */}
                        <div>
                            <label className="text-white text-sm sm:text-base font-medium mb-2 block">
                                Author Name <span className="text-red-400">*</span>
                            </label>
                            <input
                                type="text"
                                name="author"
                                placeholder="Enter author name..."
                                required
                                className="w-full h-12 sm:h-14 px-4 sm:px-5 rounded-xl sm:rounded-2xl bg-white/10 border border-white/10 text-white text-sm sm:text-base placeholder:text-white/40 outline-none focus:ring-2 focus:ring-blue-400/40 transition-all"
                            />
                        </div>

                        {/* Short Description */}
                        <div>
                            <label className="text-white text-sm sm:text-base font-medium mb-2 block">
                                Short Description
                            </label>
                            <textarea
                                name="description"
                                placeholder="Write a brief description..."
                                rows={3}
                                className="w-full p-4 sm:p-5 rounded-xl sm:rounded-2xl bg-white/10 border border-white/10 text-white text-sm sm:text-base placeholder:text-white/40 outline-none focus:ring-2 focus:ring-blue-400/40 transition-all resize-none"
                            />
                        </div>

                        {/* Rich Text Editor - Content */}
                        <div>
                            <label className="text-white text-sm sm:text-base font-medium mb-2 block">
                                Blog Content <span className="text-red-400">*</span>
                            </label>
                            <div className="richmoshiur-editor-wrapper rounded-xl sm:rounded-2xl overflow-hidden border border-white/10 focus-within:ring-2 focus-within:ring-blue-400/40 transition-all bg-white/5">
                                <RichTextEditor
                                    value={content}
                                    onChange={handleContentChange}
                                    placeholder="Write your blog content here..."
                                />
                            </div>
                            {/* Content Preview (Optional) */}
                            {content && (
                                <div className="mt-2 flex items-center gap-2">
                                    <span className="text-xs text-white/40">
                                        {content.replace(/<[^>]*>/g, '').length} characters
                                    </span>
                                    <span className="text-white/20">•</span>
                                    <span className="text-xs text-white/40">
                                        HTML content added
                                    </span>
                                </div>
                            )}
                        </div>

                        {/* Thumbnail Upload */}
                        <div>
                            <label className="text-white text-sm sm:text-base font-medium mb-2 block">
                                Thumbnail <span className="text-red-400">*</span>
                            </label>
                            <div className="space-y-3">
                                <input
                                    ref={thumbnailRef}
                                    type="file"
                                    name="thumbnail"
                                    accept="image/*"
                                    onChange={handleThumbnailChange}
                                    required
                                    className="hidden"
                                    id="thumbnail-input"
                                />
                                <button
                                    type="button"
                                    onClick={() => thumbnailRef.current?.click()}
                                    className="w-full h-12 sm:h-14 rounded-xl sm:rounded-2xl bg-white/10 border border-dashed border-white/20 text-white/60 hover:text-white hover:border-white/40 text-sm sm:text-base transition-all duration-300 flex items-center justify-center gap-2"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                    {thumbnailPreview ? "Change Thumbnail" : "Upload Thumbnail"}
                                </button>

                                {thumbnailPreview && (
                                    <div className="relative rounded-xl sm:rounded-2xl overflow-hidden border border-white/10 group">
                                        <Image
                                            src={thumbnailPreview}
                                            alt="Thumbnail preview"
                                              width={1920}
  height={1080}
  quality={100}
  priority
                                            className="w-full h-50 sm:h-62.5 object-cover"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setThumbnailPreview(null);
                                                if (thumbnailRef.current) {
                                                    thumbnailRef.current.value = "";
                                                }
                                            }}
                                            className="absolute top-2 right-2 w-8 h-8 rounded-lg bg-red-500/80 hover:bg-red-500 text-white flex items-center justify-center transition-all opacity-0 group-hover:opacity-100"
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                            </svg>
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Media Upload */}
                        <div>
                            <label className="text-white text-sm sm:text-base font-medium mb-2 block">
                                Media (Image/Video)
                            </label>
                            <div className="space-y-3">
                                <input
                                    ref={mediaRef}
                                    type="file"
                                    name="media"
                                    accept="image/*,video/*"
                                    onChange={handleMediaChange}
                                    className="hidden"
                                    id="media-input"
                                />
                                <button
                                    type="button"
                                    onClick={() => mediaRef.current?.click()}
                                    className="w-full h-12 sm:h-14 rounded-xl sm:rounded-2xl bg-white/10 border border-dashed border-white/20 text-white/60 hover:text-white hover:border-white/40 text-sm sm:text-base transition-all duration-300 flex items-center justify-center gap-2"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" />
                                    </svg>
                                    {mediaPreview ? "Change Media" : "Upload Media (Optional)"}
                                </button>

                                {mediaPreview && (
                                    <div className="relative rounded-xl sm:rounded-2xl overflow-hidden border border-white/10 group">
                                        {mediaType === "video" ? (
                                            <video
                                                src={mediaPreview}
                                                controls
                                                className="w-full h-50 sm:h-62.5 object-cover"
                                            />
                                        ) : (
                                            <Image
                                                src={mediaPreview}
                                                alt="Media preview"
                                                width={1920}
                                                height={1080}
                                                quality={100}
                                                priority
                                                className="w-full h-50 sm:h-62.5 object-cover"
                                            />
                                        )}
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setMediaPreview(null);
                                                setMediaType(null);
                                                if (mediaRef.current) {
                                                    mediaRef.current.value = "";
                                                }
                                            }}
                                            className="absolute top-2 right-2 w-8 h-8 rounded-lg bg-red-500/80 hover:bg-red-500 text-white flex items-center justify-center transition-all opacity-0 group-hover:opacity-100"
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                            </svg>
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-2">
                            <button
                                type="button"
                                onClick={handleReset}
                                className="flex-1 h-12 sm:h-14 rounded-xl sm:rounded-2xl bg-white/5 border border-white/10 text-white/60 hover:text-white hover:bg-white/10 text-sm sm:text-base transition-all duration-300 flex items-center justify-center gap-2"
                            >
                                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                                Reset Form
                            </button>

                            <button
                                type="submit"
                                disabled={loading}
                                className="flex-2 h-12 sm:h-14 rounded-xl sm:rounded-2xl bg-linear-to-r from-blue-500/30 to-purple-500/30 border border-blue-400/20 text-white hover:from-blue-500/40 hover:to-purple-500/40 text-sm sm:text-base transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 font-medium"
                            >
                                {loading ? (
                                    <>
                                        <div className="animate-spin rounded-full h-4 w-4 sm:h-5 sm:w-5 border-b-2 border-white"></div>
                                        Creating Blog...
                                    </>
                                ) : (
                                    <>
                                        <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                                        </svg>
                                        Publish Blog
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            {/* Custom styles for richmoshiur editor */}
            <style jsx global>{`
                .richmoshiur-editor-wrapper {
                    min-height: 300px;
                }
                
                .richmoshiur-editor-wrapper [contenteditable] {
                    min-height: 300px;
                    padding: 1rem;
                    color: white;
                    font-size: 0.875rem;
                    outline: none;
                }
                
                .richmoshiur-editor-wrapper [contenteditable]:empty::before {
                    content: attr(data-placeholder);
                    color: rgba(255, 255, 255, 0.4);
                    pointer-events: none;
                }
                
                .richmoshiur-editor-wrapper .toolbar {
                    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
                    background: rgba(255, 255, 255, 0.05);
                    padding: 0.5rem;
                    border-radius: 0.75rem 0.75rem 0 0;
                }
                
                .richmoshiur-editor-wrapper button {
                    color: rgba(255, 255, 255, 0.7);
                    transition: all 0.2s;
                }
                
                .richmoshiur-editor-wrapper button:hover,
                .richmoshiur-editor-wrapper button.active {
                    color: #60a5fa;
                }
                
                @media (max-width: 640px) {
                    .richmoshiur-editor-wrapper [contenteditable] {
                        min-height: 250px;
                        padding: 0.75rem;
                        font-size: 0.8125rem;
                    }
                }
            `}</style>
        </div>
    );
};

export default CreateBlogsPage;