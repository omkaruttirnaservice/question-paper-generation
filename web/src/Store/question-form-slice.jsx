import { createSlice } from '@reduxjs/toolkit';
import { toast } from 'react-toastify';
import { loaderActions } from './loader-slice.jsx';

let initialState = {
	data: {
		post_id: null,
		subject_id: null,
		topic_id: null,
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
};
const QuestionFormSlice = createSlice({
	name: 'question-form-slice',
	initialState,
	reducers: {
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

		setSubjectsList(state, action) {
			let _subjectsList = action.payload;
			if (_subjectsList.length === 0) {
				state.data.topic_id = null;
				state.topicsList = [];
			}
			state.subjectsList = _subjectsList;
		},

		setTopicsList(state, action) {
			// state.data.topic_id = null;
			state.topicsList = action.payload;
		},

		setQuestionNumber(state, action) {
			state.questionNumber = +action.payload + 1;
		},

		setErrors(state, action) {
			state.errors = {};
			state.errors = action.payload;
		},

		setEditQuestionDetails(state, action) {
			state.isEdit = true;
			console.log(action.payload);
			state.data = action.payload;
		},

		setEditingFalse(state, action) {
			state.isEdit = false;
		},
	},
});

export const getQuestionNumberThunk = () => {
	return async (dispatch) => {
		let response = await fetch('/api/questions/get-question-number');
		let { data } = await response.json();
		dispatch(QuestionFormActions.setQuestionNumber(data.total_questions));
	};
};

export const getBooksListThunk = (pubName, sendRequest) => {
	return async (dispatch) => {
		let requestData = {
			url: '/api/questions/books-list',
			method: 'POST',
			body: JSON.stringify({ pubName: pubName }),
		};
		sendRequest(requestData, ({ success, data }) => {
			if (data.length == 0) {
				dispatch(QuestionFormActions.setBooksList([]));
			} else {
				dispatch(QuestionFormActions.setBooksList(data));
			}
		});
	};
};

export const getPublicationsListThunk = (sendRequest) => {
	return async (dispatch) => {
		let requestData = {
			url: '/api/questions/publications-list',
		};
		sendRequest(requestData, ({ success, data }) => {
			if (data.length == 0) {
				dispatch(QuestionFormActions.setPublicationsList([]));
			} else {
				dispatch(QuestionFormActions.setPublicationsList(data));
			}
		});
	};
};

export const getPostListThunk = () => {
	return async (dispatch) => {
		try {
			dispatch(loaderActions.showLoader());
			let response = await fetch('/api/posts/list');
			console.log('getting post list');
			console.log(response);
			let { success, data } = await response.json();

			if (success === 1) {
				dispatch(QuestionFormActions.setPostsList(data));
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
			url: '/api/get-subject-list',
			method: 'POST',
			body: JSON.stringify({ post_id }),
		};

		if (!post_id) {
			console.warn('No post id passed to get subject list');
			dispatch(QuestionFormActions.setSubjectsList([]));
		} else {
			sendRequest(reqData, ({ data, success }) => {
				if (success == 1) {
					dispatch(QuestionFormActions.setSubjectsList(data));
				}
			});
		}
	};
};

export const getTopicsListThunk = (subject_id, sendRequest) => {
	return async (dispatch) => {
		const requestData = {
			url: '/api/get-topic-list',
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({ subjectId: subject_id }),
		};
		if (!subject_id) {
			dispatch(QuestionFormActions.setTopicsList([]));
		} else {
			sendRequest(requestData, (data) => {
				dispatch(QuestionFormActions.setTopicsList(data.data));
			});
		}
	};
};

export const QuestionFormActions = QuestionFormSlice.actions;
export default QuestionFormSlice;
