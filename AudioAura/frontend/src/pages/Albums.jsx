import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getAllAlbums } from '../api/music';
import { Disc3, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Albums() {
  const [albums, setAlbums] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAllAlbums()
      .then((res) => setAlbums(res.data.albums || []))
      .catch(() => toast.error('Failed to load albums'))
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
      <h2 className="text-xl font-bold text-white mb-5">Albums</h2>

      {albums.length === 0 ? (
        <div className="text-center py-16 text-gray-500">
          <Disc3 size={40} className="mx-auto mb-3 opacity-40" />
          <p>No albums yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {albums.map((album) => (
            <Link
              key={album._id}
              to={`/albums/${album._id}`}
              className="bg-[#181818] hover:bg-[#282828] rounded-lg p-4 transition-colors group"
            >
              {/* Album art placeholder */}
              <div className="aspect-square bg-[#282828] group-hover:bg-[#333] rounded-lg flex items-center justify-center mb-3 transition-colors">
                <Disc3 size={36} className="text-gray-600 group-hover:text-[#1db954] transition-colors" />
              </div>
              <p className="text-sm font-semibold text-white truncate">{album.title}</p>
              <p className="text-xs text-gray-400 truncate mt-0.5">
                {album.artist?.username || 'Unknown Artist'}
              </p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
