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

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/search" element={<SearchPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/discipline/cs2" element={<Cs2Page />} />
        <Route path="/discipline/dota" element={<DotaPage />} />
        <Route path="/discipline/pubg" element={<PUBGPage />} />
        <Route path="/discipline/valorant" element={<ValorantPage />} />
      </Routes>
    </Router>
  );
}

export default App;
