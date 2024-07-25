import { FaEye, FaTrash, FaXmark } from 'react-icons/fa6';
import { useMutation, useQuery } from '@tanstack/react-query';
import React, { useEffect } from 'react';
import { getStudList } from './stud-list-api.jsx';
import { useDispatch, useSelector } from 'react-redux';
import { StudentAreaActions } from '../../../Store/student-area-slice.jsx';
import CButton from '../../UI/CButton.jsx';

import DataTable from 'react-data-table-component';
import Input from '../../UI/Input.jsx';

function StudentsList() {
	const dispatch = useDispatch();
	const { studentsList } = useSelector((state) => state.studentArea);
	const {
		data: _studList,
		isError: getStudentListErr,
		isPending: getStudentsListPending,
	} = useQuery({
		queryKey: ['getServerIP'],
		queryFn: getStudList,
	});

	useEffect(() => {
		if (_studList?.data) {
			dispatch(StudentAreaActions.setStudentsList(_studList.data));
		}
	}, [_studList]);

	const columns = [
		{ sortable: true, name: '#', selector: (row, idx) => idx + 1, width: '60px' },
		// { sortable: true, name: 'Name', selector: (row) => row.sl_f_name + ' ' + row.sl_m_name + ' ' + row.sl_l_name, width: '10rem' },
		{
			sortable: true,
			name: 'Name',
			cell: (row) => (
				<p className="flex items-center gap-2 justify-start">
					<img
						src={`http://localhost:3025/pics/_images/${row.sl_image.split('/')[1]}`}
						alt=""
						className="h-10 w-10 rounded-full hover:scale-[1.4] shadow-lg transition-all duration-300"
					/>
					{row.sl_f_name + ' ' + row.sl_m_name + ' ' + row.sl_l_name}
				</p>
			),
			width: '20rem',
		},
		{ sortable: true, name: 'Roll No', selector: (row) => row.sl_roll_number },
		{ sortable: true, name: 'Application No', selector: (row) => row.sl_application_number },
		{ sortable: true, name: 'Date of birth', selector: (row) => row.sl_date_of_birth },
		{ sortable: true, name: 'Mobile number', selector: (row) => row.sl_contact_number },
		{ sortable: true, name: 'Category', selector: (row) => row.sl_catagory },
		{ sortable: true, name: 'Physical handicap', selector: (row) => (row.sl_is_physical_handicap == 1 ? 'Yes' : 'No') },
		{ sortable: true, name: 'Post', selector: (row) => row.sl_post },
		{
			sortable: true,
			name: 'Action',
			cell: (row) => (
				<div className="flex gap-1 items-center">
					<CButton className={'btn--info'} icon={<FaEye />}></CButton>
					<CButton className={'btn--danger'} icon={<FaTrash />}></CButton>
				</div>
			),
		},
	];

	return (
		<div className=" ">
			<div className="flex gap-3 mb-5">
				<Input label={'Search'} className={'w-fit'}></Input>
				<CButton className={'h-fit mt-auto'} icon={<FaXmark />}></CButton>
			</div>
			{studentsList.length >= 1 && <DataTable columns={columns} data={studentsList} pagination fixedHeader highlightOnHover></DataTable>}
			{getStudentsListPending && <p>Getting students list...</p>}
		</div>
	);
}

export default StudentsList;