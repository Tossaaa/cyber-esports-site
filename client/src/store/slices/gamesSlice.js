import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  games: [],
  currentGame: null,
  loading: false,
  error: null,
};

const gamesSlice = createSlice({
  name: 'games',
  initialState,
  reducers: {
    fetchGamesStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchGamesSuccess: (state, action) => {
      state.loading = false;
      state.games = action.payload;
    },
    fetchGamesFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    setCurrentGame: (state, action) => {
      state.currentGame = action.payload;
    },
  },
});

export const { 
  fetchGamesStart, 
  fetchGamesSuccess, 
  fetchGamesFailure,
  setCurrentGame 
} = gamesSlice.actions;

export default gamesSlice.reducer; 