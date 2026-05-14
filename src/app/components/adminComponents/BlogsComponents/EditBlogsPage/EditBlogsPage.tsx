"use client";

import React, { useEffect, useState, useRef } from "react";
import { useParams } from "next/navigation";
import { RichTextEditor } from "richmoshiur";
import axiosInstance from "@/app/components/sharedComponents/AxiosInstance/AxiosInstance";
import Swal from "sweetalert2";
import Image from "next/image";

const EditBlogsPage = () => {
    const { id } = useParams();
    const [loading, setLoading] = useState(false);
    const [fetchLoading, setFetchLoading] = useState(true);
    const [blog, setBlog] = useState<any>(null);
    const [content, setContent] = useState<string>("");
    const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);
    const [mediaPreview, setMediaPreview] = useState<string | null>(null);
    const [mediaType, setMediaType] = useState<"image" | "video" | null>(null);
    const thumbnailRef = useRef<HTMLInputElement>(null);
    const mediaRef = useRef<HTMLInputElement>(null);
    const formRef = useRef<HTMLFormElement>(null);

    useEffect(() => {
        fetchBlog();
    }, [id]);

    const fetchBlog = async () => {
        try {
            setFetchLoading(true);
            const res = await axiosInstance.get(`/blogs/${id}`);
            const blogData = res.data.data;

            setBlog(blogData);
            setContent(blogData.content || "");

            // Set existing media previews
            if (blogData.thumbnail?.url) {
                setThumbnailPreview(blogData.thumbnail.url);
            }
            if (blogData.media?.url) {
                setMediaPreview(blogData.media.url);
                setMediaType(blogData.media.mediaType || (blogData.media.url.match(/\.(mp4|mov|avi|mkv|webm)$/i) ? "video" : "image"));
            }
        } catch (error: any) {
            console.log(error);
            Swal.fire({
                icon: "error",
                title: "Error",
                text: error?.response?.data?.message || "Failed to fetch blog details.",
                background: "#1e293b",
                color: "#fff",
                confirmButtonColor: "#3b82f6",
            });
        } finally {
            setFetchLoading(false);
        }
    };

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

    const handleUpdateBlog = async (e: React.FormEvent<HTMLFormElement>) => {
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

        // Confirmation before update
        const result = await Swal.fire({
            title: "Update Blog?",
            text: "Are you sure you want to update this blog?",
            icon: "question",
            showCancelButton: true,
            confirmButtonColor: "#10b981",
            cancelButtonColor: "#64748b",
            confirmButtonText: "Yes, update it!",
            cancelButtonText: "Cancel",
            background: "#1e293b",
            color: "#fff",
        });

        if (!result.isConfirmed) return;

        // Get the form element using ref
        const form = formRef.current;
        if (!form) {
            Swal.fire({
                icon: "error",
                title: "Error",
                text: "Form not found. Please refresh the page.",
                background: "#1e293b",
                color: "#fff",
                confirmButtonColor: "#3b82f6",
            });
            return;
        }

        const formData = new FormData(form);

        // Add rich text content to formData
        formData.set("content", content);

        try {
            setLoading(true);

            // Show loading alert
            Swal.fire({
                title: "Updating Blog...",
                text: "Please wait while we update your blog",
                allowOutsideClick: false,
                didOpen: () => {
                    Swal.showLoading();
                },
                background: "#1e293b",
                color: "#fff",
            });

            const res = await axiosInstance.put(`/blogs/${id}`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });

            console.log(res.data);

            // Success alert
            Swal.fire({
                icon: "success",
                title: "Updated!",
                text: "Blog has been updated successfully.",
                timer: 2000,
                showConfirmButton: false,
                background: "#1e293b",
                color: "#fff",
            });

        } catch (error: any) {
            console.log(error);

            // Error alert
            Swal.fire({
                icon: "error",
                title: "Error",
                text: error?.response?.data?.message || "Failed to update blog. Please try again.",
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
            <div className="min-h-screen flex items-center justify-center bg-[#0b1120] relative overflow-hidden">
                {/* Background Glow */}
                <div className="absolute top-0 left-0 w-125 h-125 bg-blue-500/20 blur-[120px] rounded-full" />
                <div className="absolute bottom-0 right-0 w-125 h-125 bg-purple-500/20 blur-[120px] rounded-full" />

                <div className="relative z-10 backdrop-blur-3xl bg-white/10 border border-white/20 rounded-3xl px-10 py-8 shadow-[0_8px_32px_rgba(255,255,255,0.1)]">
                    <div className="flex flex-col items-center gap-4">
                        <div className="relative">
                            <div className="w-14 h-14 rounded-full border-[3px] border-white/20"></div>
                            <div className="absolute inset-0 animate-spin rounded-full border-[3px] border-transparent border-t-white"></div>
                        </div>
                        <p className="text-white/80 text-sm tracking-wide">Loading blog details...</p>
                    </div>
                </div>
            </div>
        );
    }

    if (!blog) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#0b1120] relative overflow-hidden">
                {/* Background Glow */}
                <div className="absolute top-0 left-0 w-125 h-125 bg-blue-500/20 blur-[120px] rounded-full" />
                <div className="absolute bottom-0 right-0 w-125 h-125 bg-purple-500/20 blur-[120px] rounded-full" />

                <div className="relative z-10 backdrop-blur-3xl bg-white/10 border border-white/20 rounded-3xl px-10 py-8 shadow-[0_8px_32px_rgba(255,255,255,0.1)] text-center">
                    <div className="w-16 h-16 rounded-full bg-red-500/10 border border-red-400/20 flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8 text-red-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <h3 className="text-white font-semibold text-lg mb-2">Blog Not Found</h3>
                    <p className="text-white/60 text-sm">The blog you&apos;re looking for doesn&apos;t exist.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#0b1120] relative overflow-hidden px-3 sm:px-4 md:px-6 lg:px-8 xl:px-10 py-6 md:py-8 lg:py-10">
            {/* Background Glow */}
            <div className="absolute top-0 left-0 w-75 sm:w-100 md:w-125 h-75 sm:h-100 md:h-125 bg-green-500/20 blur-[120px] rounded-full" />
            <div className="absolute bottom-0 right-0 w-75 sm:w-100 md:w-125 h-75 sm:h-100 md:h-125 bg-emerald-500/20 blur-[120px] rounded-full" />

            <div className="relative z-10 max-w-4xl mx-auto">
                {/* Header */}
                <div className="backdrop-blur-3xl bg-white/10 border border-white/15 rounded-3xl sm:rounded-[28px] md:rounded-4xl p-4 sm:p-5 md:p-6 lg:p-8 mb-6 md:mb-8 shadow-[0_8px_40px_rgba(255,255,255,0.08)]">
                    <div className="flex items-center gap-3 sm:gap-4">
                        <div className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-xl sm:rounded-2xl bg-linear-to-br from-green-400/30 to-emerald-500/30 border border-white/20 flex items-center justify-center shadow-lg shrink-0">
                            <svg className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                        </div>
                        <div className="min-w-0">
                            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white tracking-tight truncate">
                                Edit Blog
                            </h1>
                            <p className="text-xs sm:text-sm text-white/60 mt-1">
                                Update your blog content & media
                            </p>
                        </div>
                    </div>
                </div>

                {/* Form Container */}
                <div className="backdrop-blur-3xl bg-white/10 border border-white/15 rounded-3xl sm:rounded-[28px] md:rounded-4xl p-4 sm:p-5 md:p-6 lg:p-8 shadow-[0_8px_40px_rgba(255,255,255,0.06)]">
                    <form ref={formRef} onSubmit={handleUpdateBlog} className="space-y-5 sm:space-y-6">
                        {/* Title */}
                        <div>
                            <label className="text-white text-sm sm:text-base font-medium mb-2 block">
                                Blog Title <span className="text-red-400">*</span>
                            </label>
                            <input
                                type="text"
                                name="title"
                                defaultValue={blog.title}
                                required
                                placeholder="Enter blog title..."
                                className="w-full h-12 sm:h-14 px-4 sm:px-5 rounded-xl sm:rounded-2xl bg-white/10 border border-white/10 text-white text-sm sm:text-base placeholder:text-white/40 outline-none focus:ring-2 focus:ring-green-400/40 transition-all"
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
                                defaultValue={blog.author}
                                required
                                placeholder="Enter author name..."
                                className="w-full h-12 sm:h-14 px-4 sm:px-5 rounded-xl sm:rounded-2xl bg-white/10 border border-white/10 text-white text-sm sm:text-base placeholder:text-white/40 outline-none focus:ring-2 focus:ring-green-400/40 transition-all"
                            />
                        </div>

                        {/* Short Description */}
                        <div>
                            <label className="text-white text-sm sm:text-base font-medium mb-2 block">
                                Short Description
                            </label>
                            <textarea
                                name="description"
                                rows={3}
                                defaultValue={blog.description}
                                placeholder="Write a brief description..."
                                className="w-full p-4 sm:p-5 rounded-xl sm:rounded-2xl bg-white/10 border border-white/10 text-white text-sm sm:text-base placeholder:text-white/40 outline-none focus:ring-2 focus:ring-green-400/40 transition-all resize-none"
                            />
                        </div>

                        {/* Rich Text Editor - Content */}
                        <div>
                            <label className="text-white text-sm sm:text-base font-medium mb-2 block">
                                Blog Content <span className="text-red-400">*</span>
                            </label>
                            <div className="richmoshiur-editor-wrapper rounded-xl sm:rounded-2xl overflow-hidden border border-white/10 focus-within:ring-2 focus-within:ring-green-400/40 transition-all bg-white/5">
                                <RichTextEditor
                                    value={content}
                                    onChange={handleContentChange}
                                    placeholder="Write your blog content here..."
                                />
                            </div>
                            {content && (
                                <div className="mt-2 flex items-center gap-2">
                                    <span className="text-xs text-white/40">
                                        {content.replace(/<[^>]*>/g, '').length} characters
                                    </span>
                                    <span className="text-white/20">•</span>
                                    <span className="text-xs text-white/40">
                                        HTML content
                                    </span>
                                </div>
                            )}
                        </div>

                        {/* Thumbnail Upload */}
                        <div>
                            <label className="text-white text-sm sm:text-base font-medium mb-2 block">
                                Change Thumbnail
                            </label>
                            <div className="space-y-3">
                                <input
                                    ref={thumbnailRef}
                                    type="file"
                                    name="thumbnail"
                                    accept="image/*"
                                    onChange={handleThumbnailChange}
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
                                    {thumbnailPreview ? "Change Thumbnail" : "Upload New Thumbnail"}
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
                                        <div className="absolute top-2 left-2">
                                            <span className="px-2.5 py-1 rounded-lg bg-black/50 backdrop-blur-md border border-white/10 text-xs text-white/80">
                                                {thumbnailPreview.startsWith('data:') ? 'New' : 'Current'} Thumbnail
                                            </span>
                                        </div>
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
                                Change Media
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
                                    {mediaPreview ? "Change Media" : "Upload New Media"}
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
                                        <div className="absolute top-2 left-2">
                                            <span className="px-2.5 py-1 rounded-lg bg-black/50 backdrop-blur-md border border-white/10 text-xs text-white/80">
                                                {mediaPreview.startsWith('data:') ? 'New' : 'Current'} {mediaType === "video" ? 'Video' : 'Image'}
                                            </span>
                                        </div>
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

                        {/* Blog Info */}
                        <div className="rounded-xl sm:rounded-2xl bg-white/5 border border-white/10 p-4 sm:p-5">
                            <h3 className="text-white text-sm font-medium mb-3">Blog Information</h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs sm:text-sm">
                                <div>
                                    <span className="text-white/40">Blog ID:</span>
                                    <p className="text-white/80 font-mono text-xs mt-0.5 break-all">{blog._id}</p>
                                </div>
                                <div>
                                    <span className="text-white/40">Created:</span>
                                    <p className="text-white/80 mt-0.5">
                                        {new Date(blog.createdAt).toLocaleDateString('en-US', {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric',
                                            hour: '2-digit',
                                            minute: '2-digit'
                                        })}
                                    </p>
                                </div>
                                {blog.updatedAt !== blog.createdAt && (
                                    <div className="sm:col-span-2">
                                        <span className="text-white/40">Last Updated:</span>
                                        <p className="text-white/80 mt-0.5">
                                            {new Date(blog.updatedAt).toLocaleDateString('en-US', {
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric',
                                                hour: '2-digit',
                                                minute: '2-digit'
                                            })}
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-2">
                            <button
                                type="button"
                                onClick={() => window.history.back()}
                                className="flex-1 h-12 sm:h-14 rounded-xl sm:rounded-2xl bg-white/5 border border-white/10 text-white/60 hover:text-white hover:bg-white/10 text-sm sm:text-base transition-all duration-300 flex items-center justify-center gap-2"
                            >
                                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                                </svg>
                                Back
                            </button>

                            <button
                                type="submit"
                                disabled={loading}
                                className="flex-2 h-12 sm:h-14 rounded-xl sm:rounded-2xl bg-linear-to-r from-green-500/30 to-emerald-500/30 border border-green-400/20 text-white hover:from-green-500/40 hover:to-emerald-500/40 text-sm sm:text-base transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 font-medium"
                            >
                                {loading ? (
                                    <>
                                        <div className="animate-spin rounded-full h-4 w-4 sm:h-5 sm:w-5 border-b-2 border-white"></div>
                                        Updating Blog...
                                    </>
                                ) : (
                                    <>
                                        <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                        </svg>
                                        Update Blog
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
                    color: #10b981;
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

export default EditBlogsPage;