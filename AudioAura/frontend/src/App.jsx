import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import { PlayerProvider } from './context/PlayerContext';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import Albums from './pages/Albums';
import AlbumDetail from './pages/AlbumDetail';
import ArtistDashboard from './pages/ArtistDashboard';

function AppRoutes() {
  const { user } = useAuth();

  return (
    <Routes>
      <Route path="/login" element={user ? <Navigate to="/" replace /> : <Login />} />
      <Route path="/register" element={user ? <Navigate to="/" replace /> : <Register />} />

      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      >
        <Route
          index
          element={
            user?.role === 'artist'
              ? <Navigate to="/dashboard" replace />
              : <Home />
          }
        />
        <Route
          path="albums"
          element={
            <ProtectedRoute requiredRole="user">
              <Albums />
            </ProtectedRoute>
          }
        />
        <Route
          path="albums/:albumId"
          element={
            <ProtectedRoute requiredRole="user">
              <AlbumDetail />
            </ProtectedRoute>
          }
        />
        <Route
          path="dashboard"
          element={
            <ProtectedRoute requiredRole="artist">
              <ArtistDashboard />
            </ProtectedRoute>
          }
        />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <PlayerProvider>
          <AppRoutes />
          <Toaster
            position="top-center"
            toastOptions={{
              style: {
                background: '#282828',
                color: '#fff',
                border: '1px solid #3a3a3a',
                fontSize: '14px',
              },
              success: {
                iconTheme: { primary: '#1db954', secondary: '#000' },
              },
            }}
          />
        </PlayerProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
