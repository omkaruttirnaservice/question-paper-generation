import { createSlice } from '@reduxjs/toolkit';

const initialState = {
	examServerIP: null,
	testsList: [],

	testDetails: [],
	viewTestReportDetails: [], // this are the deitals of which the results list are being displayed
	resultsList: [],

	studTestDetails: [],
	singleStudentViewReport: [], // this stores all details of single student result
};

const reportsSlice = createSlice({
	name: 'student-area-slice',
	initialState,
	reducers: {
		setExamServerIP: (state, action) => {
			state.examServerIP = action.payload;
		},

		setTestDetails: (state, action) => {
			state.testDetails = action.payload;
		},

		setTestsList: (state, action) => {
			state.testsList = action.payload;
		},

		setViewTestReportDetails: (state, action) => {
			state.viewTestReportDetails = action.payload;
			if (action.payload?.ptl_test_info) {
				let [_testDetails] = JSON.parse(action.payload.ptl_test_info);
				state.testDetails = _testDetails;
			}
		},

		setResultsList: (state, action) => {
			state.resultsList = action.payload;
		},

		setSingleStudentViewReport: (state, action) => {
			state.singleStudentViewReport = action.payload;
			if (action.payload?.studExam?.ptl_test_info) {
				let [_testDetails] = JSON.parse(action.payload.studExam.ptl_test_info);
				state.studTestDetails = _testDetails;
			}
		},
	},
});

export const reportsAction = reportsSlice.actions;
export default reportsSlice;
