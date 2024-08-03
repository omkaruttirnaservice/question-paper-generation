import { createSlice } from '@reduxjs/toolkit';

const initialState = {
	examServerIP: null,
	testsList: [],

	viewTestReportDetails: [], // this are the deitals of which the results list are being displayed
	resultsList: [],
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

		setViewTestReportDetails: (state, action) => {
			state.viewTestReportDetails = action.payload;
		},

		setResultsList: (state, action) => {
			state.resultsList = action.payload;
		},
	},
});

export const reportsAction = reportsSlice.actions;
export default reportsSlice;
