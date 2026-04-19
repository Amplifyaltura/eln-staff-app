import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './hooks/useAuth';
import Gallery from './pages/Gallery';
import Attendance from './pages/Attendance';
import Admin from './pages/Admin';
import Login from './pages/Login';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Gallery />} />
          <Route path="/attendance" element={<Attendance />} />
          <Route path="/login" element={<Login />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="*" element={<Gallery />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
