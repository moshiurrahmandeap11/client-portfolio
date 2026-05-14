"use client";

import React, { useEffect, useState } from "react";
import axiosInstance from "../../sharedComponents/AxiosInstance/AxiosInstance";
import Link from "next/link";
import Swal from "sweetalert2";
import Image from "next/image";

interface Blog {
    _id: string;
    title: string;
    content: string;
    description: string;
    author: string;
    thumbnail?: {
        url: string;
    };
    media?: {
        url: string;
        mediaType: string;
    };
    createdAt: string;
}

const AllBlogsAdminPage = () => {
    const [blogs, setBlogs] = useState<Blog[]>([]);
    const [loading, setLoading] = useState(true);
    const [deleting, setDeleting] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [sortOrder, setSortOrder] = useState<"newest" | "oldest">("newest");

    useEffect(() => {
        fetchBlogs();
    }, []);

    const fetchBlogs = async () => {
        try {
            setLoading(true);
            const res = await axiosInstance.get("/blogs");
            setBlogs(res.data.data);
        } catch (error) {
            console.log(error);
            Swal.fire({
                icon: "error",
                title: "Error",
                text: "Failed to fetch blogs. Please try again.",
                background: "#1e293b",
                color: "#fff",
                confirmButtonColor: "#3b82f6",
            });
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string, title: string) => {
        const result = await Swal.fire({
            title: "Are you sure?",
            html: `You are about to delete <b>"${title}"</b>. This action cannot be undone.`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#ef4444",
            cancelButtonColor: "#64748b",
            confirmButtonText: "Yes, delete it!",
            cancelButtonText: "Cancel",
            background: "#1e293b",
            color: "#fff",
            customClass: {
                popup: "rounded-3xl",
                confirmButton: "rounded-xl px-6 py-2.5",
                cancelButton: "rounded-xl px-6 py-2.5",
            },
        });

        if (!result.isConfirmed) return;

        try {
            setDeleting(id);
            await axiosInstance.delete(`/blogs/${id}`);

            setBlogs((prev) => prev.filter((blog) => blog._id !== id));

            Swal.fire({
                icon: "success",
                title: "Deleted!",
                text: "The blog has been deleted successfully.",
                timer: 2000,
                showConfirmButton: false,
                background: "#1e293b",
                color: "#fff",
            });
        } catch (error) {
            console.log(error);
            Swal.fire({
                icon: "error",
                title: "Error",
                text: "Failed to delete blog. Please try again.",
                background: "#1e293b",
                color: "#fff",
                confirmButtonColor: "#3b82f6",
            });
        } finally {
            setDeleting(null);
        }
    };

    const handleDeleteAll = async () => {
        if (blogs.length === 0) {
            Swal.fire({
                icon: "info",
                title: "No Blogs",
                text: "There are no blogs to delete.",
                background: "#1e293b",
                color: "#fff",
                confirmButtonColor: "#3b82f6",
            });
            return;
        }

        const result = await Swal.fire({
            title: "Delete All Blogs?",
            html: `You are about to delete <b>${blogs.length} blogs</b>. This action cannot be undone.`,
            icon: "error",
            showCancelButton: true,
            confirmButtonColor: "#ef4444",
            cancelButtonColor: "#64748b",
            confirmButtonText: "Yes, delete all!",
            cancelButtonText: "Cancel",
            background: "#1e293b",
            color: "#fff",
            input: "text",
            inputPlaceholder: "Type DELETE to confirm",
            inputValidator: (value) => {
                if (value !== "DELETE") {
                    return "Please type DELETE to confirm!";
                }
            },
        });

        if (!result.isConfirmed) return;

        try {
            setLoading(true);
            const deletePromises = blogs.map((blog) =>
                axiosInstance.delete(`/blogs/${blog._id}`)
            );
            await Promise.all(deletePromises);
            setBlogs([]);

            Swal.fire({
                icon: "success",
                title: "All Deleted!",
                text: "All blogs have been deleted successfully.",
                timer: 2000,
                showConfirmButton: false,
                background: "#1e293b",
                color: "#fff",
            });
        } catch (error) {
            console.log(error);
            Swal.fire({
                icon: "error",
                title: "Error",
                text: "Failed to delete blogs. Please try again.",
                background: "#1e293b",
                color: "#fff",
                confirmButtonColor: "#3b82f6",
            });
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
        });
    };

    // Filter and sort blogs
    const filteredAndSortedBlogs = blogs
        .filter((blog) => {
            if (!searchTerm) return true;
            const search = searchTerm.toLowerCase();
            return (
                blog.title.toLowerCase().includes(search) ||
                blog.author.toLowerCase().includes(search) ||
                blog.description.toLowerCase().includes(search)
            );
        })
        .sort((a, b) => {
            if (sortOrder === "newest") {
                return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
            } else {
                return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
            }
        });

    if (loading) {
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
                        <p className="text-white/80 text-sm tracking-wide">Loading blogs...</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#0b1120] relative overflow-hidden px-3 sm:px-4 md:px-6 lg:px-8 xl:px-10 py-6 md:py-8 lg:py-10">
            {/* Background Glow */}
            <div className="absolute top-0 left-0 w-75 sm:w-100 md:w-125 h-75 sm:h-100 md:h-125 bg-blue-500/20 blur-[120px] rounded-full" />
            <div className="absolute bottom-0 right-0 w-75 sm:w-100 md:w-125 h-75 sm:h-100 md:h-125 bg-purple-500/20 blur-[120px] rounded-full" />

            <div className="relative z-10 max-w-7xl mx-auto">
                {/* Header */}
                <div className="backdrop-blur-3xl bg-white/10 border border-white/15 rounded-3xl sm:rounded-[28px] md:rounded-4xl p-4 sm:p-5 md:p-6 lg:p-8 mb-6 md:mb-8 shadow-[0_8px_40px_rgba(255,255,255,0.08)]">
                    <div className="flex flex-col gap-4">
                        {/* Top Row */}
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
                            <div>
                                <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white tracking-tight">
                                    All Blogs
                                </h1>
                                <p className="text-xs sm:text-sm text-white/60 mt-1 sm:mt-2">
                                    {blogs.length} blog{blogs.length !== 1 ? "s" : ""} total
                                </p>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                                {/* Refresh */}
                                <button
                                    onClick={fetchBlogs}
                                    className="group flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 md:px-5 py-2 sm:py-2.5 md:py-3 rounded-xl sm:rounded-2xl bg-white/10 hover:bg-white/20 border border-white/10 text-white text-xs sm:text-sm transition-all duration-300"
                                >
                                    <svg
                                        className="w-3.5 h-3.5 sm:w-4 sm:h-4 group-hover:rotate-180 transition-transform duration-500"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                                        />
                                    </svg>
                                    <span className="hidden sm:inline">Refresh</span>
                                </button>

                                {/* Create Blog */}
                                <Link href="/dashboard/create-blog">
                                    <button className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 md:px-5 py-2 sm:py-2.5 md:py-3 rounded-xl sm:rounded-2xl bg-blue-500/20 hover:bg-blue-500/30 border border-blue-400/20 text-white text-xs sm:text-sm transition-all duration-300">
                                        <svg
                                            className="w-3.5 h-3.5 sm:w-4 sm:h-4"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth="2"
                                                d="M12 4v16m8-8H4"
                                            />
                                        </svg>
                                        <span className="hidden sm:inline">Create Blog</span>
                                        <span className="sm:hidden">New</span>
                                    </button>
                                </Link>

                                {/* Delete All */}
                                {blogs.length > 0 && (
                                    <button
                                        onClick={handleDeleteAll}
                                        disabled={loading}
                                        className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 md:px-5 py-2 sm:py-2.5 md:py-3 rounded-xl sm:rounded-2xl bg-red-500/15 hover:bg-red-500/25 border border-red-400/20 text-red-200 text-xs sm:text-sm transition-all duration-300 disabled:opacity-50"
                                    >
                                        <svg
                                            className="w-3.5 h-3.5 sm:w-4 sm:h-4"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth="2"
                                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                            />
                                        </svg>
                                        <span className="hidden sm:inline">Delete All</span>
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Search & Sort */}
                {blogs.length > 0 && (
                    <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-6 md:mb-8">
                        {/* Search */}
                        <div className="relative flex-1">
                            <div className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2">
                                <svg
                                    className="w-4 h-4 sm:w-5 sm:h-5 text-white/40"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                                    />
                                </svg>
                            </div>
                            <input
                                type="text"
                                placeholder="Search blogs..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full h-12 sm:h-14 pl-9 sm:pl-12 pr-4 sm:pr-5 rounded-xl sm:rounded-2xl bg-white/10 border border-white/10 backdrop-blur-2xl text-white text-sm sm:text-base placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-blue-400/40 transition-all"
                            />
                            {searchTerm && (
                                <button
                                    onClick={() => setSearchTerm("")}
                                    className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/60 transition-colors"
                                >
                                    <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            )}
                        </div>

                        {/* Sort */}
                        <select
                            value={sortOrder}
                            onChange={(e) => setSortOrder(e.target.value as "newest" | "oldest")}
                            className="h-12 sm:h-14 px-4 sm:px-5 rounded-xl sm:rounded-2xl bg-white/10 border border-white/10 backdrop-blur-2xl text-white text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-400/40 cursor-pointer"
                        >
                            <option className="bg-[#111827]" value="newest">Newest First</option>
                            <option className="bg-[#111827]" value="oldest">Oldest First</option>
                        </select>
                    </div>
                )}

                {/* Empty State */}
                {filteredAndSortedBlogs.length === 0 ? (
                    <div className="backdrop-blur-3xl bg-white/10 border border-white/15 rounded-3xl sm:rounded-[28px] md:rounded-4xl p-8 sm:p-10 md:p-14 text-center shadow-2xl">
                        {searchTerm ? (
                            <>
                                <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mx-auto mb-4 sm:mb-6">
                                    <svg className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 text-white/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                    </svg>
                                </div>
                                <h3 className="text-lg sm:text-xl md:text-2xl font-semibold text-white mb-2">No Results Found</h3>
                                <p className="text-white/60 text-xs sm:text-sm">No blogs match your search criteria.</p>
                                <button
                                    onClick={() => setSearchTerm("")}
                                    className="mt-4 sm:mt-5 px-4 sm:px-5 py-2 sm:py-2.5 rounded-xl sm:rounded-2xl bg-white/10 hover:bg-white/20 border border-white/10 text-white text-xs sm:text-sm transition-all duration-300"
                                >
                                    Clear Search
                                </button>
                            </>
                        ) : (
                            <>
                                <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mx-auto mb-4 sm:mb-6">
                                    <svg className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 text-white/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                                    </svg>
                                </div>
                                <h3 className="text-lg sm:text-xl md:text-2xl font-semibold text-white mb-2">No Blogs Yet</h3>
                                <p className="text-white/60 text-xs sm:text-sm mb-4 sm:mb-6">Create your first blog post to get started.</p>
                                <Link href="/dashboard/create-blog">
                                    <button className="px-5 sm:px-6 py-2.5 sm:py-3 rounded-xl sm:rounded-2xl bg-blue-500/20 hover:bg-blue-500/30 border border-blue-400/20 text-white text-sm transition-all duration-300">
                                        + Create Blog
                                    </button>
                                </Link>
                            </>
                        )}
                    </div>
                ) : (
                    <>
                        {/* Blog Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-5 md:gap-6">
                            {filteredAndSortedBlogs.map((blog) => (
                                <div
                                    key={blog._id}
                                    className="relative overflow-hidden rounded-[20px] sm:rounded-3xl md:rounded-4xl bg-white/10 backdrop-blur-3xl border border-white/10 shadow-2xl group hover:scale-[1.01] md:hover:scale-[1.02] transition-all duration-500"
                                >
                                    {/* Thumbnail */}
                                    <div className="relative h-45 sm:h-50 md:h-57.5 overflow-hidden">
                                        {blog.thumbnail?.url ? (
<Image
  src={blog.thumbnail.url}
  alt={blog.title}
  width={1920}
  height={1080}
  quality={100}
  priority
  className="w-full h-full object-cover group-hover:scale-110 transition-all duration-700"
/>
                                        ) : (
                                            <div className="w-full h-full bg-linear-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center">
                                                <svg className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 text-white/20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                                                </svg>
                                            </div>
                                        )}

                                        {/* Gradient Overlay */}
                                        <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/20 to-transparent"></div>

                                        {/* Date Badge */}
                                        <div className="absolute top-3 sm:top-4 left-3 sm:left-4">
                                            <span className="inline-block px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-lg sm:rounded-xl bg-black/40 backdrop-blur-md border border-white/10 text-[10px] sm:text-xs text-white/80">
                                                {formatDate(blog.createdAt)}
                                            </span>
                                        </div>

                                        {/* Media Type Badge */}
                                        {blog.media?.mediaType === "video" && (
                                            <div className="absolute top-3 sm:top-4 right-3 sm:right-4">
                                                <span className="inline-flex items-center gap-1 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-lg sm:rounded-xl bg-red-500/40 backdrop-blur-md border border-red-400/20 text-[10px] sm:text-xs text-white">
                                                    <svg className="w-3 h-3 sm:w-3.5 sm:h-3.5" fill="currentColor" viewBox="0 0 24 24">
                                                        <path d="M8 5v14l11-7z" />
                                                    </svg>
                                                    Video
                                                </span>
                                            </div>
                                        )}
                                    </div>

                                    {/* Content */}
                                    <div className="p-4 sm:p-5 md:p-6">
                                        <h2 className="text-base sm:text-lg md:text-xl font-semibold text-white line-clamp-1">
                                            {blog.title}
                                        </h2>

                                        <p className="text-[11px] sm:text-xs md:text-sm text-white/60 mt-1.5 sm:mt-2">
                                            By {blog.author}
                                        </p>

                                        <p className="text-[11px] sm:text-xs md:text-sm text-white/70 mt-2.5 sm:mt-3 md:mt-4 line-clamp-2 sm:line-clamp-3 leading-5 sm:leading-6">
                                            {blog.description}
                                        </p>

                                        {/* Actions */}
                                        <div className="flex items-center gap-2 sm:gap-3 mt-4 sm:mt-5 md:mt-6">
                                            <Link
                                                href={`/blogs-edit-admin/${blog._id}`}
                                                className="flex-1"
                                            >
                                                <button className="w-full py-2 sm:py-2.5 md:py-3 rounded-xl sm:rounded-2xl bg-amber-500/15 border border-amber-400/20 text-amber-200 hover:bg-amber-500/25 text-xs sm:text-sm transition-all duration-300 flex items-center justify-center gap-1.5 sm:gap-2">
                                                    <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                    </svg>
                                                    Edit
                                                </button>
                                            </Link>

                                            <button
                                                onClick={() => handleDelete(blog._id, blog.title)}
                                                disabled={deleting === blog._id}
                                                className="px-3 sm:px-4 md:px-5 py-2 sm:py-2.5 md:py-3 rounded-xl sm:rounded-2xl bg-red-500/15 border border-red-400/20 text-red-200 hover:bg-red-500/25 text-xs sm:text-sm transition-all duration-300 disabled:opacity-50 flex items-center justify-center gap-1.5 sm:gap-2 min-w-15 sm:min-w-20"
                                            >
                                                {deleting === blog._id ? (
                                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-200"></div>
                                                ) : (
                                                    <>
                                                        <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                        </svg>
                                                        <span className="hidden sm:inline">Delete</span>
                                                    </>
                                                )}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Results Summary */}
                        {searchTerm && (
                            <div className="mt-6 text-center text-xs sm:text-sm text-white/50">
                                Showing {filteredAndSortedBlogs.length} of {blogs.length} blogs
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default AllBlogsAdminPage;