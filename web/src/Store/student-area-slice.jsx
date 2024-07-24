import { createSlice } from '@reduxjs/toolkit';

const initialState = {
	formFillingIP: null,
	studentsList: [],
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
	},
});

export const StudentAreaActions = studentAreaSlice.actions;
export default studentAreaSlice;
