import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Gallery from './pages/Gallery';
import Admin from './pages/Admin';
import Attendance from './pages/Attendance';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Gallery />} />
        <Route path="/attendance" element={<Attendance />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="*" element={<Gallery />} />
      </Routes>
    </BrowserRouter>
  );
}
