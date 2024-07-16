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
		selectedQuestionsList: [],

		previewTestDetails: {
			// this is for preview of test questions which are not yet published
			test_id: null,
			test_name: null,
			test_duration: null,
			marks_per_question: null,
			total_questions: null,
			is_negative_marking: 0,
			negative_mark: 0,
			test_passing_mark: null,
			test_creation_type: null,
			test_created_on: null,
			todays_date: null,
		},
		testQuestionsList: [], // this is for storing of tests question for viewing

		previewPublishedTestDetails: {
			// this is for preview of test questions which are published
			test_id: null,
			test_name: null,
			test_duration: null,
			marks_per_question: null,
			total_questions: null,
			is_negative_marking: 0,
			negative_mark: 0,
			test_passing_mark: null,
			test_creation_type: null,
			test_created_on: null,
			todays_date: null,
		},
		publishedTestQuestionsList: [], // this is for storing of tests question for viewing of tests which are published
	},
	reducers: {
		setTestDetails: (state, action) => {
			let { key, value } = action.payload;
			state.test[key] = value;
		},
		updateTotalQuestionsCount: (state, action) => {
			state.test.total_questions = state.selectedQuestionsList.length;
		},

		setTestCreationType: (state, action) => {
			state.test.test_creation_type = action.payload;
		},

		setErrors: (state, action) => {
			state.errors = action.payload;
		},

		setSelectedQuestionsList: (state, action) => {
			state.selectedQuestionsList = action.payload;
		},

		// for view questions of the test
		setTestQuestionsList: (state, action) => {
			state.testQuestionsList = action.payload;
		},
		setPreviewTestDetails: (state, { payload }) => {
			console.log(payload, '==payload==');
			state.previewTestDetails.test_id = payload.id;
			state.previewTestDetails.test_name = payload.mt_name;
			state.previewTestDetails.test_duration = payload.mt_test_time;
			state.previewTestDetails.marks_per_question =
				payload.mt_mark_per_question;
			state.previewTestDetails.total_questions = payload.mt_total_test_question;
			state.previewTestDetails.is_negative_marking = payload.mt_negativ_mark;
			state.previewTestDetails.negative_mark = payload.mt_negativ_mark;
			state.previewTestDetails.test_passing_mark = payload.mt_passing_out_of;

			state.previewTestDetails.test_created_on = payload.mt_added_date;

			let todaysDate = new Date();
			state.previewTestDetails.todays_date =
				todaysDate.getDate() +
				'-' +
				(todaysDate.getMonth() + 1) +
				'-' +
				todaysDate.getFullYear();
		},
		cleanupPreviewTestDetails: (state, payload) => {
			state.testQuestionsList = [];
		},

		// for the tests which are published
		setPublishedTestQuestionsList: (state, action) => {
			state.publishedTestQuestionsList = action.payload;
		},
		setPreviewPublishedTestDetails: (state, { payload }) => {
			console.log(payload, '==payload 2==');

			state.previewPublishedTestDetails.test_id = payload.ptl_test_id;
			state.previewPublishedTestDetails.test_name = payload.mt_name;
			state.previewPublishedTestDetails.test_duration = payload.mt_test_time;
			state.previewPublishedTestDetails.marks_per_question =
				payload.mt_mark_per_question;
			state.previewPublishedTestDetails.total_questions =
				payload.mt_total_test_question;
			state.previewPublishedTestDetails.is_negative_marking =
				payload.mt_negativ_mark;
			state.previewPublishedTestDetails.negative_mark = payload.mt_negativ_mark;
			state.previewPublishedTestDetails.test_passing_mark =
				payload.mt_passing_out_of;

			state.previewPublishedTestDetails.test_created_on = payload.mt_added_date;

			let todaysDate = new Date();
			state.previewPublishedTestDetails.todays_date =
				todaysDate.getDate() +
				'-' +
				(todaysDate.getMonth() + 1) +
				'-' +
				todaysDate.getFullYear();
		},
		cleanupPublishedTestDetails: (state, payload) => {
			state.publishedTestQuestionsList = [];
		},
	},
});

export const testsSliceActions = testsSlice.actions;
export default testsSlice;
