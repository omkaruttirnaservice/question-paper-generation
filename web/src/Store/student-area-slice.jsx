import { createSlice } from '@reduxjs/toolkit';

const initialState = {
	formFillingIP: null,
	selectedFormFillingIP: null,
	allList: {
		studentsList_ALL: [],
		searchTerm: null,
		searchType: null,
	},
	listByCenter: {
		studentsList_BY_CENTER: [],
		centersList_BY_CENTER: [],
		batchList_BY_CENTER: [],
		postsList_BY_CENTER: [],

		centerNumber: null,
		batchNumber: null,
		date: null,
	},
};

const studentAreaSlice = createSlice({
	name: 'student-area-slice',
	initialState,
	reducers: {
		setSelectedFormFillingIP: (state, action) => {
			console.log(JSON.parse(action.payload), '==action.payload==')
			state.selectedFormFillingIP = JSON.parse(action.payload);
		},
		setFormFillingIP: (state, action) => {
			state.formFillingIP = action.payload;
		},

		setSearchTerm_ALL: (state, action) => {
			state.allList.searchTerm = action.payload;
		},

		setSearchType_ALL: (state, action) => {
			state.allList.searchType = action.payload;
		},

		setStudentsList_All: (state, action) => {
			state.allList.studentsList_ALL = action.payload;
		},

		setStudentsList_BY_CENTER: (state, action) => {
			state.listByCenter.studentsList_BY_CENTER = action.payload;

			let _uniquePostName = [
				...new Set(action.payload.map((item) => item.sl_post)),
			];

			state.listByCenter.postsList_BY_CENTER = _uniquePostName;
		},

		setCentersList: (state, action) => {
			state.listByCenter.centersList_BY_CENTER = action.payload;
		},

		setBatchList: (state, action) => {
			state.listByCenter.batchList_BY_CENTER = action.payload;
		},

		setPostsList: (state, action) => {
			state.listByCenter.postsList_BY_CENTER = action.payload;
		},

		setStudentsByCenterSearch: (state, action) => {
			let { name, value } = action.payload;
			console.log(name, value, '==name, value==');
			state.listByCenter[name] = value;
		},
	},
});

export const StudentAreaActions = studentAreaSlice.actions;
export default studentAreaSlice;
