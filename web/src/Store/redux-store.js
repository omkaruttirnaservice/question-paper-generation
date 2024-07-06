import { configureStore } from '@reduxjs/toolkit';

import { loaderSlice } from './loader-slice';
import modalSlice from './modal-slice.js';
import QuestionFormSlice from './question-form-slice.js';
export const store = configureStore({
	reducer: {
		loader: loaderSlice.reducer,
		modal: modalSlice.reducer,
		questionForm: QuestionFormSlice.reducer,
	},
});
