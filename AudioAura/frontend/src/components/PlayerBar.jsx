import { usePlayer } from "../context/PlayerContext";
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
  Music2,
  X,
} from "lucide-react";

function formatTime(sec) {
  if (!sec || isNaN(sec)) return "0:00";
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export default function PlayerBar() {
  const {
    currentTrack,
    isPlaying,
    currentTime,
    duration,
    volume,
    togglePlay,
    seek,
    playNext,
    playPrev,
    setVolume,
    stopTrack,
  } = usePlayer();

  if (!currentTrack) return null;

  const progress = duration ? (currentTime / duration) * 100 : 0;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-[#111] border-t border-[#282828] px-4 py-3 flex flex-col gap-2">
      {/* Progress bar */}
      <div className="flex items-center gap-2 text-xs text-gray-400">
        <span className="w-9 text-right">{formatTime(currentTime)}</span>
        <input
          type="range"
          min={0}
          max={duration || 100}
          value={currentTime}
          onChange={(e) => seek(Number(e.target.value))}
          className="flex-1"
          style={{
            background: `linear-gradient(to right, #1db954 ${progress}%, #3a3a3a ${progress}%)`,
          }}
        />
        <span className="w-9">{formatTime(duration)}</span>
      </div>

      {/* Track info + controls + volume */}
      <div className="flex items-center justify-between gap-3">
        {/* Track info */}
        <div className="flex items-center gap-3 min-w-0 flex-1">
          <div className="w-10 h-10 bg-[#282828] rounded flex items-center justify-center shrink-0">
            <Music2 size={18} className="text-[#1db954]" />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-medium text-white truncate">
              {currentTrack.title}
            </p>
            <p className="text-xs text-gray-400 truncate">
              {currentTrack.artist?.username || "Unknown Artist"}
            </p>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-3">
          <button
            onClick={playPrev}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <SkipBack size={20} />
          </button>
          <button
            onClick={togglePlay}
            className="w-9 h-9 bg-white rounded-full flex items-center justify-center hover:scale-105 transition-transform"
          >
            {isPlaying ? (
              <Pause size={18} className="text-black" />
            ) : (
              <Play size={18} className="text-black ml-0.5" />
            )}
          </button>
          <button
            onClick={playNext}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <SkipForward size={20} />
          </button>
        </div>

        {/* Volume — hidden on small screens */}
        <div className="hidden sm:flex items-center gap-2 flex-1 justify-end">
          <button
            onClick={() => setVolume(volume === 0 ? 0.8 : 0)}
            className="text-gray-400 hover:text-white transition-colors"
          >
            {volume === 0 ? <VolumeX size={18} /> : <Volume2 size={18} />}
          </button>
          <input
            type="range"
            min={0}
            max={1}
            step={0.01}
            value={volume}
            onChange={(e) => setVolume(Number(e.target.value))}
            className="w-24"
            style={{
              background: `linear-gradient(to right, #1db954 ${volume * 100}%, #3a3a3a ${volume * 100}%)`,
            }}
          />
        </div>

        {/* Close button */}
        <button
          onClick={stopTrack}
          className="text-gray-500 hover:text-white transition-colors ml-1 shrink-0"
          title="Close player"
        >
          <X size={18} />
        </button>
      </div>
    </div>
  );
}
