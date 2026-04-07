import { useRef, useState } from "react";
import { FaMusic } from "react-icons/fa";

const MusicBox = () => {
  const [isPlaying, setIsPlaying] = useState(false);

  //   audio ref
  const audioRef = useRef<HTMLAudioElement>(null);

  const toggleMusic = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play();
      setIsPlaying(true);
    }
  };

  return (
    <div>
      {/* music icon */}
      <FaMusic
        className={`text-xl mt-1 cursor-pointer transition-colors duration-200 ${isPlaying ? "text-red-800" : "text-gray-400"}`}
        onClick={toggleMusic}
      />
      <audio ref={audioRef} src="/music.mp3" />
    </div>
  );
};

export default MusicBox;
