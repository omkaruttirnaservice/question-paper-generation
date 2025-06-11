import React, { useEffect, useState } from 'react';
import DataTable from 'react-data-table-component';
import { FaXmark } from 'react-icons/fa6';
import { useDispatch, useSelector } from 'react-redux';
import CButton from '../../UI/CButton.jsx';

import { useMutation, useQuery } from '@tanstack/react-query';
import DatePicker from 'react-datepicker';
import { toYYYYMMDD } from '../../../helpers/myDate.jsx';
import { StudentAreaActions } from '../../../Store/student-area-slice.jsx';
import Input, { InputSelect } from '../../UI/Input.jsx';
import {
	s3BucketUrl,
	SEARCH_TYPE_NAME,
	SEARCH_TYPE_ROLL_NO,
} from '../../Utils/Constants.jsx';
import {
	getBatchAndCenterList,
	getStudentsListFilter,
} from './stud-list-by-center-api.jsx';

function StudentsListByCenter() {
	const [filterPost, setFilterPost] = useState('');
	const [searchTerm, setSearchTerm] = useState('');
	const [searchType, setSearchType] = useState('');
	const dispatch = useDispatch();
	const { listByCenter } = useSelector((state) => state.studentArea);
	const {
		studentsList_BY_CENTER,
		centersList_BY_CENTER,
		batchList_BY_CENTER,
		postsList_BY_CENTER,
		centerNumber,
		batchNumber,
		date,
	} = listByCenter;

	const [filteredStudentsList_BY_CENTER, setFilteredStudentsList_BY_CENTER] =
		useState([]);

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
			let { _batchList, _centersList } = _batchAndCenterList.data;
			dispatch(StudentAreaActions.setBatchList(_batchList));
			dispatch(StudentAreaActions.setCentersList(_centersList));
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

		dispatch(StudentAreaActions.setStudentsByCenterSearch({ name, value }));
		// (prev) => {
		// 	return {
		// 		...prev,
		// 		[name]: value,
		// 	};
		// };
	};

	const handlePostChange = (e) => {
		let _post = e.target.value;
		setFilterPost(_post);
		if (_post == '') {
			setFilteredStudentsList_BY_CENTER(studentsList_BY_CENTER);
		} else {
			let updatedList = studentsList_BY_CENTER.filter(
				(el) => el.sl_post == _post
			);
			setFilteredStudentsList_BY_CENTER(updatedList);
		}
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
			dispatch(
				StudentAreaActions.setStudentsList_BY_CENTER(_studentsData.data)
			);
			setFilteredStudentsList_BY_CENTER(_studentsData.data);
		}
	}, [_studentsData]);

	const handleGetData = (e) => {
		e.preventDefault();

		let sendData = { centerNumber, batchNumber, date };
		// sendData.date = toYYYYMMDD(sendData.date);

		getStudentsData(sendData);
	};

	useEffect(() => {
		if (searchTerm == '')
			return setFilteredStudentsList_BY_CENTER(studentsList_BY_CENTER);
		let timeOut = setTimeout(() => {
			if (searchType == SEARCH_TYPE_ROLL_NO) {
				let updatedList = studentsList_BY_CENTER.filter(
					(stud) => +stud.sl_roll_number.match(+searchTerm)
				);
				setFilteredStudentsList_BY_CENTER(updatedList);
			}
			if (searchType == SEARCH_TYPE_NAME) {
				let updatedList = studentsList_BY_CENTER.filter((stud) => {
					let fullName = `${stud.sl_f_name} ${stud.sl_m_name} ${stud.sl_l_name}`;
					return fullName.toLowerCase().match(searchTerm.toLowerCase());
				});
				setFilteredStudentsList_BY_CENTER(updatedList);
			}
		}, 1500);
		return () => {
			console.log(timeOut, '==timeOut==');
			clearTimeout(timeOut);
		};
	}, [searchTerm]);

	const columns = [
		{
			sortable: true,
			name: 'Roll No',
			selector: (row) => row.sl_roll_number,
			width: '5rem',
		},
		{
			sortable: true,
			name: 'Name',
			cell: (row) => (
				<p className="flex items-center gap-2 justify-start">
					<img
						src={`${s3BucketUrl}/${row.sl_image}`}
						alt=""
						className="h-10 w-10 rounded-full hover:scale-[1.4] shadow-lg transition-all duration-300"
					/>
					{row.sl_f_name + ' ' + row.sl_m_name + ' ' + row.sl_l_name}
				</p>
			),
			width: '20rem',
		},
		{
			sortable: true,
			name: 'Application No',
			selector: (row) => row.sl_application_number,
			width: '8rem',
		},
		{
			sortable: true,
			name: 'Date of birth',
			selector: (row) => row.sl_date_of_birth,
		},
		{ sortable: true, name: 'Password', selector: (row) => row.sl_password },
		{
			sortable: true,
			name: 'Contact number',
			selector: (row) => row.sl_contact_number,
		},
		{ sortable: true, name: 'Exam Date', selector: (row) => row.sl_exam_date },
		{
			sortable: true,
			name: 'Post',
			cell: (row) => (
				<span className="bg-cyan-700 p-1 text-white">{row.sl_post}</span>
			),
		},
	];

	return (
		<div className=" ">
			<div className="grid grid-cols-6 gap-3 mb-5 mt-3 items-center">
				<InputSelect
					label={'Centers List'}
					value={centerNumber}
					name={'centerNumber'}
					className={'w-full'}
					onChange={handleChange}
				>
					<option value="">-- Select --</option>
					{centersList_BY_CENTER.map((center) => {
						return (
							<option
								value={center.cl_number}
								selected={+center.cl_number == +centerNumber}
							>
								({center.cl_number}){center.cl_name}
							</option>
						);
					})}
					{centersList_BY_CENTER.length == 0 && (
						<option>No centers available</option>
					)}
				</InputSelect>

				<InputSelect
					label={'Batch List'}
					name={'batchNumber'}
					className={'w-full'}
					value={batchNumber}
					onChange={handleChange}
				>
					<option value="">-- Select --</option>
					{batchList_BY_CENTER.map((batch) => {
						return (
							<option
								value={batch.sl_batch_no}
								selected={+batch.sl_batch_no == +batchNumber}
							>
								Batch-{batch.sl_batch_no}
							</option>
						);
					})}
					{batchList_BY_CENTER.length == 0 && (
						<option>No batch available</option>
					)}
				</InputSelect>

				<div>
					<label
						htmlFor=""
						className="transition-all duration-300 text-gray-700 !mb-1  block text-sm"
					>
						Date
					</label>

					<DatePicker
						autoComplete="off"
						selected={date}
						onChange={(date) => {
							let name = 'date';
							// let _date = date.getDate();
							// if (_date <= 9) _date = `0${_date}`;
							// let _month = date.getMonth() + 1;
							// if (_month <= 9) _month = `0${_month}`;
							// let _year = date.getFullYear();

							// let value = `${_date}-${_month}-${_year}`;
							let value = date;

							dispatch(
								StudentAreaActions.setStudentsByCenterSearch({ name, value })
							);
						}}
						placeholderText="select date"
						name="date"
						dateFormat="dd-MM-YYYY"
						// date={date}
						className="!z-[1000] block !w-full border focus:ring-2 focus:outline-4 outline-none transition-all duration-300 disabled:bg-gray-400/40"
					/>
				</div>

				<CButton
					className={'mt-auto'}
					onClick={handleGetData}
					isLoading={_getStudentDataStatus}
				>
					Get data
				</CButton>

				<div className="col-span-2">
					Total Students:{' '}
					<span className="font-semibold">{studentsList_BY_CENTER.length}</span>
				</div>

				<div className="col-span-1">
					<InputSelect
						label={'Search Type'}
						className={'w-full'}
						value={searchType}
						onChange={handleSearchType}
					>
						<option value="">-- Select --</option>
						<option value={SEARCH_TYPE_ROLL_NO}>Roll No</option>
						<option value={SEARCH_TYPE_NAME}>Name</option>
					</InputSelect>
				</div>

				<div className="col-span-1 flex items-center gap-2">
					<Input
						label={'Search'}
						className={'w-fit'}
						value={searchTerm}
						onChange={handleSearch}
						disabled={searchType == ''}
					></Input>

					{searchType != '' && searchTerm != '' && (
						<CButton
							className={'h-fit mt-auto'}
							icon={<FaXmark />}
							onClick={() => {
								setSearchTerm('');
							}}
						></CButton>
					)}
				</div>

				<InputSelect
					label={'Post List'}
					name={'postName'}
					className={'w-full'}
					value={filterPost}
					onChange={handlePostChange}
				>
					<option value="">-- Select --</option>
					{postsList_BY_CENTER.map((post) => {
						return <option value={post}>{post}</option>;
					})}
					{postsList_BY_CENTER.length == 0 && (
						<option>No post available</option>
					)}
				</InputSelect>
			</div>
			{filteredStudentsList_BY_CENTER.length >= 1 && (
				<DataTable
					columns={columns}
					data={filteredStudentsList_BY_CENTER}
					pagination
					fixedHeader
					highlightOnHover
				></DataTable>
			)}
			{_getStudentDataStatus && <p>Getting students list...</p>}
			{filteredStudentsList_BY_CENTER.length == 0 && !_getStudentDataStatus && (
				<p className="text-center mt-4">Sorry no students found....</p>
			)}
		</div>
	);
}

export default StudentsListByCenter;
