import { createContext, useContext, useState, useRef, useEffect } from 'react';

const PlayerContext = createContext(null);

export function PlayerProvider({ children }) {
  const [currentTrack, setCurrentTrack] = useState(null);
  const [queue, setQueue] = useState([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.8);
  const audioRef = useRef(new Audio());

  useEffect(() => {
    const audio = audioRef.current;

    const onTimeUpdate = () => setCurrentTime(audio.currentTime);
    const onDurationChange = () => setDuration(audio.duration || 0);
    const onEnded = () => {
      playNext();
    };

    audio.addEventListener('timeupdate', onTimeUpdate);
    audio.addEventListener('durationchange', onDurationChange);
    audio.addEventListener('ended', onEnded);

    return () => {
      audio.removeEventListener('timeupdate', onTimeUpdate);
      audio.removeEventListener('durationchange', onDurationChange);
      audio.removeEventListener('ended', onEnded);
    };
  }, [queue, currentTrack]);

  useEffect(() => {
    audioRef.current.volume = volume;
  }, [volume]);

  const playTrack = (track, trackQueue = []) => {
    const audio = audioRef.current;
    if (track.uri === currentTrack?.uri && isPlaying) {
      audio.pause();
      setIsPlaying(false);
      return;
    }
    audio.src = track.uri;
    audio.play();
    setCurrentTrack(track);
    setIsPlaying(true);
    if (trackQueue.length > 0) setQueue(trackQueue);
  };

  const togglePlay = () => {
    const audio = audioRef.current;
    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      audio.play();
      setIsPlaying(true);
    }
  };

  const seek = (time) => {
    audioRef.current.currentTime = time;
    setCurrentTime(time);
  };

  const playNext = () => {
    if (!currentTrack || queue.length === 0) return;
    const idx = queue.findIndex((t) => t._id === currentTrack._id);
    const next = queue[idx + 1];
    if (next) playTrack(next, queue);
  };

  const playPrev = () => {
    if (!currentTrack || queue.length === 0) return;
    const idx = queue.findIndex((t) => t._id === currentTrack._id);
    const prev = queue[idx - 1];
    if (prev) playTrack(prev, queue);
  };

  const stopTrack = () => {
    audioRef.current.pause();
    audioRef.current.src = '';
    setCurrentTrack(null);
    setIsPlaying(false);
    setCurrentTime(0);
    setDuration(0);
    setQueue([]);
  };

  return (
    <PlayerContext.Provider
      value={{
        currentTrack,
        isPlaying,
        currentTime,
        duration,
        volume,
        queue,
        playTrack,
        togglePlay,
        seek,
        playNext,
        playPrev,
        setVolume,
        stopTrack,
      }}
    >
      {children}
    </PlayerContext.Provider>
  );
}

export function usePlayer() {
  return useContext(PlayerContext);
}