import api from './axios';

// Upload a new music track (artist only) — multipart form
export const uploadMusic = (formData) =>
  api.post('/music/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });

// Create an album (artist only)
export const createAlbum = (data) => api.post('/music/album', data);

// Get all music tracks (user only)
export const getAllMusics = () => api.get('/music/');

// Get all albums (user only)
export const getAllAlbums = () => api.get('/music/albums');

// Get a single album by ID with its tracks
export const getAlbumById = (albumId) => api.get(`/music/albums/${albumId}`);
