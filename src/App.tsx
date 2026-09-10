import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { LanguageProvider } from '@/contexts/LanguageContext';
import { ThemeProvider } from '@/contexts/ThemeContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Home from '@/pages/Home';
import Patriarchs from '@/pages/Patriarchs';
import PatriarchDetails from '@/pages/PatriarchDetails';
import Timeline from '@/pages/Timeline';
import About from '@/pages/About';
import Sources from '@/pages/Sources';
import FaithPage from '@/pages/FaithPage';
import Admin from '@/pages/Admin';
import AdminParticles from '@/components/AdminParticles';

function App() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <BrowserRouter>
          <div className="site-shell relative min-h-screen flex flex-col">
          <AdminParticles />
          <div className="relative z-10 flex min-h-screen flex-col">
          <Navbar />
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/patriarchs" element={<Patriarchs />} />
              <Route path="/patriarchs/:id" element={<PatriarchDetails />} />
              <Route path="/timeline" element={<Timeline />} />
              <Route path="/about" element={<About />} />
              <Route path="/sources" element={<Sources />} />
              <Route path="/faith" element={<FaithPage />} />
              <Route path="/admin" element={<Admin />} />
            </Routes>
          </main>
          <Footer />
          </div>
          </div>
        </BrowserRouter>
      </LanguageProvider>
    </ThemeProvider>
  );
}

export default App;
