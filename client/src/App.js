// src/App.js
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MainPage from "./pages/MainPage";
import SearchPage from "./pages/SearchPage";
import ProfilePage from "./pages/ProfilePage";
import Cs2Page from './pages/Cs2Page';
import DotaPage from "./pages/DotaPage";
import PUBGPage from "./pages/PubgPage";
import ValorantPage from "./pages/ValorantPage";
import AuthPage from "./pages/AuthPage.jsx";
import NewsPage from "./pages/NewsPage";
import TournamentForm from './components/TournamentForm';
import { AuthProvider } from './contexts/AuthContext';
import Layout from './components/Layout/Layout';
import ScrollToTop from './components/ScrollToTop';

function App() {
  return (
    <Router>
      <AuthProvider>
        <ScrollToTop />
        <Layout>
          <Routes>
            <Route path="/" element={<MainPage />} />
            <Route path="/search" element={<SearchPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/discipline/cs2" element={<Cs2Page />} />
            <Route path="/discipline/dota" element={<DotaPage />} />
            <Route path="/discipline/pubg" element={<PUBGPage />} />
            <Route path="/discipline/valorant" element={<ValorantPage />} />
            <Route path="/auth" element={<AuthPage />} />
            <Route path="/news" element={<NewsPage />} />
            <Route path="/tournaments/add" element={<TournamentForm />} />
          </Routes>
        </Layout>
      </AuthProvider>
    </Router>
  );
}

export default App;
