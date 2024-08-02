import { createSlice } from '@reduxjs/toolkit';

const initialState = {
	examServerIP: null,
	testsList: [],
};

const reportsSlice = createSlice({
	name: 'student-area-slice',
	initialState,
	reducers: {
		setExamServerIP: (state, action) => {
			state.examServerIP = action.payload;
		},

		setTestsList: (state, action) => {
			state.testsList = action.payload;
		},
	},
});

export const reportsAction = reportsSlice.actions;
export default reportsSlice;
