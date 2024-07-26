import React, { useEffect, useState } from 'react';
import DataTable from 'react-data-table-component';
import { FaXmark } from 'react-icons/fa6';
import { useDispatch, useSelector } from 'react-redux';
import CButton from '../../UI/CButton.jsx';

import { useMutation, useQuery } from '@tanstack/react-query';
import DatePicker from 'react-datepicker';
import { StudentAreaActions } from '../../../Store/student-area-slice.jsx';
import Input, { InputSelect } from '../../UI/Input.jsx';
import { SEARCH_TYPE_NAME, SEARCH_TYPE_ROLL_NO } from '../../Utils/Constants.jsx';
import { getBatchAndCenterList, getStudentsListFilter } from './stud-list-by-center-api.jsx';
import { toYYYYMMDD } from '../../../helpers/myDate.jsx';

function StudentsListByCenter() {
	const [studentsByCenterSearch, setStudentsByCenterSearch] = useState({
		centerNumber: null,
		batchNumber: null,
		postName: null,
		date: null,
	});

	const [searchTerm, setSearchTerm] = useState('');
	const [searchType, setSearchType] = useState('');
	const dispatch = useDispatch();
	const { studentsList, centersList, batchList, postsList } = useSelector((state) => state.studentArea);
	const [filteredStudentsList, setFilteredStudentsList] = useState([]);

	const {
		data: _batchAndCenterList,
		isError: getBatchAndCenterListErr,
		isPending: getBatchAndCenterListLoading,
	} = useQuery({
		queryKey: ['get-batch-and-center-list'],
		queryFn: getBatchAndCenterList,
	});

	useEffect(() => {
		if (_batchAndCenterList?.data) {
			let { _batchList, _centersList, _postsList } = _batchAndCenterList.data;
			dispatch(StudentAreaActions.setBatchList(_batchList));
			dispatch(StudentAreaActions.setCentersList(_centersList));
			dispatch(StudentAreaActions.setPostsList(_postsList));
		}
	}, [_batchAndCenterList]);

	const handleSearch = (e) => {
		let searchKey = e.target.value;
		setSearchTerm(searchKey);
	};
	const handleSearchType = (e) => {
		let searchType = e.target.value;
		setSearchType(searchType);
	};

	const handleChange = (e) => {
		let name = e.target.name;
		let value = e.target.value;

		setStudentsByCenterSearch((prev) => {
			return {
				...prev,
				[name]: value,
			};
		});
	};

	const {
		mutate: getStudentsData,
		data: _studentsData,
		isPending: _getStudentDataStatus,
	} = useMutation({
		mutationFn: getStudentsListFilter,
	});

	useEffect(() => {
		if (_studentsData) {
			dispatch(StudentAreaActions.setStudentsList(_studentsData.data));
			setFilteredStudentsList(_studentsData.data);
		}
	}, [_studentsData]);

	const handleGetData = (e) => {
		e.preventDefault();

		let sendData = { ...studentsByCenterSearch };
		sendData.date = toYYYYMMDD(studentsByCenterSearch.date);

		getStudentsData(sendData);
	};

	useEffect(() => {
		if (searchTerm == '') return setFilteredStudentsList(studentsList);
		let timeOut = setTimeout(() => {
			if (searchType == SEARCH_TYPE_ROLL_NO) {
				let updatedList = studentsList.filter((stud) => +stud.sl_roll_number.match(+searchTerm));
				setFilteredStudentsList(updatedList);
			}
			if (searchType == SEARCH_TYPE_NAME) {
				let updatedList = studentsList.filter((stud) => {
					let fullName = `${stud.sl_f_name} ${stud.sl_m_name} ${stud.sl_l_name}`;
					return fullName.toLowerCase().match(searchTerm.toLowerCase());
				});
				setFilteredStudentsList(updatedList);
			}
		}, 1500);
		return () => {
			clearTimeout(timeOut);
		};
	}, [searchTerm]);

	const columns = [
		{ sortable: true, name: 'Roll No', selector: (row) => row.sl_roll_number, width: '5rem' },
		{
			sortable: true,
			name: 'Name',
			selector: (row) => row.sl_f_name + ' ' + row.sl_m_name + ' ' + row.sl_l_name,

			width: '20rem',
		},
		{ sortable: true, name: 'Application No', selector: (row) => row.sl_application_number, width: '8rem' },
		{ sortable: true, name: 'Date of birth', selector: (row) => row.sl_date_of_birth },
		{ sortable: true, name: 'Password', selector: (row) => row.sl_password },
		{ sortable: true, name: 'Contact number', selector: (row) => row.sl_contact_number },
		{ sortable: true, name: 'Exam Date', selector: (row) => row.sl_exam_date },
		{ sortable: true, name: 'Post', selector: (row) => row.sl_post },
	];

	return (
		<div className=" ">
			<div className="grid grid-cols-6 gap-3 mb-5 mt-3 items-center">
				<InputSelect
					label={'Centers List'}
					value={studentsByCenterSearch.centerNumber}
					name={'centerNumber'}
					className={'w-full'}
					onChange={handleChange}>
					<option value="">-- Select --</option>
					{centersList.map((center) => {
						return (
							<option value={center.cl_number} selected={center.cl_number == studentsByCenterSearch.centerNumber}>
								({center.cl_number}){center.cl_name}
							</option>
						);
					})}
					{centersList.length == 0 && <option>No centers available</option>}
				</InputSelect>

				<InputSelect label={'Post List'} name={'postName'} className={'w-full'} value={studentsByCenterSearch.postName} onChange={handleChange}>
					<option value="">-- Select --</option>
					{postsList.map((batch) => {
						return <option value={batch.sl_post}>{batch.sl_post}</option>;
					})}
					{postsList.length == 0 && <option>No post available</option>}
				</InputSelect>

				<InputSelect
					label={'Batch List'}
					name={'batchNumber'}
					className={'w-full'}
					value={studentsByCenterSearch.batchNumber}
					onChange={handleChange}>
					<option value="">-- Select --</option>
					{batchList.map((batch) => {
						return <option value={batch.sl_batch_no}>Batch-{batch.sl_batch_no}</option>;
					})}
					{batchList.length == 0 && <option>No batch available</option>}
				</InputSelect>

				<div>
					<label htmlFor="" className="transition-all duration-300 text-gray-700 !mb-1  block text-sm">
						Date
					</label>

					<DatePicker
						autoComplete="off"
						onChange={(date) => {
							setStudentsByCenterSearch((prev) => {
								return {
									...prev,
									date: `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`,
									// date: `${date.getFullYear()}-0${date.getMonth() + 1}-${date.getDate()}`,
								};
							});
						}}
						placeholderText="select date"
						defaultValue
						name="publish_date"
						value={studentsByCenterSearch.date}
						className="block !w-full border focus:ring-2 focus:outline-4 outline-none transition-all duration-300 disabled:bg-gray-400/40"
					/>
				</div>

				<CButton className={'mt-auto'} onClick={handleGetData} isLoading={_getStudentDataStatus}>
					Get data
				</CButton>

				<div></div>

				<div className="col-span-1">
					<InputSelect label={'Search Type'} className={'w-full'} value={searchType} onChange={handleSearchType}>
						<option value="">-- Select --</option>
						<option value={SEARCH_TYPE_ROLL_NO}>Roll No</option>
						<option value={SEARCH_TYPE_NAME}>Name</option>
					</InputSelect>
				</div>

				<div className="col-span-2 flex items-center gap-2">
					<Input label={'Search'} className={'w-fit'} value={searchTerm} onChange={handleSearch} disabled={searchType == ''}></Input>

					{searchType != '' && searchTerm != '' && (
						<CButton
							className={'h-fit mt-auto'}
							icon={<FaXmark />}
							onClick={() => {
								setSearchTerm('');
							}}></CButton>
					)}
				</div>
			</div>
			{filteredStudentsList.length >= 1 && (
				<DataTable columns={columns} data={filteredStudentsList} pagination fixedHeader highlightOnHover></DataTable>
			)}
			{_getStudentDataStatus && <p>Getting students list...</p>}
			{filteredStudentsList.length == 0 && <p className="text-center mt-4">Sorry no students found....</p>}
		</div>
	);
}

export default StudentsListByCenter;
