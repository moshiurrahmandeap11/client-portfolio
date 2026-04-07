import { useEffect, useState } from "react";
import { MdOutlineWindow } from "react-icons/md";

const SearchBox = () => {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key === "k") {
        e.preventDefault();
        setIsOpen(true);
      }

      if (e.key === "Escape") {
        setIsOpen(false);
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, []);

  return (
    <div>
      <div className="relative group mt-2">
        <div className="flex text-lg items-center group-hover:text-white transition-all duration-100 absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
          <MdOutlineWindow />
          <span>K</span>
        </div>
        <input
          type="text"
          placeholder="Search Sections... "
          onClick={() => setIsOpen(true)}
          readOnly
          className="px-6 py-1 rounded-lg placeholder:text-gray-400 placeholder:font-medium placeholder:text-lg group-hover:placeholder:text-white bg-black/80 border-2 border-gray-500 text-gray-300 outline-none transition-all duration-200"
        />
      </div>

      {isOpen && (
        <div
          className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 transition-opacity duration-200 ease-out opacity-100 animate-fadeIn"
          onClick={() => setIsOpen(false)}
        >
          <div
            className="bg-gray-900 p-6 rounded-xl w-100 transform scale-90 duration-200 ease-out animate-scaleIn"
            onClick={(e) => e.stopPropagation()}
          >
            {/* modal input  */}
            <input
              autoFocus
              type="text"
              placeholder="Search Sections..."
              className="w-full px-3 py-2 rounded-md bg-gray-800 text-gray-400 hover:text-white outline-none"
            />

            <ul className="space-y-2">
              <li className="hover:bg-gray-800 p-2 rounded cursor-pointer">
                Home
              </li>
              <li className="hover:bg-gray-800 p-2 rounded cursor-pointer">
                Projects
              </li>
              <li className="hover:bg-gray-800 p-2 rounded cursor-pointer">
                Contact
              </li>
            </ul>

            {/* close button */}
            <button
              onClick={() => setIsOpen(false)}
              className="mt-4 text-sm text-gray-400 hover:text-white"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchBox;
