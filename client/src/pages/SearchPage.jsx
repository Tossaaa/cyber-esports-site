// src/pages/SearchPage.js
import React, { useState } from "react";

function SearchPage() {
  const [searchQuery, setSearchQuery] = useState("");
  
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    // TODO: Добавить логику для поиска новостей
  };

  return (
    <div>
      <h1>Поиск</h1>
      <form onSubmit={handleSearchSubmit}>
        <input
          type="text"
          placeholder="Введите запрос"
          value={searchQuery}
          onChange={handleSearchChange}
        />
        <button type="submit">Поиск</button>
      </form>
    </div>
  );
}

export default SearchPage;
