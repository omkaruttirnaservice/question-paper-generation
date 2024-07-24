import { createSlice } from '@reduxjs/toolkit';

const initialState = {
	formFillingIP: null,
};

const studentAreaSlice = createSlice({
	name: 'student-area-slice',
	initialState,
	reducers: {
		setFormFillingIP: (state, action) => {
			state.formFillingIP = action.payload;
		},
	},
});

export const StudentAreaActions = studentAreaSlice.actions;
export default studentAreaSlice;
