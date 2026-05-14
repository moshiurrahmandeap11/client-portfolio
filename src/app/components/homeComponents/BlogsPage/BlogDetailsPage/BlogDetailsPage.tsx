"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import axiosInstance from "@/app/components/sharedComponents/AxiosInstance/AxiosInstance";
import Link from "next/link";
import {
    FiArrowLeft,
    FiShare2,
    FiCopy,
    FiCheck,
    FiClock,
    FiUser,
    FiCalendar,
    FiArrowRight,
    FiExternalLink
} from "react-icons/fi";
import {
    FaFacebook,
    FaWhatsapp,
    FaLinkedin,
    FaTelegram
} from "react-icons/fa";
import {
    FaXTwitter,
    FaFacebookMessenger
} from "react-icons/fa6";
import Image from "next/image";

interface Blog {
    _id: string;
    title: string;
    content: string;
    author: string;
    description: string;
    thumbnail?: {
        url: string;
        publicId: string;
        mediaType: string;
    };
    media?: {
        url: string;
        publicId: string;
        mediaType: string;
    };
    createdAt: string;
    updatedAt: string;
}

const BlogDetailsPage = () => {
    const { id } = useParams();
    const router = useRouter();
    const [blog, setBlog] = useState<Blog | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [showShareMenu, setShowShareMenu] = useState(false);
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        if (id) {
            fetchBlog();
        }
    }, [id]);

    // SEO - Update meta tags dynamically
    useEffect(() => {
        if (blog) {
            document.title = `${blog.title}`;

            // Update meta description
            let metaDescription = document.querySelector('meta[name="description"]');
            if (!metaDescription) {
                metaDescription = document.createElement('meta');
                metaDescription.setAttribute('name', 'description');
                document.head.appendChild(metaDescription);
            }
            metaDescription.setAttribute('content', blog.description || blog.content.replace(/<[^>]*>/g, '').substring(0, 160));

            // Update OG tags
            const ogTitle = document.querySelector('meta[property="og:title"]');
            if (ogTitle) ogTitle.setAttribute('content', blog.title);

            const ogDescription = document.querySelector('meta[property="og:description"]');
            if (ogDescription) ogDescription.setAttribute('content', blog.description || blog.content.replace(/<[^>]*>/g, '').substring(0, 160));

            const ogImage = document.querySelector('meta[property="og:image"]');
            if (ogImage && blog.thumbnail?.url) ogImage.setAttribute('content', blog.thumbnail.url);

            const ogUrl = document.querySelector('meta[property="og:url"]');
            if (ogUrl && typeof window !== 'undefined') ogUrl.setAttribute('content', window.location.href);

            // Update Twitter Card tags
            const twitterTitle = document.querySelector('meta[name="twitter:title"]');
            if (twitterTitle) twitterTitle.setAttribute('content', blog.title);

            const twitterDescription = document.querySelector('meta[name="twitter:description"]');
            if (twitterDescription) twitterDescription.setAttribute('content', blog.description || blog.content.replace(/<[^>]*>/g, '').substring(0, 160));

            const twitterImage = document.querySelector('meta[name="twitter:image"]');
            if (twitterImage && blog.thumbnail?.url) twitterImage.setAttribute('content', blog.thumbnail.url);

            // Add canonical URL
            let canonical = document.querySelector('link[rel="canonical"]');
            if (!canonical && typeof window !== 'undefined') {
                canonical = document.createElement('link');
                canonical.setAttribute('rel', 'canonical');
                document.head.appendChild(canonical);
            }
            if (canonical && typeof window !== 'undefined') canonical.setAttribute('href', window.location.href);
        }
    }, [blog]);

    const fetchBlog = async () => {
        try {
            setLoading(true);
            const res = await axiosInstance.get(`/blogs/${id}`);
            setBlog(res.data.data);
            setError(null);
        } catch (error: any) {
            console.log(error);
            setError("Failed to load blog details. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    const getReadingTime = (content: string) => {
        const wordsPerMinute = 200;
        const textContent = content.replace(/<[^>]*>/g, "");
        const words = textContent.split(/\s+/).length;
        return Math.ceil(words / wordsPerMinute);
    };

    const getShareUrl = () => {
        if (typeof window !== "undefined") {
            return window.location.href;
        }
        return "";
    };

    const handleShare = (platform: string) => {
        const url = getShareUrl();
        const title = blog?.title || "Check out this blog";
        const description = blog?.description || "";

        let shareUrl = "";

        switch (platform) {
            case "facebook":
                shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
                break;
            case "whatsapp":
                shareUrl = `https://wa.me/?text=${encodeURIComponent(title + " - " + url)}`;
                break;
            case "messenger":
                shareUrl = `https://www.facebook.com/dialog/send?link=${encodeURIComponent(url)}&app_id=YOUR_FACEBOOK_APP_ID`;
                break;
            case "twitter":
                shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`;
                break;
            case "linkedin":
                shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
                break;
            case "telegram":
                shareUrl = `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`;
                break;
            case "copy":
                navigator.clipboard.writeText(url).then(() => {
                    setCopied(true);
                    setTimeout(() => setCopied(false), 2000);
                });
                setShowShareMenu(false);
                return;
            default:
                break;
        }

        if (shareUrl) {
            window.open(shareUrl, "_blank", "width=600,height=400");
        }
        setShowShareMenu(false);
    };

    const createMarkup = (htmlContent: string) => {
        return { __html: htmlContent };
    };

    // Generate JSON-LD structured data for SEO
    const generateJsonLd = () => {
        if (!blog) return "";

        return JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BlogPosting",
            "headline": blog.title,
            "description": blog.description || blog.content.replace(/<[^>]*>/g, '').substring(0, 160),
            "image": blog.thumbnail?.url || "",
            "author": {
                "@type": "Person",
                "name": blog.author
            },
            "datePublished": blog.createdAt,
            "dateModified": blog.updatedAt,
            "mainEntityOfPage": {
                "@type": "WebPage",
                "@id": typeof window !== 'undefined' ? window.location.href : ""
            }
        });
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-[#0a0f1e] flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <div className="relative">
                        <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center">
                            <div className="animate-spin rounded-full h-8 w-8 border-[3px] border-white/20 border-t-blue-400" />
                        </div>
                    </div>
                    <p className="text-white/60 text-sm">Loading article...</p>
                </div>
            </div>
        );
    }

    if (error || !blog) {
        return (
            <div className="min-h-screen bg-[#0a0f1e] flex items-center justify-center p-4">
                <div className="max-w-md w-full backdrop-blur-xl bg-white/5 border border-red-500/20 rounded-3xl p-8 text-center">
                    <div className="w-16 h-16 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center mx-auto mb-6">
                        <FiExternalLink className="w-8 h-8 text-red-400" />
                    </div>
                    <h3 className="text-white text-lg font-semibold mb-2">Article Not Found</h3>
                    <p className="text-white/60 text-sm mb-6">{error || "The article you're looking for doesn't exist."}</p>
                    <button
                        onClick={() => router.push("/blogs")}
                        className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium transition-all"
                    >
                        Back to Blogs
                    </button>
                </div>
            </div>
        );
    }

    return (
        <>
            {/* JSON-LD Structured Data */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: generateJsonLd() }}
            />

            <div className="min-h-screen bg-[#0A0A0A] relative overflow-hidden">

                <div className="relative z-10">
                    {/* Back Button & Share */}
                    <div className="sticky top-0 z-50 backdrop-blur-xl bg-[#0A0A0A] border-b border-white/5">
                        <div className="max-w-12/12 mx-auto  py-3 flex items-center justify-between">
                            <button
                                onClick={() => router.back()}
                                className="flex items-center gap-2 text-white/60 hover:text-white text-sm transition-colors"
                            >
                                <FiArrowLeft className="w-5 h-5" />
                                Back
                            </button>

                            {/* Share Button */}
                            <div className="relative">
                                <button
                                    onClick={() => setShowShareMenu(!showShareMenu)}
                                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white/80 hover:text-white text-sm transition-all"
                                    aria-label="Share article"
                                >
                                    <FiShare2 className="w-4 h-4" />
                                    Share
                                </button>

                                {/* Share Menu Dropdown */}
                                {showShareMenu && (
                                    <>
                                        <div
                                            className="fixed inset-0 z-40"
                                            onClick={() => setShowShareMenu(false)}
                                        />
                                        <div className="absolute right-0 mt-2 w-64 bg-[#1a1f2e] backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl z-50 p-2">
                                            <button
                                                onClick={() => handleShare("facebook")}
                                                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/5 text-white/80 hover:text-white transition-all text-sm"
                                            >
                                                <FaFacebook className="w-5 h-5 text-blue-500" />
                                                Facebook
                                            </button>

                                            <button
                                                onClick={() => handleShare("whatsapp")}
                                                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/5 text-white/80 hover:text-white transition-all text-sm"
                                            >
                                                <FaWhatsapp className="w-5 h-5 text-green-500" />
                                                WhatsApp
                                            </button>

                                            <button
                                                onClick={() => handleShare("messenger")}
                                                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/5 text-white/80 hover:text-white transition-all text-sm"
                                            >
                                                <FaFacebookMessenger className="w-5 h-5 text-purple-500" />
                                                Messenger
                                            </button>

                                            <button
                                                onClick={() => handleShare("twitter")}
                                                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/5 text-white/80 hover:text-white transition-all text-sm"
                                            >
                                                <FaXTwitter className="w-5 h-5 text-white" />
                                                Twitter/X
                                            </button>

                                            <button
                                                onClick={() => handleShare("linkedin")}
                                                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/5 text-white/80 hover:text-white transition-all text-sm"
                                            >
                                                <FaLinkedin className="w-5 h-5 text-blue-600" />
                                                LinkedIn
                                            </button>

                                            <button
                                                onClick={() => handleShare("telegram")}
                                                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/5 text-white/80 hover:text-white transition-all text-sm"
                                            >
                                                <FaTelegram className="w-5 h-5 text-blue-400" />
                                                Telegram
                                            </button>

                                            <hr className="border-white/5 my-2" />

                                            <button
                                                onClick={() => handleShare("copy")}
                                                className="w-full flex items-center justify-between px-4 py-3 rounded-xl hover:bg-white/5 text-white/80 hover:text-white transition-all text-sm"
                                            >
                                                <span className="flex items-center gap-3">
                                                    {copied ? (
                                                        <FiCheck className="w-5 h-5 text-green-400" />
                                                    ) : (
                                                        <FiCopy className="w-5 h-5 text-white/60" />
                                                    )}
                                                    {copied ? "Copied!" : "Copy Link"}
                                                </span>
                                            </button>
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Article Content */}
                    <article className="max-w-12/12 mx-auto  py-8 sm:py-12 md:py-16">
                        {/* Header */}
                        <header className="mb-8 sm:mb-10 md:mb-12">


                            <div className="flex flex-wrap items-center gap-4 text-sm text-white/60">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-linear-to-br from-orange-500/30 to-orange-500/30 border border-white/10 flex items-center justify-center">
                                        <FiUser className="w-5 h-5 text-white" />
                                    </div>
                                    <div>
                                        <p className="text-white font-medium">{blog.author}</p>
                                        <div className="flex items-center gap-2 text-xs text-white/40">
                                            <span className="flex items-center gap-1">
                                                <FiCalendar className="w-3 h-3" />
                                                {formatDate(blog.createdAt)}
                                            </span>
                                            <span>•</span>
                                            <span className="flex items-center gap-1">
                                                <FiClock className="w-3 h-3" />
                                                {getReadingTime(blog.content)} min read
                                            </span>
                                        </div>
                                    </div>
                                </div>

                            </div>
                            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mt-4 sm:mt-6 leading-tight">
                                {blog.title}
                            </h1>
                        </header>

                        {/* Thumbnail */}
                        {blog.thumbnail?.url && (
                            <figure className="relative rounded-2xl sm:rounded-3xl overflow-hidden mb-8 sm:mb-10 md:mb-12 border border-white/10">
                                <Image
                                    src={blog.thumbnail.url}
                                    alt={blog.title}
                                    width={1920}
                                    height={1080}
                                    quality={100}
                                    className="w-full h-75 sm:h-100 md:h-125 object-cover"
                                    loading="lazy"
                                />
                            </figure>
                        )}

                        {/* Content */}
                        <div className="prose prose-lg prose-invert max-w-none mb-10 sm:mb-12 md:mb-16">
                            <div
                                className="text-white/90 leading-relaxed text-base sm:text-lg space-y-4 sm:space-y-6"
                                dangerouslySetInnerHTML={createMarkup(blog.content)}
                            />
                        </div>

                        {/* Media (Video/Image) */}
                        {blog.media?.url && (
                            <figure className="rounded-2xl sm:rounded-3xl overflow-hidden mb-10 sm:mb-12 md:mb-16 border border-white/10">
                                {blog.media.mediaType === "video" ? (
                                    <video
                                        src={blog.media.url}
                                        controls
                                        className="w-full max-h-150"
                                        poster={blog.thumbnail?.url}
                                    >
                                        Your browser does not support the video tag.
                                    </video>
                                ) : (
                                    <Image
                                        src={blog.media.url}
                                        alt="Additional media"
                                        width={1920}
                                        height={1080}
                                        quality={100}
                                        className="w-full h-auto"
                                        loading="lazy"
                                    />
                                )}
                            </figure>
                        )}

                        {/* Article Footer with Share Section */}
                        <div className="border-t border-white/10 pt-8">
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                                <div className="flex items-center gap-2">
                                    <span className="text-white/40 text-sm">Share this article:</span>
                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={() => handleShare("facebook")}
                                            className="w-9 h-9 rounded-lg bg-white/5 hover:bg-blue-600/20 border border-white/10 hover:border-blue-500/30 flex items-center justify-center transition-all group"
                                            aria-label="Share on Facebook"
                                        >
                                            <FaFacebook className="w-4 h-4 text-white/60 group-hover:text-blue-400" />
                                        </button>
                                        <button
                                            onClick={() => handleShare("whatsapp")}
                                            className="w-9 h-9 rounded-lg bg-white/5 hover:bg-green-600/20 border border-white/10 hover:border-green-500/30 flex items-center justify-center transition-all group"
                                            aria-label="Share on WhatsApp"
                                        >
                                            <FaWhatsapp className="w-4 h-4 text-white/60 group-hover:text-green-400" />
                                        </button>
                                        <button
                                            onClick={() => handleShare("messenger")}
                                            className="w-9 h-9 rounded-lg bg-white/5 hover:bg-purple-600/20 border border-white/10 hover:border-purple-500/30 flex items-center justify-center transition-all group"
                                            aria-label="Share on Messenger"
                                        >
                                            <FaFacebookMessenger className="w-4 h-4 text-white/60 group-hover:text-purple-400" />
                                        </button>
                                        <button
                                            onClick={() => handleShare("copy")}
                                            className="w-9 h-9 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center transition-all group relative"
                                            aria-label="Copy link"
                                        >
                                            {copied ? (
                                                <FiCheck className="w-4 h-4 text-green-400" />
                                            ) : (
                                                <FiCopy className="w-4 h-4 text-white/60 group-hover:text-white" />
                                            )}
                                        </button>
                                    </div>
                                </div>

                                {blog.updatedAt !== blog.createdAt && (
                                    <p className="text-white/30 text-xs flex items-center gap-1">
                                        <FiClock className="w-3 h-3" />
                                        Updated: {formatDate(blog.updatedAt)}
                                    </p>
                                )}
                            </div>
                        </div>
                    </article>

                    {/* Related Articles Section */}
                    <section className=" pb-20">
                        <div className="max-w-12/12 mx-auto">
                            <h2 className="text-2xl font-bold text-white mb-6">More Articles</h2>
                            <Link
                                href="/blogs"
                                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white/80 hover:text-white transition-all text-sm"
                            >
                                View All Articles
                                <FiArrowRight className="w-4 h-4" />
                            </Link>
                        </div>
                    </section>
                </div>

                {/* Rich Content Styles */}
                <style jsx global>{`
                    .prose h1, .prose h2, .prose h3, .prose h4, .prose h5, .prose h6 {
                        color: white;
                        margin-top: 1.5em;
                        margin-bottom: 0.5em;
                        font-weight: 600;
                    }
                    .prose h1 { font-size: 2em; }
                    .prose h2 { font-size: 1.5em; }
                    .prose h3 { font-size: 1.25em; }
                    .prose p {
                        margin-bottom: 1em;
                        line-height: 1.8;
                    }
                    .prose ul, .prose ol {
                        margin-left: 1.5em;
                        margin-bottom: 1em;
                    }
                    .prose li {
                        margin-bottom: 0.5em;
                    }
                    .prose a {
                        color: #60a5fa;
                        text-decoration: underline;
                    }
                    .prose blockquote {
                        border-left: 4px solid rgba(96, 165, 250, 0.5);
                        padding-left: 1em;
                        margin: 1em 0;
                        color: rgba(255, 255, 255, 0.8);
                        font-style: italic;
                    }
                    .prose code {
                        background: rgba(0, 0, 0, 0.3);
                        padding: 0.2em 0.4em;
                        border-radius: 0.3em;
                        font-size: 0.9em;
                        color: #fbbf24;
                    }
                    .prose pre {
                        background: rgba(0, 0, 0, 0.3);
                        padding: 1em;
                        border-radius: 0.75em;
                        overflow-x: auto;
                        margin: 1em 0;
                    }
                    .prose img {
                        border-radius: 1em;
                        margin: 1em 0;
                    }
                    .prose strong {
                        color: white;
                        font-weight: 600;
                    }
                    .prose em {
                        font-style: italic;
                    }
                `}</style>
            </div>
        </>
    );
};

export default BlogDetailsPage;