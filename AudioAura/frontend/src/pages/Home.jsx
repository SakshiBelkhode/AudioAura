import { useEffect, useState } from 'react';
import { getAllMusics } from '../api/music';
import { usePlayer } from '../context/PlayerContext';
import { Play, Pause, Music2, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Home() {
  const [musics, setMusics] = useState([]);
  const [loading, setLoading] = useState(true);
  const { playTrack, currentTrack, isPlaying } = usePlayer();

  useEffect(() => {
    getAllMusics()
      .then((res) => setMusics(res.data.musics || []))
      .catch(() => toast.error('Failed to load music'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 size={28} className="animate-spin text-[#1db954]" />
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-xl font-bold text-white mb-5">All Songs</h2>

      {musics.length === 0 ? (
        <div className="text-center py-16 text-gray-500">
          <Music2 size={40} className="mx-auto mb-3 opacity-40" />
          <p>No songs yet. Artists will upload soon!</p>
        </div>
      ) : (
        <div className="space-y-1">
          {musics.map((track, idx) => {
            const isActive = currentTrack?._id === track._id;
            return (
              <div
                key={track._id}
                onClick={() => playTrack(track, musics)}
                className={`flex items-center gap-4 px-3 py-3 rounded-lg cursor-pointer transition-colors group ${
                  isActive ? 'bg-[#1a1a1a]' : 'hover:bg-[#1a1a1a]'
                }`}
              >
                {/* Index / Play indicator */}
                <div className="w-6 text-center shrink-0">
                  {isActive && isPlaying ? (
                    <Pause size={14} className="text-[#1db954] mx-auto" />
                  ) : (
                    <>
                      <span className={`text-sm group-hover:hidden ${isActive ? 'text-[#1db954]' : 'text-gray-500'}`}>
                        {idx + 1}
                      </span>
                      <Play size={14} className="text-white mx-auto hidden group-hover:block" />
                    </>
                  )}
                </div>

                {/* Icon */}
                <div className="w-10 h-10 bg-[#282828] rounded flex items-center justify-center shrink-0">
                  <Music2 size={16} className={isActive ? 'text-[#1db954]' : 'text-gray-400'} />
                </div>

                {/* Title + Artist */}
                <div className="min-w-0 flex-1">
                  <p className={`text-sm font-medium truncate ${isActive ? 'text-[#1db954]' : 'text-white'}`}>
                    {track.title}
                  </p>
                  <p className="text-xs text-gray-400 truncate">
                    {track.artist?.username || 'Unknown Artist'}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
