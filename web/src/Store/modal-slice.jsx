import { createSlice } from '@reduxjs/toolkit';

const modalSlice = createSlice({
	name: 'modal-slice',
	initialState: {},
	reducers: {
		toggleModal(state, action) {
			let key = action.payload;
			if (key === undefined || key === null) {
				console.error('No modal id passed to toggleModal() reducer');
				return;
			}
			state[key] = !state[key];
		},
	},
});

export const ModalActions = modalSlice.actions;
export default modalSlice;
