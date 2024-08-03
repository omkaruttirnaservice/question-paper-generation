let SERVER_IP = import.meta.env.VITE_API_SERVER_IP;
import { createSlice } from '@reduxjs/toolkit';
import { toast } from 'react-toastify';
import { loaderActions } from './loader-slice.jsx';

let initialState = {
	data: {
		question_id: null,
		post_id: null,
		post_name: null,
		subject_id: null,
		subject_name: null,
		topic_id: null,
		topic_name: null,
		pub_name: null,
		book_name: null,
		pg_no: null,
		question_content: null,
		option_A: null,
		option_B: null,
		option_C: null,
		option_D: null,
		option_E: null,
		correct_option: null,
		explanation: null,
		difficulty: null,
		month: null,
		year: null,
		showNewInputField: false,
	},
	publicationsList: [],
	bookNamesList: [],
	postsList: [],
	subjectsList: [],
	topicsList: [],
	questionNumber: null,
	errors: {},
	isEdit: false,
	isQuestionPreview: false,
	edit_test_type: null,
};
const EditQuestionFormSlice = createSlice({
	name: 'question-form-slice',
	initialState,
	reducers: {
		setShowNewInputField(state, action) {
			state.data.showNewInputField = action.payload;
			// for toggling  option E input field
		},
		// question preview
		toggleQuestionPreview(state, action) {
			state.isQuestionPreview = !state.isQuestionPreview;
		},

		handleInputChange(state, action) {
			let { key, value } = action.payload;
			state.data[key] = value;
		},

		resetFormData(state, action) {
			console.log(1, '==1==');
			state.data.pg_no = null;
			state.data.question_content = null;
			state.data.option_A = null;
			state.data.option_B = null;
			state.data.option_C = null;
			state.data.option_D = null;
			state.data.option_E = null;
			state.data.correct_option = null;
			state.data.explanation = null;
			state.data.difficulty = null;
			state.data.month = null;
			state.data.year = null;
		},

		setPublicationsList(state, action) {
			state.publicationsList = action.payload;
		},

		setBooksList(state, action) {
			state.bookNamesList = action.payload;
		},

		setPostsList(state, action) {
			state.data.subject_id = null;
			state.data.topic_id = null;
			state.postsList = action.payload;
		},
		setPostName(state, action) {
			state.data.post_name = action.payload;
		},

		setSubjectId(state, action) {
			state.data.subject_id = action.payload;
		},
		setSubjectsList(state, action) {
			let _subjectsList = action.payload;
			if (_subjectsList.length === 0) {
				state.data.topic_id = null;
				state.topicsList = [];
			}
			state.subjectsList = _subjectsList;
		},

		setSubjectName(state, action) {
			state.data.subject_name = action.payload;
		},

		setTopicsList(state, action) {
			// state.data.topic_id = null;
			state.topicsList = action.payload;
		},

		setTopicName(state, action) {
			state.data.topic_name = action.payload;
		},

		setErrors(state, action) {
			state.errors = {};
			state.errors = action.payload;
		},

		setEditQuestionDetails(state, action) {
			console.log(action.payload, '==action.payload==========');
			let pl = action.payload.el;
			state.edit_test_type = action.payload.edit_for;
			state.isEdit = true;
			console.log(action.payload);
			state.questionNumber = pl.id; // setting up question id of tm_test_question_sets
			state.data = {
				question_id: pl.id,
				post_id: null,
				post_name: null,
				subject_id: pl.main_topic_id,
				subject_name: pl.main_topic_name,
				topic_id: pl.sub_topic_id,
				topic_name: pl.sub_topic_section,
				pub_name: pl.pub_name,
				book_name: pl.book_name,
				pg_no: pl.page_name,
				question_content: pl.q,
				option_A: pl.q_a,
				option_B: pl.q_b,
				option_C: pl.q_c,
				option_D: pl.q_d,
				option_E: pl.q_e,
				correct_option: pl.q_ans,
				explanation: pl.q_sol,
				difficulty: pl.mqs_leval,
				month: pl.mqs_ask_in_month,
				year: pl.mqs_ask_in_year,
			};
			console.log(state.data, '==state.data==');
		},

		setEditingFalse(state, action) {
			state.isEdit = false;
		},

		// RESET
		reset(state, action) {
			state.data = initialState.data;
			state.publicationsList = initialState.publicationsList;
			state.bookNamesList = initialState.bookNamesList;
			state.postsList = initialState.postsList;
			state.subjectsList = initialState.subjectsList;
			state.topicsList = initialState.topicsList;
			state.questionNumber = initialState.questionNumber;
			state.errors = initialState.errors;
			state.isEdit = initialState.isEdit;
			state.isQuestionPreview = initialState.isQuestionPreview;
			state.edit_test_type = initialState.edit_test_type;
		},
	},
});

export const getBooksListThunk = (pubName, sendRequest) => {
	return async (dispatch) => {
		let requestData = {
			url: SERVER_IP + '/api/questions/books-list',
			method: 'POST',
			body: JSON.stringify({ pubName: pubName }),
		};
		sendRequest(requestData, ({ success, data }) => {
			if (data.length == 0) {
				dispatch(EditQuestionFormActions.setBooksList([]));
			} else {
				dispatch(EditQuestionFormActions.setBooksList(data));
			}
		});
	};
};

export const getPublicationsListThunk = (sendRequest) => {
	return async (dispatch) => {
		let requestData = {
			url: SERVER_IP + '/api/questions/publications-list',
		};
		sendRequest(requestData, ({ success, data }) => {
			if (data.length == 0) {
				dispatch(EditQuestionFormActions.setPublicationsList([]));
			} else {
				dispatch(EditQuestionFormActions.setPublicationsList(data));
			}
		});
	};
};

export const getPostListThunk = () => {
	return async (dispatch) => {
		try {
			dispatch(loaderActions.showLoader());
			let response = await fetch(SERVER_IP + '/api/posts/list');
			console.log('getting post list');
			console.log(response);
			let { success, data } = await response.json();

			if (success === 1) {
				dispatch(EditQuestionFormActions.setPostsList(data));
			}

			dispatch(loaderActions.hideLoader());
		} catch (error) {
			console.log(error);
			dispatch(loaderActions.hideLoader());
			toast('Error getting questions list');
		}
	};
};

export const getSubjectsListThunk = (post_id, sendRequest) => {
	return async (dispatch) => {
		const reqData = {
			url: SERVER_IP + '/api/get-subject-list',
			method: 'POST',
			body: JSON.stringify({ post_id }),
		};

		if (!post_id) {
			console.warn('No post id passed to get subject list');
			dispatch(EditQuestionFormActions.setSubjectsList([]));
		} else {
			sendRequest(reqData, ({ data, success }) => {
				if (success == 1) {
					dispatch(EditQuestionFormActions.setSubjectsList(data));
				}
			});
		}
	};
};

export const getTopicsListThunk = (subject_id, sendRequest) => {
	return async (dispatch) => {
		const requestData = {
			url: SERVER_IP + '/api/get-topic-list',
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({ subjectId: subject_id }),
		};
		if (!subject_id) {
			dispatch(EditQuestionFormActions.setTopicsList([]));
		} else {
			sendRequest(requestData, (data) => {
				dispatch(EditQuestionFormActions.setTopicsList(data.data));
			});
		}
	};
};

export const EditQuestionFormActions = EditQuestionFormSlice.actions;
export default EditQuestionFormSlice;
