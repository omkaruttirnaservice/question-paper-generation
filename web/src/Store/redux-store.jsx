import { configureStore } from '@reduxjs/toolkit';

import QuestionFormSlice from './edit-question-form-slice.jsx';
import { loaderSlice } from './loader-slice.jsx';
import modalSlice from './modal-slice.jsx';
import reportsSlice from './reports-slice.jsx';
import studentAreaSlice from './student-area-slice.jsx';
import testsSlice from './tests-slice.jsx';
export const store = configureStore({
	reducer: {
		loader: loaderSlice.reducer,
		modal: modalSlice.reducer,
		questionForm: QuestionFormSlice.reducer,
		tests: testsSlice.reducer,
		studentArea: studentAreaSlice.reducer,
		reports: reportsSlice.reducer,
	},
});
