import { FaEye, FaTrash, FaXmark } from 'react-icons/fa6';
import { useMutation, useQuery } from '@tanstack/react-query';
import React, { useEffect, useState } from 'react';
import { getStudList } from './stud-list-api.jsx';
import { useDispatch, useSelector } from 'react-redux';
import { StudentAreaActions } from '../../../Store/student-area-slice.jsx';
import CButton from '../../UI/CButton.jsx';

import DataTable from 'react-data-table-component';
import Input, { InputSelect } from '../../UI/Input.jsx';
import {
	s3BucketUrl,
	SEARCH_TYPE_NAME,
	SEARCH_TYPE_ROLL_NO,
} from '../../Utils/Constants.jsx';

function StudentsList() {
	const dispatch = useDispatch();
	const { allList } = useSelector((state) => state.studentArea);
	const [filterStudentsList_All, setFilterStudentsList_All] = useState([]);

	const {
		data: _studList,
		isError: getStudentListErr,
		isPending: getStudentsListPending,
	} = useQuery({
		queryKey: ['getServerIP'],
		queryFn: getStudList,
		retry: false,
		refetchOnWindowFocus: false,
	});

	console.log(_studList, '==_studList==');
	useEffect(() => {
		if (_studList?.data) {
			dispatch(StudentAreaActions.setStudentsList_All(_studList.data.data));
			setFilterStudentsList_All(_studList.data.data);
		}
	}, [_studList]);

	const handleSearch = (e) =>
		dispatch(StudentAreaActions.setSearchTerm_ALL(e.target.value));

	const handleSearchType = (e) => {
		dispatch(StudentAreaActions.setSearchTerm_ALL(''));
		dispatch(StudentAreaActions.setSearchType_ALL(e.target.value));
	};

	useEffect(() => {
		if (allList.searchTerm == '')
			return setFilterStudentsList_All(allList.studentsList_ALL);

		let timeOut = setTimeout(() => {
			if (allList.searchType == SEARCH_TYPE_ROLL_NO) {
				let updatedList = allList.studentsList_ALL.filter(
					(stud) => +stud.sl_roll_number.match(+allList.searchTerm)
				);
				setFilterStudentsList_All(updatedList);
			}
			if (allList.searchType == SEARCH_TYPE_NAME) {
				let updatedList = allList.studentsList_ALL.filter((stud) => {
					let fullName = `${stud.sl_f_name} ${stud.sl_m_name} ${stud.sl_l_name}`;
					return fullName.toLowerCase().match(allList.searchTerm.toLowerCase());
				});

				setFilterStudentsList_All(updatedList);
			}
		}, 1500);
		return () => {
			if (timeOut) clearTimeout(timeOut);
		};
	}, [allList.searchTerm]);

	const columns = [
		{
			sortable: true,
			name: '#',
			selector: (row, idx) => idx + 1,
			width: '60px',
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
			name: 'Roll No',
			selector: (row) => row.sl_roll_number,
			width: '6rem',
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
		{
			sortable: true,
			name: 'Mobile number',
			selector: (row) => row.sl_contact_number,
			width: '8rem;',
		},
		{ sortable: true, name: 'Category', selector: (row) => row.sl_catagory },
		{
			sortable: true,
			name: 'Physical handicap',
			selector: (row) => (row.sl_is_physical_handicap == 1 ? 'Yes' : 'No'),
		},
		{ sortable: true, name: 'Post', selector: (row) => row.sl_post },
		// {
		// 	sortable: true,
		// 	name: 'Action',
		// 	cell: (row) => (
		// 		<div className="flex gap-1 items-center">
		// 			<CButton className={'btn--info'} icon={<FaEye />}></CButton>
		// 			<CButton className={'btn--danger'} icon={<FaTrash />}></CButton>
		// 		</div>
		// 	),
		// },
	];

	return (
		<div className="">
			<div className="flex gap-3 mb-5 mt-3 items-center">
				<InputSelect
					label={'Search Type'}
					className={'w-fit'}
					value={allList.searchType}
					onChange={handleSearchType}
				>
					<option value="">-- Select --</option>
					<option value={SEARCH_TYPE_ROLL_NO}>Roll No</option>
					<option value={SEARCH_TYPE_NAME}>Name</option>
				</InputSelect>

				<Input
					label={'Search'}
					className={'w-fit'}
					value={allList.searchTerm}
					onChange={handleSearch}
					disabled={allList.searchType == ''}
				></Input>
				<CButton
					className={'h-fit mt-auto'}
					icon={<FaXmark />}
					onClick={() => {
						dispatch(StudentAreaActions.setSearchTerm_ALL(''));
					}}
				></CButton>
			</div>
			{filterStudentsList_All.length >= 1 && (
				<DataTable
					columns={columns}
					data={filterStudentsList_All}
					pagination
					fixedHeader
					highlightOnHover
				></DataTable>
			)}

			{filterStudentsList_All.length == 0 && !getStudentsListPending && (
				<p>Students not found...</p>
			)}
			{getStudentsListPending && <p>Getting students list...</p>}
		</div>
	);
}

export default StudentsList;
