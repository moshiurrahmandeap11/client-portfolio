'use client'
import axiosInstance from '@/app/components/sharedComponents/AxiosInstance/AxiosInstance';
import React, { useEffect, useState } from 'react';

interface Contact {
    _id: string;
    name: string;
    email: string;
    message: string;
    isRead: boolean;
    createdAt: string;
    updatedAt: string;
}

const NewContactAdminPage = () => {
    const [newContacts, setNewContacts] = useState<Contact[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [actionLoading, setActionLoading] = useState<string | null>(null);
    const [expandedMessage, setExpandedMessage] = useState<string | null>(null);

    useEffect(() => {
        fetchContacts();
    }, []);

    const fetchContacts = async () => {
        try {
            setLoading(true);
            const response = await axiosInstance.get("/contacts");

            const unreadContacts = response.data.data.filter(
                (contact: Contact) => !contact.isRead
            );

            setNewContacts(unreadContacts);
            setError(null);
        } catch (error: any) {
            console.error("Error fetching contacts:", error);
            setError(error.response?.data?.message || "Failed to fetch contacts");
        } finally {
            setLoading(false);
        }
    };

    const handleMarkAsRead = async (contactId: string) => {
        try {
            setActionLoading(contactId);

            const response = await axiosInstance.patch(
                `/contacts/${contactId}/read`
            );

            if (response.data.success) {
                setNewContacts((prevContacts) =>
                    prevContacts.filter(
                        (contact) => contact._id !== contactId
                    )
                );
            }
        } catch (error: any) {
            console.error("Error marking as read:", error);
            alert(error.response?.data?.message || "Failed to mark as read");
        } finally {
            setActionLoading(null);
        }
    };

    const handleDelete = async (contactId: string) => {
        if (!window.confirm("Are you sure you want to delete this contact?")) {
            return;
        }

        try {
            setActionLoading(contactId);

            const response = await axiosInstance.delete(
                `/contacts/${contactId}`
            );

            if (response.data.success) {
                setNewContacts((prevContacts) =>
                    prevContacts.filter(
                        (contact) => contact._id !== contactId
                    )
                );
            }
        } catch (error: any) {
            console.error("Error deleting contact:", error);
            alert(error.response?.data?.message || "Failed to delete contact");
        } finally {
            setActionLoading(null);
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const toggleMessage = (contactId: string) => {
        setExpandedMessage(
            expandedMessage === contactId ? null : contactId
        );
    };

    // Function to create markup for rich text content
    const createMarkup = (htmlContent: string) => {
        return { __html: htmlContent };
    };

    // Function to get plain text preview for truncated view
    const getPlainTextPreview = (htmlContent: string, maxLength: number = 100) => {
        // Create a temporary div to extract text content
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = htmlContent;
        const textContent = tempDiv.textContent || tempDiv.innerText || '';
        
        if (textContent.length > maxLength) {
            return textContent.substring(0, maxLength) + '...';
        }
        return textContent;
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#0f172a] relative overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,#3b82f6_0%,transparent_30%),radial-gradient(circle_at_bottom_right,#8b5cf6_0%,transparent_30%)] opacity-40" />

                <div className="backdrop-blur-3xl bg-white/10 border border-white/20 rounded-3xl px-10 py-8 shadow-[0_8px_32px_rgba(255,255,255,0.1)]">
                    <div className="flex flex-col items-center gap-4">
                        <div className="relative">
                            <div className="w-14 h-14 rounded-full border-[3px] border-white/20"></div>
                            <div className="absolute inset-0 animate-spin rounded-full border-[3px] border-transparent border-t-white"></div>
                        </div>

                        <p className="text-white/80 text-sm tracking-wide">
                            Loading contacts...
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#0f172a] p-4">
                <div className="w-full max-w-md backdrop-blur-3xl bg-red-500/10 border border-red-400/20 rounded-3xl p-8 shadow-2xl">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-12 h-12 rounded-2xl bg-red-500/20 flex items-center justify-center">
                            <svg
                                className="w-6 h-6 text-red-300"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                />
                            </svg>
                        </div>

                        <div>
                            <h3 className="text-white font-semibold">
                                Error Loading Contacts
                            </h3>

                            <p className="text-red-200 text-sm">
                                {error}
                            </p>
                        </div>
                    </div>

                    <button
                        onClick={fetchContacts}
                        className="mt-3 px-5 py-2.5 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/10 text-white transition-all duration-300"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#0b1120] relative overflow-hidden px-4 sm:px-6 lg:px-8 py-10">
            {/* Background Glow */}
            <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-blue-500/20 blur-[120px] rounded-full" />
            <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-purple-500/20 blur-[120px] rounded-full" />

            <div className="relative z-10 max-w-7xl mx-auto">

                {/* Header */}
                <div className="backdrop-blur-3xl bg-white/10 border border-white/15 rounded-[32px] p-6 sm:p-8 mb-8 shadow-[0_8px_40px_rgba(255,255,255,0.08)]">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5">
                        <div>
                            <h1 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
                                New Contacts
                            </h1>

                            <p className="text-sm text-white/60 mt-2">
                                {newContacts.length} unread message
                                {newContacts.length !== 1 ? 's' : ''}
                            </p>
                        </div>

                        {newContacts.length > 0 && (
                            <button
                                onClick={fetchContacts}
                                className="group flex items-center gap-2 px-5 py-3 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/10 text-white transition-all duration-300"
                            >
                                <svg
                                    className="w-4 h-4 group-hover:rotate-180 transition-transform duration-500"
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

                                Refresh
                            </button>
                        )}
                    </div>
                </div>

                {/* Empty State */}
                {newContacts.length === 0 ? (
                    <div className="backdrop-blur-3xl bg-white/10 border border-white/15 rounded-[32px] p-14 text-center shadow-2xl">
                        <div className="w-24 h-24 rounded-full bg-green-400/10 border border-green-300/20 flex items-center justify-center mx-auto mb-6">
                            <svg
                                className="w-12 h-12 text-green-300"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                                />
                            </svg>
                        </div>

                        <h3 className="text-2xl font-semibold text-white mb-2">
                            All Caught Up ✨
                        </h3>

                        <p className="text-white/60 text-sm">
                            No unread messages right now.
                        </p>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {newContacts.map((contact) => (
                            <div
                                key={contact._id}
                                className="group relative backdrop-blur-3xl bg-white/10 border border-white/15 rounded-[32px] overflow-hidden transition-all duration-500 hover:bg-white/15 hover:scale-[1.01] shadow-[0_8px_40px_rgba(255,255,255,0.06)]"
                            >
                                {/* Glass Shine */}
                                <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-transparent pointer-events-none" />

                                <div className="relative z-10 p-5 sm:p-7">

                                    {/* Header */}
                                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-5">
                                        <div className="flex items-start gap-4 flex-1">
                                            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-400/40 to-purple-500/40 border border-white/20 flex items-center justify-center shadow-lg flex-shrink-0">
                                                <span className="text-white font-semibold text-lg">
                                                    {contact.name.charAt(0).toUpperCase()}
                                                </span>
                                            </div>

                                            <div className="min-w-0">
                                                <div className="flex items-center gap-3 flex-wrap">
                                                    <h3 className="text-lg font-semibold text-white truncate">
                                                        {contact.name}
                                                    </h3>

                                                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-red-500/20 border border-red-400/20 text-red-200 text-xs">
                                                        <span className="w-2 h-2 rounded-full bg-red-400 animate-pulse" />
                                                        New
                                                    </span>
                                                </div>

                                                <p className="text-sm text-white/60 mt-1 break-all">
                                                    {contact.email}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="text-xs text-white/40">
                                            {formatDate(contact.createdAt)}
                                        </div>
                                    </div>

                                    {/* Message - Updated with dangerouslySetInnerHTML */}
                                    <div className="rounded-3xl bg-black/10 border border-white/10 p-5">
                                        {expandedMessage === contact._id ? (
                                            // Show full HTML content when expanded
                                            <div 
                                                className="text-sm text-white/80 leading-7 rich-text-content"
                                                dangerouslySetInnerHTML={createMarkup(contact.message)}
                                            />
                                        ) : (
                                            // Show plain text preview when collapsed
                                            <p className="text-sm text-white/80 leading-7">
                                                {getPlainTextPreview(contact.message)}
                                            </p>
                                        )}

                                        {contact.message.length > 100 && (
                                            <button
                                                onClick={() =>
                                                    toggleMessage(contact._id)
                                                }
                                                className="mt-3 text-sm text-blue-300 hover:text-blue-200 transition-colors"
                                            >
                                                {expandedMessage === contact._id
                                                    ? 'Show less'
                                                    : 'Read more'}
                                            </button>
                                        )}
                                    </div>

                                    {/* Footer */}
                                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mt-6">

                                        <a
                                            href={`mailto:${contact.email}`}
                                            className="inline-flex items-center gap-2 text-sm text-blue-300 hover:text-blue-200 transition-colors"
                                        >
                                            <svg
                                                className="w-4 h-4"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth="2"
                                                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8"
                                                />
                                            </svg>

                                            Reply via Email
                                        </a>

                                        <div className="flex items-center gap-3 w-full sm:w-auto">

                                            {/* Mark Read */}
                                            <button
                                                onClick={() =>
                                                    handleMarkAsRead(contact._id)
                                                }
                                                disabled={
                                                    actionLoading === contact._id
                                                }
                                                className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-blue-500/20 hover:bg-blue-500/30 border border-blue-400/20 text-white transition-all duration-300 disabled:opacity-50"
                                            >
                                                {actionLoading === contact._id ? (
                                                    <>
                                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                                        Marking...
                                                    </>
                                                ) : (
                                                    <>
                                                        <svg
                                                            className="w-4 h-4"
                                                            fill="none"
                                                            stroke="currentColor"
                                                            viewBox="0 0 24 24"
                                                        >
                                                            <path
                                                                strokeLinecap="round"
                                                                strokeLinejoin="round"
                                                                strokeWidth="2"
                                                                d="M5 13l4 4L19 7"
                                                            />
                                                        </svg>

                                                        Mark as Read
                                                    </>
                                                )}
                                            </button>

                                            {/* Delete */}
                                            <button
                                                onClick={() =>
                                                    handleDelete(contact._id)
                                                }
                                                disabled={
                                                    actionLoading === contact._id
                                                }
                                                className="w-12 h-12 rounded-2xl bg-red-500/15 hover:bg-red-500/25 border border-red-400/20 flex items-center justify-center text-red-200 transition-all duration-300 disabled:opacity-50"
                                            >
                                                <svg
                                                    className="w-5 h-5"
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
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
            
            {/* Add styles for rich text content */}
            <style jsx>{`
                .rich-text-content {
                    word-wrap: break-word;
                    overflow-wrap: break-word;
                }
                .rich-text-content h1,
                .rich-text-content h2,
                .rich-text-content h3,
                .rich-text-content h4,
                .rich-text-content h5,
                .rich-text-content h6 {
                    margin-top: 0.5em;
                    margin-bottom: 0.5em;
                    font-weight: 600;
                }
                .rich-text-content h1 { font-size: 1.5em; }
                .rich-text-content h2 { font-size: 1.3em; }
                .rich-text-content h3 { font-size: 1.1em; }
                .rich-text-content p { margin-bottom: 0.5em; }
                .rich-text-content ul,
                .rich-text-content ol {
                    margin-left: 1.5em;
                    margin-bottom: 0.5em;
                }
                .rich-text-content a {
                    color: #93c5fd;
                    text-decoration: underline;
                }
                .rich-text-content blockquote {
                    border-left: 3px solid rgba(147, 197, 253, 0.5);
                    padding-left: 1em;
                    margin: 0.5em 0;
                    opacity: 0.9;
                }
                .rich-text-content code {
                    background: rgba(0, 0, 0, 0.2);
                    padding: 0.2em 0.4em;
                    border-radius: 0.3em;
                    font-size: 0.9em;
                }
            `}</style>
        </div>
    );
};

export default NewContactAdminPage;