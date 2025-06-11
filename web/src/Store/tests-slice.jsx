let SERVER_IP = import.meta.env.VITE_API_SERVER_IP;
import { createSlice } from '@reduxjs/toolkit';
import Swal from 'sweetalert2';

const TEST_INITIAL_STATE = {
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
	isTestDetailsFilled: false,

	topicList: [], // this is the topic list which includes questions count as well
	selectedTopicList: [], // this is list of topics in test chart
	errors: {},
	selectedQuestionsList: [],
	sortedSelectedQuestionsList: [],

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
};

const testsSlice = createSlice({
	name: 'tests-slice',
	initialState: TEST_INITIAL_STATE,
	// initialState: {
	// 	test: {
	// 		test_name: 'Demo 1',
	// 		test_duration: 90,
	// 		marks_per_question: 1,
	// 		total_questions: null,
	// 		is_negative_marking: 0,
	// 		negative_mark: 0,
	// 		test_passing_mark: 20,
	// 		test_creation_type: 'Auto',
	// 	},
	// 	errors: {},
	// 	selectedQuestionsList: [],

	// 	previewTestDetails: {
	// 		// this is for preview of test questions which are not yet published
	// 		test_id: null,
	// 		test_name: null,
	// 		test_duration: null,
	// 		marks_per_question: null,
	// 		total_questions: null,
	// 		is_negative_marking: 0,
	// 		negative_mark: 0,
	// 		test_passing_mark: null,
	// 		test_creation_type: null,
	// 		test_created_on: null,
	// 		todays_date: null,
	// 	},
	// 	testQuestionsList: [], // this is for storing of tests question for viewing

	// 	previewPublishedTestDetails: {
	// 		// this is for preview of test questions which are published
	// 		test_id: null,
	// 		test_name: null,
	// 		test_duration: null,
	// 		marks_per_question: null,
	// 		total_questions: null,
	// 		is_negative_marking: 0,
	// 		negative_mark: 0,
	// 		test_passing_mark: null,
	// 		test_creation_type: null,
	// 		test_created_on: null,
	// 		todays_date: null,
	// 	},
	// 	publishedTestQuestionsList: [], // this is for storing of tests question for viewing of tests which are published
	// },
	reducers: {
		setTestDetailsFilled: (state, action) => {
			state.isTestDetailsFilled = action.payload;
		},
		setTopicList: (state, action) => {
			// this is the topic list which includes questions count as well
			state.topicList = action.payload;
		},

		setSelectedTopicList: (state, action) => {
			// this is list of topics in test chart
			state.selectedTopicList = action.payload;
		},

		setTestDetails: (state, action) => {
			let { key, value } = action.payload;
			state.test[key] = value;
		},
		updateTotalQuestionsCount: (state, action) => {
			state.test.total_questions = state.selectedQuestionsList.length;
		},
		updateTotalQuestionsCount_AUTO_TEST: (state, action) => {
			state.test.total_questions = action.payload;
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

		setPreviewTestDetailsId: (state, action) => {
			state.previewTestDetails.test_id = action.payload;
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
			state.previewTestDetails = {
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
			};
		},

		// for the tests which are published
		setPublishedTestQuestionsList: (state, action) => {
			state.publishedTestQuestionsList = action.payload;
		},
		setPreviewPublishedTestDetailsId: (state, action) => {
			state.previewPublishedTestDetails.test_id = action.payload;
		},
		setPreviewPublishedTestDetails: (state, { payload }) => {
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

			state.previewPublishedTestDetails = {
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
			};
		},

		// RESET
		reset(state, action) {
			console.log(TEST_INITIAL_STATE, '==TEST_INITIAL_STATE==');
			state.test = TEST_INITIAL_STATE.test;
			state.topicList = TEST_INITIAL_STATE.topicList;
			state.selectedTopicList = [];
			state.errors = TEST_INITIAL_STATE.errors;
			state.selectedQuestionsList = TEST_INITIAL_STATE.selectedQuestionsList;
			state.sortedSelectedQuestionsList =
				TEST_INITIAL_STATE.sortedSelectedQuestionsList;
			state.previewTestDetails = TEST_INITIAL_STATE.previewTestDetails;
			state.testQuestionsList = TEST_INITIAL_STATE.testQuestionsList;
			state.previewPublishedTestDetails =
				TEST_INITIAL_STATE.previewPublishedTestDetails;
			state.publishedTestQuestionsList =
				TEST_INITIAL_STATE.publishedTestQuestionsList;
		},

		resetTest(state, action) {
			state.test = TEST_INITIAL_STATE.test;
		},
	},
});

export const getTestQuestionsListThunk = (testId, sendRequest, navigate) => {
	console.log(1, testId, '==going type 1, testId==');
	return async (dispatch) => {
		let reqData = {
			url: SERVER_IP + '/api/test/questions',
			method: 'POST',
			body: JSON.stringify({ testId }),
		};
		sendRequest(reqData, ({ success, data }) => {
			if (data.length == 0) {
				Swal.fire({
					title: 'Warning!',
					text: 'No questions found for the test!',
				});

				navigate(-1);
				return false;
			}

			dispatch(testsSliceActions.setTestQuestionsList(data));
		});
	};
};

export const getPublishedTestQuestionsListThunk = (
	testId,
	sendRequest,
	navigate
) => {
	console.log(2, '==going type 2==');
	return async (dispatch) => {
		let reqData = {
			url: SERVER_IP + '/api/test/questions',
			method: 'POST',
			body: JSON.stringify({ testId }),
		};
		sendRequest(reqData, ({ success, data }) => {
			if (data.length == 0) {
				Swal.fire({
					title: 'Warning!',
					text: 'No questions found for the test!',
				});

				navigate(-1);
				return false;
			}

			dispatch(testsSliceActions.setPublishedTestQuestionsList(data));
		});
	};
};

export const testsSliceActions = testsSlice.actions;
export default testsSlice;
