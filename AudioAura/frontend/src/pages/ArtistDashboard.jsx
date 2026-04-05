import { useState, useEffect, useRef } from 'react';
import { uploadMusic, createAlbum, getAllMusics } from '../api/music';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { Upload, PlusCircle, Music2, Disc3, Loader2, CheckSquare, Square } from 'lucide-react';

export default function ArtistDashboard() {
  const { user } = useAuth();
  const fileRef = useRef(null);

  // Upload music state
  const [musicTitle, setMusicTitle] = useState('');
  const [musicFile, setMusicFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  // Create album state
  const [albumTitle, setAlbumTitle] = useState('');
  const [allMusics, setAllMusics] = useState([]);
  const [selectedTracks, setSelectedTracks] = useState([]);
  const [creatingAlbum, setCreatingAlbum] = useState(false);
  const [loadingMusics, setLoadingMusics] = useState(true);

  useEffect(() => {
    // Artists can't hit GET /music/ (that's user-only), but we try anyway
    // to build the album track selector. In production you'd add an artist route.
    getAllMusics()
      .then((res) => setAllMusics(res.data.musics || []))
      .catch(() => setAllMusics([]))
      .finally(() => setLoadingMusics(false));
  }, []);

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!musicFile) return toast.error('Please select a music file');
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append('title', musicTitle);
      fd.append('music', musicFile);
      await uploadMusic(fd);
      toast.success('Track uploaded successfully!');
      setMusicTitle('');
      setMusicFile(null);
      if (fileRef.current) fileRef.current.value = '';
      // Refresh music list
      const res = await getAllMusics().catch(() => ({ data: { musics: [] } }));
      setAllMusics(res.data.musics || []);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const toggleTrack = (id) => {
    setSelectedTracks((prev) =>
      prev.includes(id) ? prev.filter((t) => t !== id) : [...prev, id]
    );
  };

  const handleCreateAlbum = async (e) => {
    e.preventDefault();
    if (!albumTitle.trim()) return toast.error('Enter an album title');
    setCreatingAlbum(true);
    try {
      await createAlbum({ title: albumTitle, musics: selectedTracks });
      toast.success('Album created!');
      setAlbumTitle('');
      setSelectedTracks([]);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create album');
    } finally {
      setCreatingAlbum(false);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-bold text-white">Artist Dashboard</h2>
        <p className="text-gray-400 text-sm mt-1">Welcome, {user?.username} 🎤</p>
      </div>

      {/* ── Upload Music ── */}
      <section className="bg-[#181818] rounded-xl p-5">
        <div className="flex items-center gap-2 mb-4">
          <Upload size={18} className="text-[#1db954]" />
          <h3 className="font-semibold text-white">Upload a Track</h3>
        </div>
        <form onSubmit={handleUpload} className="space-y-3">
          <div>
            <label className="text-xs text-gray-400 block mb-1">Track Title</label>
            <input
              type="text"
              value={musicTitle}
              onChange={(e) => setMusicTitle(e.target.value)}
              placeholder="My Awesome Song"
              required
              className="w-full bg-[#0a0a0a] border border-[#2a2a2a] text-white rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-[#1db954] transition-colors"
            />
          </div>
          <div>
            <label className="text-xs text-gray-400 block mb-1">Audio File</label>
            <div
              onClick={() => fileRef.current?.click()}
              className="w-full bg-[#0a0a0a] border border-dashed border-[#2a2a2a] hover:border-[#1db954] text-gray-400 rounded-lg px-4 py-5 text-sm cursor-pointer transition-colors flex flex-col items-center gap-1"
            >
              <Music2 size={22} className={musicFile ? 'text-[#1db954]' : 'text-gray-600'} />
              <span className={musicFile ? 'text-white' : ''}>
                {musicFile ? musicFile.name : 'Click to select audio file'}
              </span>
              {musicFile && (
                <span className="text-xs text-gray-500">
                  {(musicFile.size / 1024 / 1024).toFixed(1)} MB
                </span>
              )}
            </div>
            <input
              ref={fileRef}
              type="file"
              accept="audio/*"
              className="hidden"
              onChange={(e) => setMusicFile(e.target.files[0])}
            />
          </div>
          <button
            type="submit"
            disabled={uploading}
            className="w-full bg-[#1db954] hover:bg-[#1ed760] text-black font-semibold py-2.5 rounded-full text-sm transition-colors flex items-center justify-center gap-2 disabled:opacity-60"
          >
            {uploading ? <Loader2 size={15} className="animate-spin" /> : <Upload size={15} />}
            {uploading ? 'Uploading...' : 'Upload Track'}
          </button>
        </form>
      </section>

      {/* ── Create Album ── */}
      <section className="bg-[#181818] rounded-xl p-5">
        <div className="flex items-center gap-2 mb-4">
          <PlusCircle size={18} className="text-[#1db954]" />
          <h3 className="font-semibold text-white">Create an Album</h3>
        </div>
        <form onSubmit={handleCreateAlbum} className="space-y-4">
          <div>
            <label className="text-xs text-gray-400 block mb-1">Album Title</label>
            <input
              type="text"
              value={albumTitle}
              onChange={(e) => setAlbumTitle(e.target.value)}
              placeholder="My Debut Album"
              required
              className="w-full bg-[#0a0a0a] border border-[#2a2a2a] text-white rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-[#1db954] transition-colors"
            />
          </div>

          {/* Track selector */}
          <div>
            <label className="text-xs text-gray-400 block mb-2">
              Select Tracks ({selectedTracks.length} selected)
            </label>
            {loadingMusics ? (
              <div className="flex items-center gap-2 text-gray-500 text-sm py-2">
                <Loader2 size={14} className="animate-spin" /> Loading tracks...
              </div>
            ) : allMusics.length === 0 ? (
              <p className="text-gray-500 text-sm py-2">
                No tracks available. Upload some tracks first.
              </p>
            ) : (
              <div className="space-y-1 max-h-52 overflow-y-auto pr-1">
                {allMusics.map((track) => {
                  const selected = selectedTracks.includes(track._id);
                  return (
                    <div
                      key={track._id}
                      onClick={() => toggleTrack(track._id)}
                      className={`flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer transition-colors ${
                        selected ? 'bg-[#1db95420]' : 'hover:bg-[#0a0a0a]'
                      }`}
                    >
                      {selected
                        ? <CheckSquare size={16} className="text-[#1db954] shrink-0" />
                        : <Square size={16} className="text-gray-500 shrink-0" />
                      }
                      <div className="min-w-0">
                        <p className="text-sm text-white truncate">{track.title}</p>
                        <p className="text-xs text-gray-500 truncate">
                          {track.artist?.username || 'Unknown'}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={creatingAlbum}
            className="w-full bg-[#1db954] hover:bg-[#1ed760] text-black font-semibold py-2.5 rounded-full text-sm transition-colors flex items-center justify-center gap-2 disabled:opacity-60"
          >
            {creatingAlbum ? <Loader2 size={15} className="animate-spin" /> : <Disc3 size={15} />}
            {creatingAlbum ? 'Creating...' : 'Create Album'}
          </button>
        </form>
      </section>
    </div>
  );
}
