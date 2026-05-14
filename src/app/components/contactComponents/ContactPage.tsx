"use client";

import Link from "next/link";
import { ChangeEvent, FormEvent, useState } from "react";
import { IoIosArrowBack } from "react-icons/io";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import axiosInstance from "../sharedComponents/AxiosInstance/AxiosInstance";
// RichTextEditor ইম্পোর্ট করুন TypeScript টাইপ সহ
import { RichTextEditor } from "richmoshiur";

const MySwal = withReactContent(Swal);

// Form data type define
interface FormData {
  name: string;
  email: string;
  message: string;
}

// API response type define
interface ApiResponse {
  success: boolean;
  message: string;
  data?: string | number;
}

// Error response type define
interface ErrorResponse {
  response?: {
    data?: {
      message?: string;
    };
  };
  message?: string;
}

const ContactPage = () => {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    message: "",
  });
  const [loading, setLoading] = useState<boolean>(false);

  // Handle input change with proper typing
  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle RichTextEditor change with proper TypeScript typing
  const handleMessageChange = (content: string): void => {
    setFormData((prev: FormData) => ({
      ...prev,
      message: content,
    }));
  };

  // Reset form
  const handleReset = (): void => {
    setFormData({
      name: "",
      email: "",
      message: "",
    });
  };

  // Handle form submit
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Validation
    if (
      !formData.name.trim() ||
      !formData.email.trim() ||
      !formData.message.trim()
    ) {
      MySwal.fire({
        icon: "warning",
        title: "Oops...",
        text: "Please fill in all required fields!",
        background: "#1a1a1a",
        color: "#fff",
        confirmButtonColor: "#8b5cf6",
        confirmButtonText: "Okay",
      });
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      MySwal.fire({
        icon: "error",
        title: "Invalid Email",
        text: "Please enter a valid email address!",
        background: "#1a1a1a",
        color: "#fff",
        confirmButtonColor: "#8b5cf6",
        confirmButtonText: "Okay",
      });
      return;
    }

    setLoading(true);

    try {
      const response = await axiosInstance.post<ApiResponse>(
        "/contacts",
        formData,
      );

      MySwal.fire({
        icon: "success",
        title: "Message Sent!",
        text: "Thank you for reaching out. I'll get back to you soon!",
        background: "#1a1a1a",
        color: "#fff",
        confirmButtonColor: "#8b5cf6",
        confirmButtonText: "Awesome!",
        timer: 3000,
        timerProgressBar: true,
      });

      handleReset();
    } catch (error: unknown) {
      const err = error as ErrorResponse;
      MySwal.fire({
        icon: "error",
        title: "Error!",
        text:
          err.response?.data?.message ||
          err.message ||
          "Something went wrong. Please try again later.",
        background: "#1a1a1a",
        color: "#fff",
        confirmButtonColor: "#8b5cf6",
        confirmButtonText: "Try Again",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black px-4 sm:px-6 lg:px-8 py-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl sm:text-4xl text-white font-bold py-4">
          Contact
        </h1>
        <p className="text-xl sm:text-2xl text-gray-300 font-semibold py-4">
          Get in touch before I write another line of code!
        </p>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6 mt-8">
          {/* Name Field */}
          <div>
            <label
              htmlFor="name"
              className="block text-white font-semibold mb-2"
            >
              Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Your name, your fame"
              className="w-full px-4 py-3 bg-gray-900 border border-gray-800 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-colors"
              required
            />
          </div>

          {/* Email Field */}
          <div>
            <label
              htmlFor="email"
              className="block text-white font-semibold mb-2"
            >
              Email <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Where can I reach you back?"
              className="w-full px-4 py-3 bg-gray-900 border border-gray-800 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-colors"
              required
            />
            <p className="mt-2 text-sm text-gray-400">
              Temporary emails are also accepted, unless you wish to hear back
              😊
            </p>
          </div>

          {/* Message Field - RichTextEditor with TypeScript Support */}
          <div>
            <label
              htmlFor="message"
              className="block text-white font-semibold mb-2"
            >
              Message <span className="text-red-500">*</span>
            </label>
            <RichTextEditor
              value={formData.message}
              onChange={handleMessageChange}
              placeholder="Your words, my inbox."
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-4 px-6 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02] active:scale-[0.98]"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg
                  className="animate-spin h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Sending...
              </span>
            ) : (
              "Submit"
            )}
          </button>

          {/* Reset Button */}
          <button
            type="button"
            onClick={handleReset}
            className="w-full bg-gray-900 hover:bg-gray-800 border border-gray-800 text-white font-semibold py-4 px-6 rounded-lg transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98]"
          >
            Reset
          </button>
        </form>
      </div>
      <div className="flex py-8 items-center justify-between">
        <div className="flex items-center gap-2 px-4 py-2 rounded-md hover:bg-gray-900 cursor-pointer transition-colors">
          <IoIosArrowBack className="text-white" />
          <Link href="/experience" className="text-white font-bold">
            Experience
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;