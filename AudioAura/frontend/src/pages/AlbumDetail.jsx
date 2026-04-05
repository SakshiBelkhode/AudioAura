import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getAlbumById } from '../api/music';
import { usePlayer } from '../context/PlayerContext';
import { Play, Pause, Music2, Disc3, ArrowLeft, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

export default function AlbumDetail() {
  const { albumId } = useParams();
  const navigate = useNavigate();
  const [album, setAlbum] = useState(null);
  const [loading, setLoading] = useState(true);
  const { playTrack, currentTrack, isPlaying } = usePlayer();

  useEffect(() => {
    getAlbumById(albumId)
      .then((res) => setAlbum(res.data.album))
      .catch(() => toast.error('Failed to load album'))
      .finally(() => setLoading(false));
  }, [albumId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 size={28} className="animate-spin text-[#1db954]" />
      </div>
    );
  }

  if (!album) {
    return (
      <div className="text-center py-16 text-gray-500">
        <p>Album not found.</p>
      </div>
    );
  }

  const tracks = album.musics || [];

  const playAll = () => {
    if (tracks.length > 0) playTrack(tracks[0], tracks);
  };

  return (
    <div>
      {/* Back */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-gray-400 hover:text-white text-sm mb-5 transition-colors"
      >
        <ArrowLeft size={16} /> Back
      </button>

      {/* Album header */}
      <div className="flex items-end gap-5 mb-6">
        <div className="w-28 h-28 sm:w-36 sm:h-36 bg-[#282828] rounded-lg flex items-center justify-center shrink-0">
          <Disc3 size={48} className="text-gray-600" />
        </div>
        <div className="min-w-0">
          <p className="text-xs text-gray-400 uppercase tracking-widest mb-1">Album</p>
          <h2 className="text-xl sm:text-3xl font-bold text-white truncate">{album.title}</h2>
          <p className="text-sm text-gray-400 mt-1">
            {album.artist?.username || 'Unknown Artist'} · {tracks.length} song{tracks.length !== 1 ? 's' : ''}
          </p>
        </div>
      </div>

      {/* Play button */}
      {tracks.length > 0 && (
        <button
          onClick={playAll}
          className="flex items-center gap-2 bg-[#1db954] hover:bg-[#1ed760] text-black font-semibold px-6 py-2.5 rounded-full text-sm transition-colors mb-6"
        >
          <Play size={16} /> Play All
        </button>
      )}

      {/* Track list */}
      {tracks.length === 0 ? (
        <div className="text-center py-10 text-gray-500">
          <Music2 size={32} className="mx-auto mb-2 opacity-40" />
          <p>No tracks in this album yet.</p>
        </div>
      ) : (
        <div className="space-y-1">
          {tracks.map((track, idx) => {
            const isActive = currentTrack?._id === track._id;
            return (
              <div
                key={track._id}
                onClick={() => playTrack(track, tracks)}
                className={`flex items-center gap-4 px-3 py-3 rounded-lg cursor-pointer transition-colors group ${
                  isActive ? 'bg-[#1a1a1a]' : 'hover:bg-[#1a1a1a]'
                }`}
              >
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
                <div className="w-9 h-9 bg-[#282828] rounded flex items-center justify-center shrink-0">
                  <Music2 size={14} className={isActive ? 'text-[#1db954]' : 'text-gray-400'} />
                </div>
                <div className="min-w-0 flex-1">
                  <p className={`text-sm font-medium truncate ${isActive ? 'text-[#1db954]' : 'text-white'}`}>
                    {track.title}
                  </p>
                  <p className="text-xs text-gray-400 truncate">
                    {track.artist?.username || album.artist?.username || 'Unknown'}
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
