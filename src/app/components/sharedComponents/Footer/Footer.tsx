const Footer = () => {
  return (
    <div>
      {/* footer */}
      <div>
        <hr className="text-gray-600" />
        <p className="text-gray-500 text-center py-2">
          &copy; {new Date().getFullYear()} Moshiur Rahman. All rights reserved.
        </p>
        <p className="text-gray-500 text-center ">
          Built with <span className="font-bold text-white">Next.js</span> and
          <span className="font-bold text-white"> Tailwind CSS</span>.
        </p>
        <p className="text-gray-500 text-center">
          Developed By{" "}
          <span className="font-bold text-orange-700">Moshiur Rahman</span>
        </p>
      </div>
    </div>
  );
};

export default Footer;
