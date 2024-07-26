import { createSlice } from '@reduxjs/toolkit';

const initialState = {
	formFillingIP: null,
	studentsList: [],
	centersList: [],
	batchList: [],
	postsList: [],
};

const studentAreaSlice = createSlice({
	name: 'student-area-slice',
	initialState,
	reducers: {
		setFormFillingIP: (state, action) => {
			state.formFillingIP = action.payload;
		},

		setStudentsList: (state, action) => {
			state.studentsList = action.payload;
		},

		setCentersList: (state, action) => {
			state.centersList = action.payload;
		},

		setBatchList: (state, action) => {
			state.batchList = action.payload;
		},

		setPostsList: (state, action) => {
			state.postsList = action.payload;
		},
	},
});

export const StudentAreaActions = studentAreaSlice.actions;
export default studentAreaSlice;
