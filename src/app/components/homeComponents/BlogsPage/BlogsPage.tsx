"use client";

import React, { useEffect, useState } from "react";
import axiosInstance from "@/app/components/sharedComponents/AxiosInstance/AxiosInstance";
import Link from "next/link";
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

const BlogsPage = () => {
    const [blogs, setBlogs] = useState<Blog[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [sortOrder, setSortOrder] = useState<"newest" | "oldest">("newest");
    const [currentPage, setCurrentPage] = useState(1);
    const blogsPerPage = 6;

    useEffect(() => {
        fetchBlogs();
    }, []);

    const fetchBlogs = async () => {
        try {
            setLoading(true);
            const res = await axiosInstance.get("/blogs");
            setBlogs(res.data.data);
            setError(null);
        } catch (error: any) {
            console.log(error);
            setError("Failed to load blogs. Please try again later.");
        } finally {
            setLoading(false);
        }
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

    // Pagination
    const totalPages = Math.ceil(filteredAndSortedBlogs.length / blogsPerPage);
    const indexOfLastBlog = currentPage * blogsPerPage;
    const indexOfFirstBlog = indexOfLastBlog - blogsPerPage;
    const currentBlogs = filteredAndSortedBlogs.slice(indexOfFirstBlog, indexOfLastBlog);

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
        });
    };

    const getReadingTime = (content: string) => {
        const wordsPerMinute = 200;
        const textContent = content.replace(/<[^>]*>/g, '');
        const words = textContent.split(/\s+/).length;
        const minutes = Math.ceil(words / wordsPerMinute);
        return minutes;
    };

    const handlePageChange = (pageNumber: number) => {
        setCurrentPage(pageNumber);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center relative overflow-hidden">
                {/* Background Effects */}
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,var(--tw-gradient-stops))] from-blue-900/20 via-[#0a0f1e] to-[#0a0f1e]" />
                <div className="absolute top-0 left-0 w-150 h-150 bg-blue-600/10 blur-[150px] rounded-full animate-pulse" />
                <div className="absolute bottom-0 right-0 w-150 h-150 bg-purple-600/10 blur-[150px] rounded-full animate-pulse delay-1000" />

                <div className="relative z-10 flex flex-col items-center gap-6">
                    <div className="relative">
                        <div className="w-20 h-20 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center">
                            <div className="animate-spin rounded-full h-10 w-10 border-[3px] border-white/20 border-t-white" />
                        </div>
                    </div>
                    <div className="text-center">
                        <h3 className="text-white text-lg font-medium mb-2">Loading Blogs</h3>
                        <p className="text-white/50 text-sm">Fetching amazing content for you...</p>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-[#0a0f1e] flex items-center justify-center p-4">
                <div className="max-w-md w-full backdrop-blur-xl bg-white/5 border border-red-500/20 rounded-3xl p-8 text-center">
                    <div className="w-16 h-16 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center mx-auto mb-6">
                        <svg className="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                        </svg>
                    </div>
                    <h3 className="text-white text-lg font-semibold mb-2">Oops! Something went wrong</h3>
                    <p className="text-white/60 text-sm mb-6">{error}</p>
                    <button
                        onClick={fetchBlogs}
                        className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium transition-all duration-300 transform hover:scale-105"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#0A0A0A] relative overflow-hidden">

            <div className="relative z-10">
                {/* Hero Section */}
                <section className="relative pt-4 py-4 px-4 sm:px-6 lg:px-8">
                    <div className="max-w-7xl mx-auto text-center">
                        <h1 className=" text-3xl sm:text-4xl md:text-5xl font-bold">
                            Blogs
                        </h1>


                    </div>
                </section>

                {/* Filters & Sort Section */}
                {blogs.length > 0 && (
                    <section className=" pb-6">
                        <div className="max-w-full mx-auto">
                            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                                <div className="flex items-center gap-3">
                                    <span className="text-white/60 text-sm">Sort by:</span>
                                    <div className="flex gap-1 bg-white/5 rounded-xl p-1 border border-white/10">
                                        <button
                                            onClick={() => {
                                                setSortOrder("newest");
                                                setCurrentPage(1);
                                            }}
                                            className={`px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all ${sortOrder === "newest"
                                                ? "bg-orange-600 text-white"
                                                : "text-white/60 hover:text-white"
                                                }`}
                                        >
                                            Newest
                                        </button>
                                        <button
                                            onClick={() => {
                                                setSortOrder("oldest");
                                                setCurrentPage(1);
                                            }}
                                            className={`px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all ${sortOrder === "oldest"
                                                ? "bg-orange-600 text-white"
                                                : "text-white/60 hover:text-white"
                                                }`}
                                        >
                                            Oldest
                                        </button>
                                    </div>
                                </div>
                                {/* Search Bar */}
                                <div className="max-w-xl  mt-4 relative">
                                    <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                                        <svg className="w-5 h-5 text-white/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                        </svg>
                                    </div>
                                    <input
                                        type="text"
                                        placeholder="Search articles..."
                                        value={searchTerm}
                                        onChange={(e) => {
                                            setSearchTerm(e.target.value);
                                            setCurrentPage(1);
                                        }}
                                        className="w-full py-2 pl-12 pr-12 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl text-white text-sm sm:text-base placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-orange-500/40 focus:border-blue-500/40 transition-all"
                                    />
                                    {searchTerm && (
                                        <button
                                            onClick={() => {
                                                setSearchTerm("");
                                                setCurrentPage(1);
                                            }}
                                            className="absolute inset-y-0 right-4 flex items-center text-white/40 hover:text-white/80 transition-colors"
                                        >
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                            </svg>
                                        </button>
                                    )}
                                </div>

                                <p className="text-white/40 text-sm">
                                    {filteredAndSortedBlogs.length} article{filteredAndSortedBlogs.length !== 1 ? "s" : ""} found
                                </p>
                            </div>
                        </div>
                    </section>
                )}

                {/* Blog Grid */}
                <section className=" pb-16 sm:pb-20 md:pb-24">
                    <div className="max-w-full mx-auto">
                        {filteredAndSortedBlogs.length === 0 ? (
                            <div className="text-center py-20">
                                <div className="w-20 h-20 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mx-auto mb-6">
                                    <svg className="w-10 h-10 text-white/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                                    </svg>
                                </div>
                                <h3 className="text-xl font-semibold text-white mb-2">No Articles Found</h3>
                                <p className="text-white/60 text-sm mb-6">
                                    {searchTerm ? "No articles match your search criteria." : "No articles published yet."}
                                </p>
                                {searchTerm && (
                                    <button
                                        onClick={() => setSearchTerm("")}
                                        className="px-6 py-3 rounded-xl bg-white/10 hover:bg-white/20 border border-white/10 text-white text-sm transition-all"
                                    >
                                        Clear Search
                                    </button>
                                )}
                            </div>
                        ) : (
                            <>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                                    {currentBlogs.map((blog) => (
                                        <article
                                            key={blog._id}
                                            className="group relative bg-white/3 backdrop-blur-xl border border-white/8 rounded-2xl sm:rounded-3xl overflow-hidden hover:bg-white/6 hover:border-white/15 transition-all duration-500 hover:shadow-xl hover:shadow-blue-500/5 hover:-translate-y-1"
                                        >
                                            {/* Thumbnail */}
                                            <div className="relative h-48 sm:h-52 md:h-56 overflow-hidden">
                                                {blog.thumbnail?.url ? (
                                                    <Image
                                                        src={blog.thumbnail.url}
                                                        alt={blog.title}
                                                        width={1920}
                                                        height={1080}
                                                        quality={100}
                                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                                                        loading="lazy"
                                                    />
                                                ) : (
                                                    <div className="w-full h-full bg-linear-to-br from-blue-600/20 to-purple-600/20 flex items-center justify-center">
                                                        <svg className="w-16 h-16 text-white/10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                                                        </svg>
                                                    </div>
                                                )}
                                                <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent" />

                                                {/* Badges */}
                                                <div className="absolute top-3 left-3 flex gap-2">
                                                    <span className="px-3 py-1 rounded-lg bg-black/40 backdrop-blur-md border border-white/10 text-xs text-white/90">
                                                        {formatDate(blog.createdAt)}
                                                    </span>
                                                    {blog.media?.mediaType === "video" && (
                                                        <span className="px-3 py-1 rounded-lg bg-red-500/40 backdrop-blur-md border border-red-400/20 text-xs text-white flex items-center gap-1">
                                                            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                                                <path d="M8 5v10l7-5-7-5z" />
                                                            </svg>
                                                            Video
                                                        </span>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Content */}
                                            <div className="p-5 sm:p-6">
                                                <div className="flex items-center gap-3 mb-3">
                                                    <div className="w-8 h-8 rounded-full bg-linear-to-br from-orange-500/30 to-orange-500/30 border border-white/10 flex items-center justify-center">
                                                        <span className="text-white text-xs font-medium">
                                                            {blog.author?.charAt(0)?.toUpperCase() || "A"}
                                                        </span>
                                                    </div>
                                                    <span className="text-sm text-white/60">{blog.author}</span>
                                                    <span className="text-white/20">•</span>
                                                    <span className="text-xs text-white/40">
                                                        {getReadingTime(blog.content)} min read
                                                    </span>
                                                </div>

                                                <Link href={`/blog/${blog._id}`}>
                                                    <h2 className="text-lg sm:text-xl font-semibold text-white mb-2 line-clamp-2 group-hover:text-orange-400 transition-colors">
                                                        {blog.title}
                                                    </h2>
                                                </Link>

                                                <p className="text-sm text-white/50 line-clamp-2 mb-4 leading-relaxed">
                                                    {blog.description || blog.content.replace(/<[^>]*>/g, '').substring(0, 150) + '...'}
                                                </p>

                                                <Link href={`/blog/${blog._id}`}>
                                                    <span className="inline-flex items-center gap-2 text-sm text-orange-400 hover:text-orange-300 transition-colors font-medium">
                                                        Read Article
                                                        <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                                        </svg>
                                                    </span>
                                                </Link>
                                            </div>
                                        </article>
                                    ))}
                                </div>

                                {/* Pagination */}
                                {totalPages > 1 && (
                                    <div className="flex items-center justify-center gap-2 mt-12">
                                        <button
                                            onClick={() => handlePageChange(currentPage - 1)}
                                            disabled={currentPage === 1}
                                            className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 text-white/60 hover:text-white hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center transition-all"
                                        >
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                                            </svg>
                                        </button>

                                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                                            <button
                                                key={page}
                                                onClick={() => handlePageChange(page)}
                                                className={`w-10 h-10 rounded-xl text-sm font-medium transition-all ${currentPage === page
                                                    ? 'bg-blue-600 text-white'
                                                    : 'bg-white/5 border border-white/10 text-white/60 hover:text-white hover:bg-white/10'
                                                    }`}
                                            >
                                                {page}
                                            </button>
                                        ))}

                                        <button
                                            onClick={() => handlePageChange(currentPage + 1)}
                                            disabled={currentPage === totalPages}
                                            className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 text-white/60 hover:text-white hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center transition-all"
                                        >
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                                            </svg>
                                        </button>
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </section>
            </div>
        </div>
    );
};

export default BlogsPage;