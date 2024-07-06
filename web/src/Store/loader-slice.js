import react from 'react';
import { createSlice } from '@reduxjs/toolkit';

export const loaderSlice = createSlice({
    name: 'loader-slice',
    initialState: { isLoading: false },
    reducers: {
        showLoader(state, action) {
            state.isLoading = true;
        },
        hideLoader(state, action) {
            state.isLoading = false;
        },
    },
});

export const loaderActions = loaderSlice.actions;
