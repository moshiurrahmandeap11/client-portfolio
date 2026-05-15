import Link from "next/link";

const Footer = () => {
  return (
    <footer className="mt-20">
      <div className="max-w-7xl mx-auto px-4">
        <hr className="border-gray-800 mb-6" />

        {/* Footer Links */}
        <div className="flex items-center justify-center gap-6 flex-wrap mb-4">
          <Link
            href="/privacy-policy"
            className="text-gray-500 hover:text-white transition duration-300"
          >
            Privacy Policy
          </Link>

          <Link
            href="/terms"
            className="text-gray-500 hover:text-white transition duration-300"
          >
            Terms & Conditions
          </Link>

          <Link
            href="/contact"
            className="text-gray-500 hover:text-white transition duration-300"
          >
            Contact
          </Link>
        </div>

        {/* Copyright */}
        <p className="text-gray-500 text-center py-2">
          &copy; {new Date().getFullYear()} Moshiur Rahman. All rights reserved.
        </p>

        {/* Tech Stack */}
        <p className="text-gray-500 text-center">
          Built with{" "}
          <span className="font-bold text-white">Next.js</span> and
          <span className="font-bold text-white">
            {" "}
            Tailwind CSS
          </span>
          .
        </p>

        {/* Developer */}
        <p className="text-gray-500 text-center pb-4">
          Developed By{" "}
          <span className="font-bold text-orange-700">
            Moshiur Rahman
          </span>
        </p>
      </div>
    </footer>
  );
};

export default Footer;