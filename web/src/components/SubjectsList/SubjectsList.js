import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
	QuestionFormActions,
	getSubjectsListThunk,
} from '../../Store/question-form-slice.js';
import useHttp from '../Hooks/use-http';
import Loader from '../UI/Loader/Loader';

import { FaRegTrashAlt } from 'react-icons/fa';
import { FaRegFloppyDisk } from 'react-icons/fa6';
import { GoPencil } from 'react-icons/go';
import { IoCloseSharp } from 'react-icons/io5';

import CButton from '../UI/CButton.js';
import './SubjectsList.css';
import { toast } from 'react-toastify';
function SubjectsList() {
	const { sendRequest } = useHttp();
	const editedSubjectName = useRef();

	const dispatch = useDispatch();
	const isLoading = useSelector((state) => state.loader.isLoading);
	const { subjectsList } = useSelector((state) => state.questionForm);

	const [isSubjectNameEdit, setIsSubjectNameEdit] = useState(false);
	const [editId, setEditId] = useState('');

	const getSubjectList = async () => {
		dispatch(getSubjectsListThunk());
	};

	useEffect(() => {
		if (subjectsList.length == 0) {
			getSubjectList();
		}
	}, []);

	async function handleDeleteSubject(subjectId) {
		let reqData = {
			url: '/delete-subject',
			method: 'POST',
			body: JSON.stringify({ subjectId }),
		};
		sendRequest(reqData, ({ success, data }) => {
			if (success === 1) {
				toast('Successfully deleted subject.');
				let subjects = subjectsList.filter((sub) => sub.id != subjectId);
				dispatch(QuestionFormActions.setSubjectsList(subjects));
			} else {
				toast('Something went wrong!');
			}
		});
	}

	const handleSubjectEdit = (subjectId) => {
		setEditId(subjectId);
		setIsSubjectNameEdit(true);
	};

	const handleSaveEditedSubjectName = async (subjectId) => {
		let _editedSubjectName = editedSubjectName.current.value;
		let reqData = {
			url: '/post-edit-subject-name',
			method: 'POST',
			body: JSON.stringify({ newSubjectName: _editedSubjectName, subjectId }),
		};
		sendRequest(reqData, ({ success, data }) => {
			if (success === 1) {
				setIsSubjectNameEdit(false);
				getSubjectList();
				return;
			} else {
				alert('Something went wrong');
			}
		});
	};

	return (
		<>
			<div className="container mt-4">
				<table>
					<thead>
						<tr>
							<th className="text-center" width="7%">
								SR NO
							</th>
							<th className="text-center" width="10%">
								Subject ID
							</th>
							<th>Subject Name</th>
							<th width="15%">Questions Count</th>
							<th className="text-center" width="10%">
								Action
							</th>
						</tr>
					</thead>

					<tbody>
						{subjectsList.length >= 1 &&
							subjectsList?.map((subject, i) => {
								return (
									<tr key={subject.id}>
										<td className="text-center">{i + 1}</td>
										<td className="text-center">{subject.id}</td>
										<td>
											{subject.subject_name}
											{isSubjectNameEdit && subject.id === editId && (
												<>
													<input
														ref={editedSubjectName}
														className="form-control w-50 d-inline-block p-0 ms-2"
													/>

													<CButton
														varient="btn--success"
														icon={<FaRegFloppyDisk />}
														onClick={handleSaveEditedSubjectName.bind(
															null,
															subject.id
														)}></CButton>

													<CButton
														varient="btn--danger"
														icon={<IoCloseSharp />}
														onClick={() =>
															setIsSubjectNameEdit(false)
														}></CButton>
												</>
											)}
										</td>
										<td className="text-center">{subject.que_count}</td>
										<td className="text-center">
											<CButton
												varient="btn--success"
												icon={<FaRegTrashAlt />}
												onClick={() =>
													handleDeleteSubject(subject.id)
												}></CButton>

											<CButton
												varient="btn--danger"
												icon={<GoPencil />}
												onClick={handleSubjectEdit.bind(
													null,
													subject.id
												)}></CButton>
										</td>
									</tr>
								);
							})}
					</tbody>
				</table>

				{isLoading && <Loader />}
			</div>
		</>
	);
}

export default SubjectsList;
