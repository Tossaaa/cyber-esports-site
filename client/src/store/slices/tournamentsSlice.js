import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  tournaments: [],
  currentTournament: null,
  loading: false,
  error: null,
};

const tournamentsSlice = createSlice({
  name: 'tournaments',
  initialState,
  reducers: {
    fetchTournamentsStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchTournamentsSuccess: (state, action) => {
      state.loading = false;
      state.tournaments = action.payload;
    },
    fetchTournamentsFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    setCurrentTournament: (state, action) => {
      state.currentTournament = action.payload;
    },
  },
});

export const { 
  fetchTournamentsStart, 
  fetchTournamentsSuccess, 
  fetchTournamentsFailure,
  setCurrentTournament 
} = tournamentsSlice.actions;

export default tournamentsSlice.reducer; 