import Link from "next/link";
import { CiShare1 } from "react-icons/ci";
import { IoIosArrowForward } from "react-icons/io";
import { MdOutlineMailOutline } from "react-icons/md";

const HomePage = () => {
  return (
    <div className="mt-4">
      <h1 className="text-white text-3xl font-bold">Moshiur Rahman</h1>
      <br />
      <h1 className="text-gray-400 text-3xl font-bold">
        Code Freak , <br /> Problem Solver!
      </h1>
      <br />
      <p className="text-gray-300 text-lg font-medium">
        I am a dedicated Software Engineer specializing in full-stack
        application development. I enjoy crafting responsive web solutions using
        modern technologies like Next.js, React, Tailwind CSS, Node.js, Express,
        and MongoDB, while also applying DevOps practices, continuously aiming
        to deliver high-quality, comprehensive, user-centric software solutions.
      </p>
      <br />
      <div className="flex items-center">
        <div className="flex items-center justify-between bg-orange-700 px-4 py-2 rounded-md font-semibold">
          <a href="https://drive.google.com/file/d/1vn6i5n5Y9sH1oJSwMof22kFrp1f8PKC5/view?usp=sharing">
            Get Resume
          </a>
          <CiShare1 />
        </div>
        <div className="flex items-center cursor-pointer  px-4 py-2 rounded-md font-semibold transition-all duration-200">
          <MdOutlineMailOutline className="text-xl" />
          <a
            href="mailto:moshiurrahmandeap@gmail.com"
            className="ml-2 text-gray-300  transition-colors"
          >
            Send Mail
          </a>
        </div>
      </div>
      <br />
      <Link
        href="/about"
        className="mt-8 flex items-center justify-end gap-3 px-4 py-2 rounded-md hover:bg-gray-900 transition-colors w-fit ml-auto"
      >
        <span className="text-lg font-semibold">About Me</span>
        <IoIosArrowForward className="text-xl" />
      </Link>
    </div>
  );
};

export default HomePage;
