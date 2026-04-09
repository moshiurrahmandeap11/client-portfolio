import Link from "next/link";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";

const ExperiencePage = () => {
  const experiences = [
    {
      title: "Freelance Web Developer",
      company: "Self-Employed",
      type: null,
      period: "Jun. 2025 - Present",
      latest: false,
      description:
        "Working independently with clients worldwide, successfully delivering 20+ projects ranging from dynamic web applications to custom APIs — all from home.",
    },
    {
      title: "Full Stack Web Developer",
      company: "Projukti Sheba",
      type: "Contractual",
      period: "Jan. 2026 - Present",
      latest: true,
      description:
        "Currently responsible for developing responsive front-end designs, architecting RESTful APIs, and integrating external services — ensuring high-quality delivery under a contractual engagement.",
    },
    {
      title: "Full Stack Web Developer",
      company: "Projukti Sheba",
      type: "Remote",
      period: "Jun. 2025 - Dec. 2025",
      latest: false,
      description:
        "Designed responsive front-end interfaces, built RESTful APIs, and integrated third-party services to deliver seamless user experiences in a fully remote environment.",
    },
    {
      title: "Full Stack Web Developer",
      company: "Projukti Sheba",
      type: null,
      period: "Jan. 2025 - Jun. 2025",
      latest: false,
      description:
        "Developed and maintained modern web applications using the MERN stack — MongoDB, Express.js, React.js, and Node.js — contributing to scalable and performant full-stack solutions.",
    },
  ];

  return (
    <div>
      <h1 className="text-3xl text-white font-bold py-4">Experience</h1>
      <p className="text-3xl font-semibold text-gray-300 py-4">
        You need it to get the job, but the job`s what gives it!
      </p>
      <p className="text-lg text-gray-200 font-medium py-4">
        Throughout my journey as a developer, I have had the opportunity to work
        with cutting-edge technologies while also mastering the fine art of
        debugging at 2 AM. From building dynamic web applications to deciphering
        cryptic error messages, my experience has been a mix of structured
        learning and spontaneous problem-solving. Each project and internship
        has sharpened my ability to write clean code, collaborate effectively,
        and most importantly—fix bugs before they fix me.
      </p>

      {/* Timeline */}
      <div className="relative mt-6">
        {/* Vertical line */}
        <div className="absolute left-4 top-0 bottom-0 w-px bg-orange-700" />

        <div className="flex flex-col gap-10">
          {experiences.map((exp, index) => (
            <div key={index} className="flex items-start gap-6 relative">
              {/* Icon dot */}
              <div className="relative z-10 shrink-0 w-8 h-8 rounded-full bg-orange-700 flex items-center justify-center shadow-lg shadow-indigo-900">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-4 h-4 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 12h6m-6 4h6m2 4H7a2 2 0 01-2-2V6a2 2 0 012-2h7l5 5v11a2 2 0 01-2 2z"
                  />
                </svg>
              </div>

              {/* Content */}
              <div className="flex-1 pb-2">
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <h2 className="text-white font-bold text-lg leading-tight">
                    {exp.title} · {exp.company}
                  </h2>
                  {exp.latest && (
                    <span className="text-xs font-semibold bg-orange-700 text-white px-2 py-0.5 rounded-full">
                      Latest
                    </span>
                  )}
                  {exp.type && (
                    <span className="text-xs font-semibold bg-gray-700 text-gray-300 px-2 py-0.5 rounded-full">
                      {exp.type}
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-400 mb-3">{exp.period}</p>
                <p className="text-gray-300 text-base leading-relaxed">
                  {exp.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="flex py-8 items-center justify-between">
        <div className="flex items-center gap-2 px-4 py-2 rounded-md hover:bg-gray-900 cursor-pointer">
          <IoIosArrowBack />
          <Link href="/skills-tools" className="text-white font-bold">
            Skills & Tools
          </Link>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 rounded-md hover:bg-gray-900 cursor-pointer">
          <Link href="/contact" className="text-white font-bold">
            Contact
          </Link>
          <IoIosArrowForward />
        </div>
      </div>
    </div>
  );
};

export default ExperiencePage;
