import { createSlice } from '@reduxjs/toolkit';

const testsSlice = createSlice({
	name: 'tests-slice',
	initialState: {
		test: {
			test_name: null,
			test_duration: null,
			marks_per_question: null,
			total_questions: null,
			is_negative_marking: 0,
			negative_mark: 0,
			test_passing_mark: null,
			test_creation_type: null,
		},
		errors: {},
	},
	reducers: {
		setTestDetails: (state, action) => {
			let { key, value } = action.payload;
			state.test[key] = value;
		},
		updateTotalQuestionsCount: (state, action) => {
			state.test.total_questions = action.payload;
		},

		setTestCreationType: (state, action) => {
			state.test.test_creation_type = action.payload;
		},

		setErrors: (state, action) => {
			console.log(action.payload, '==action.payload==');
			state.errors = action.payload;
		},
	},
});

export const testsSliceActions = testsSlice.actions;
export default testsSlice;
