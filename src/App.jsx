import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { BacklogProvider } from './context/BacklogContext';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import GameDetailsPage from './pages/GameDetailsPage';
import BacklogPage from './pages/BacklogPage';
import AboutPage from './pages/AboutPage';
import NotFoundPage from './pages/NotFoundPage';
import './App.css';

function App() {
  return (
    <BacklogProvider>
      <BrowserRouter>
        <div className="app">
          <Header />
          <main className="main-content">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/games/:id" element={<GameDetailsPage />} />
              <Route path="/backlog" element={<BacklogPage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </BrowserRouter>
    </BacklogProvider>
  );
}

export default App;