import Link from "next/link";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";

const AboutPage = () => {
  return (
    <div className="py-4">
      <h1 className="text-3xl font-bold text-white">About Moshiur</h1>
      <p className="text-gray-400 py-4 font-bold text-3xl">
        More than just a title -- let&apos;s dive about me deeper!
      </p>
      <p className="text-gray-200 font-medium py-4 text-lg leading-relaxed">
        I`m a passionate full-stack web developer focused on building modern,
        high-performance, and user-centric digital experiences. I specialize in
        creating scalable web applications using technologies like React,
        Next.js, and Node.js, with a strong emphasis on clean architecture and
        intuitive UI/UX.
        <br />
        <br />
        Beyond just writing code, I aim to solve real-world problems through
        thoughtful design and efficient engineering. I pay close attention to
        performance, responsiveness, and maintainability—ensuring every project
        is not only visually appealing but also robust under the hood.
        <br />
        <br />I enjoy collaborating with clients and teams worldwide, turning
        ideas into impactful products. Whether it&apos;s building from scratch
        or improving an existing system, I bring dedication, adaptability, and a
        continuous learning mindset to every project I take on.
      </p>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 px-4 py-2 rounded-md hover:bg-gray-900 cursor-pointer">
          <IoIosArrowBack />
          <Link href="/" className="text-white font-bold">
            Intro
          </Link>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 rounded-md hover:bg-gray-900 cursor-pointer">
          <Link href="/projects" className="text-white font-bold">
            Projects
          </Link>
          <IoIosArrowForward />
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
