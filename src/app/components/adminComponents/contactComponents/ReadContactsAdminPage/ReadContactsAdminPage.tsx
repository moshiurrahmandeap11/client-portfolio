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

const ReadContactsAdminPage = () => {
    const [readContacts, setReadContacts] = useState<Contact[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [actionLoading, setActionLoading] = useState<string | null>(null);
    const [expandedMessage, setExpandedMessage] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortOrder, setSortOrder] = useState<'newest' | 'oldest'>('newest');

    useEffect(() => {
        fetchContacts();
    }, []);

    const fetchContacts = async () => {
        try {
            setLoading(true);
            const response = await axiosInstance.get("/contacts");
            // Filter only read contacts
            const readContacts = response.data.data.filter(
                (contact: Contact) => contact.isRead
            );
            setReadContacts(readContacts);
            setError(null);
        } catch (error: any) {
            console.error("Error fetching contacts:", error);
            setError(error.response?.data?.message || "Failed to fetch contacts");
        } finally {
            setLoading(false);
        }
    };

    const handleMarkAsUnread = async (contactId: string) => {
        try {
            setActionLoading(contactId);
            const response = await axiosInstance.put(`/contacts/${contactId}`, {
                isRead: false
            });
            
            if (response.data.success) {
                // Remove the contact from the read contacts list
                setReadContacts(prevContacts => 
                    prevContacts.filter(contact => contact._id !== contactId)
                );
            }
        } catch (error: any) {
            console.error("Error marking as unread:", error);
            alert(error.response?.data?.message || "Failed to mark as unread");
        } finally {
            setActionLoading(null);
        }
    };

    const handleDelete = async (contactId: string) => {
        if (!window.confirm("Are you sure you want to delete this contact permanently?")) {
            return;
        }

        try {
            setActionLoading(contactId);
            const response = await axiosInstance.delete(`/contacts/${contactId}`);
            
            if (response.data.success) {
                // Remove the contact from the list
                setReadContacts(prevContacts => 
                    prevContacts.filter(contact => contact._id !== contactId)
                );
            }
        } catch (error: any) {
            console.error("Error deleting contact:", error);
            alert(error.response?.data?.message || "Failed to delete contact");
        } finally {
            setActionLoading(null);
        }
    };

    const handleDeleteAll = async () => {
        if (!window.confirm("Are you sure you want to delete ALL read contacts? This action cannot be undone.")) {
            return;
        }

        try {
            setLoading(true);
            // Delete contacts one by one (or you could create a bulk delete endpoint)
            const deletePromises = readContacts.map(contact => 
                axiosInstance.delete(`/contacts/${contact._id}`)
            );
            
            await Promise.all(deletePromises);
            setReadContacts([]);
        } catch (error: any) {
            console.error("Error deleting all contacts:", error);
            alert("Failed to delete all contacts");
        } finally {
            setLoading(false);
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
        setExpandedMessage(expandedMessage === contactId ? null : contactId);
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

    // Filter and sort contacts
    const filteredAndSortedContacts = readContacts
        .filter(contact => {
            if (!searchTerm) return true;
            const search = searchTerm.toLowerCase();
            
            // Search in plain text version of the message
            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = contact.message;
            const plainTextMessage = (tempDiv.textContent || tempDiv.innerText || '').toLowerCase();
            
            return (
                contact.name.toLowerCase().includes(search) ||
                contact.email.toLowerCase().includes(search) ||
                plainTextMessage.includes(search)
            );
        })
        .sort((a, b) => {
            if (sortOrder === 'newest') {
                return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
            } else {
                return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
            }
        });

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="flex flex-col items-center gap-3">
                    <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-green-600"></div>
                    <p className="text-gray-500 text-sm">Loading read contacts...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center justify-center min-h-[60vh] px-4">
                <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md w-full">
                    <div className="flex items-center gap-3 mb-3">
                        <svg className="w-6 h-6 text-red-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <h3 className="text-red-800 font-semibold">Error Loading Contacts</h3>
                    </div>
                    <p className="text-red-600 text-sm mb-4">{error}</p>
                    <button
                        onClick={fetchContacts}
                        className="bg-red-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-red-700 transition-colors"
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
            <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-green-500/20 blur-[120px] rounded-full" />
            <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-emerald-500/20 blur-[120px] rounded-full" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-cyan-500/10 blur-[120px] rounded-full" />

            <div className="relative z-10 max-w-7xl mx-auto">

                {/* Header */}
                <div className="backdrop-blur-3xl bg-white/10 border border-white/15 rounded-[32px] p-6 sm:p-8 mb-8 shadow-[0_8px_40px_rgba(255,255,255,0.08)]">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">

                        <div>
                            <div className="flex items-center gap-3">
                                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-green-400/30 to-emerald-500/30 border border-white/20 flex items-center justify-center shadow-lg">
                                    <svg
                                        className="w-7 h-7 text-white"
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
                                </div>

                                <div>
                                    <h1 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
                                        Read Contacts
                                    </h1>

                                    <p className="text-sm text-white/60 mt-1">
                                        {readContacts.length} archived message
                                        {readContacts.length !== 1 ? 's' : ''}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-wrap items-center gap-3">

                            {/* Refresh */}
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

                            {/* Delete All */}
                            {readContacts.length > 0 && (
                                <button
                                    onClick={handleDeleteAll}
                                    className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-red-500/15 hover:bg-red-500/25 border border-red-400/20 text-red-200 transition-all duration-300"
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
                                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7"
                                        />
                                    </svg>

                                    Delete All
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                {/* Search & Sort */}
                {readContacts.length > 0 && (
                    <div className="flex flex-col lg:flex-row gap-4 mb-8">

                        {/* Search */}
                        <div className="relative flex-1">
                            <div className="absolute left-4 top-1/2 -translate-y-1/2">
                                <svg
                                    className="w-5 h-5 text-white/40"
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
                                placeholder="Search contacts..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full h-14 pl-12 pr-5 rounded-2xl bg-white/10 border border-white/10 backdrop-blur-2xl text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-green-400/40"
                            />
                        </div>

                        {/* Sort */}
                        <select
                            value={sortOrder}
                            onChange={(e) =>
                                setSortOrder(
                                    e.target.value as 'newest' | 'oldest'
                                )
                            }
                            className="h-14 px-5 rounded-2xl bg-white/10 border border-white/10 backdrop-blur-2xl text-white focus:outline-none focus:ring-2 focus:ring-green-400/40"
                        >
                            <option className="bg-[#111827]" value="newest">
                                Newest First
                            </option>

                            <option className="bg-[#111827]" value="oldest">
                                Oldest First
                            </option>
                        </select>
                    </div>
                )}

                {/* Empty State */}
                {filteredAndSortedContacts.length === 0 ? (
                    <div className="backdrop-blur-3xl bg-white/10 border border-white/15 rounded-[32px] p-14 text-center shadow-2xl">

                        {searchTerm ? (
                            <>
                                <div className="w-24 h-24 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mx-auto mb-6">
                                    <svg
                                        className="w-12 h-12 text-white/40"
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

                                <h3 className="text-2xl font-semibold text-white mb-2">
                                    No Results Found
                                </h3>

                                <p className="text-white/60 text-sm">
                                    No contacts match your search.
                                </p>

                                <button
                                    onClick={() => setSearchTerm('')}
                                    className="mt-5 px-5 py-2.5 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/10 text-white transition-all duration-300"
                                >
                                    Clear Search
                                </button>
                            </>
                        ) : (
                            <>
                                <div className="w-24 h-24 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mx-auto mb-6">
                                    <svg
                                        className="w-12 h-12 text-white/40"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7"
                                        />
                                    </svg>
                                </div>

                                <h3 className="text-2xl font-semibold text-white mb-2">
                                    No Read Messages
                                </h3>

                                <p className="text-white/60 text-sm">
                                    Your archived contacts will appear here.
                                </p>
                            </>
                        )}
                    </div>
                ) : (
                    <div className="space-y-6">

                        {filteredAndSortedContacts.map((contact) => (
                            <div
                                key={contact._id}
                                className="group relative backdrop-blur-3xl bg-white/10 border border-white/15 rounded-[32px] overflow-hidden transition-all duration-500 hover:bg-white/15 hover:scale-[1.01] shadow-[0_8px_40px_rgba(255,255,255,0.06)]"
                            >

                                {/* Glass Reflection */}
                                <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-transparent pointer-events-none" />

                                <div className="relative z-10 p-5 sm:p-7">

                                    {/* Header */}
                                    <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-5 mb-5">

                                        <div className="flex items-start gap-4 flex-1">

                                            {/* Avatar */}
                                            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-green-400/40 to-emerald-500/40 border border-white/20 flex items-center justify-center shadow-lg shrink-0">
                                                <span className="text-white font-semibold text-lg">
                                                    {contact.name.charAt(0).toUpperCase()}
                                                </span>
                                            </div>

                                            <div className="min-w-0 flex-1">

                                                <div className="flex items-center gap-3 flex-wrap">

                                                    <h3 className="text-lg font-semibold text-white truncate">
                                                        {contact.name}
                                                    </h3>

                                                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-green-500/20 border border-green-400/20 text-green-200 text-xs">
                                                        <svg
                                                            className="w-3 h-3"
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

                                                        Read
                                                    </span>
                                                </div>

                                                <p className="text-sm text-white/60 mt-1 break-all">
                                                    {contact.email}
                                                </p>
                                            </div>
                                        </div>

                                        {/* Dates */}
                                        <div className="text-xs text-white/40 flex flex-col gap-1">
                                            <span>
                                                Created: {formatDate(contact.createdAt)}
                                            </span>

                                            {contact.updatedAt !== contact.createdAt && (
                                                <span>
                                                    Updated: {formatDate(contact.updatedAt)}
                                                </span>
                                            )}
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
                                                className="mt-3 text-sm text-green-300 hover:text-green-200 transition-colors"
                                            >
                                                {expandedMessage === contact._id
                                                    ? 'Show less'
                                                    : 'Read more'}
                                            </button>
                                        )}
                                    </div>

                                    {/* Footer */}
                                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mt-6">

                                        {/* Email */}
                                        <a
                                            href={`mailto:${contact.email}`}
                                            className="inline-flex items-center gap-2 text-sm text-green-300 hover:text-green-200 transition-colors"
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

                                        {/* Actions */}
                                        <div className="flex items-center gap-3 w-full lg:w-auto">

                                            {/* Mark Unread */}
                                            <button
                                                onClick={() =>
                                                    handleMarkAsUnread(contact._id)
                                                }
                                                disabled={
                                                    actionLoading === contact._id
                                                }
                                                className="flex-1 lg:flex-none flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-amber-500/15 hover:bg-amber-500/25 border border-amber-400/20 text-amber-200 transition-all duration-300 disabled:opacity-50"
                                            >
                                                {actionLoading === contact._id ? (
                                                    <>
                                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-amber-200"></div>
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
                                                                d="M3 10h10a8 8 0 018 8v2"
                                                            />
                                                        </svg>

                                                        Mark as Unread
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
                                                        d="M19 7l-.867 12.142A2 2 0 0116.138 21"
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

                {/* Results Summary */}
                {searchTerm && filteredAndSortedContacts.length > 0 && (
                    <div className="mt-6 text-center text-sm text-white/50">
                        Showing {filteredAndSortedContacts.length} of{' '}
                        {readContacts.length} contacts
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
                .rich-text-content strong {
                    font-weight: 600;
                    color: #e2e8f0;
                }
                .rich-text-content em {
                    font-style: italic;
                }
            `}</style>
        </div>
    );
};

export default ReadContactsAdminPage;