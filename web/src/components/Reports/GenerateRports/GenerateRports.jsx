import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { H3 } from '../../UI/Headings.jsx';
import { useMutation, useQuery } from '@tanstack/react-query';
import { generateResult, getPublishedTestLists, getResultViewData } from './gen-reports-api.jsx';
import CButton from '../../UI/CButton.jsx';
import { reportsAction } from '../../../Store/reports-slice.jsx';
import Swal from 'sweetalert2';

function GenerateRports() {
	const { examServerIP, testsList } = useSelector((state) => state.reports);
	const dispatch = useDispatch();

	const { data: publishedTestsList, refetch } = useQuery({
		queryKey: ['get-published-test-list'],
		queryFn: getPublishedTestLists,
	});
	useEffect(() => {
		if (publishedTestsList?.data.length >= 1) {
			dispatch(reportsAction.setTestsList(publishedTestsList.data));
		}
	}, [publishedTestsList]);

	console.log(publishedTestsList, '==publishedTestsList==');

	return (
		<div className="mt-5 flex flex-col gap-4">
			<H3>Test Reports</H3>
			{testsList.map((el, idx) => {
				return <TestDetails el={el} idx={idx} key={idx} refetch={refetch} />;
			})}
		</div>
	);
}

function TestDetails({ el: details, idx, refetch }) {
	const {
		mutate: _generateResult,
		isError: _generateResultErr,
		isPending: _generateResultLoading,
	} = useMutation({
		mutationFn: generateResult,
		onSuccess: (data) => {
			Swal.fire('Success', data.message);
			if (data.success) refetch();
		},
		onError: (err) => {
			console.log(err, '==err==');
		},
	});
	const handleGenerateResult = (publishedTestId) => {
		// Converting the published test id to base 64 string
		_generateResult(btoa(publishedTestId));
	};

	const handleViewResult = (publishedTestId) => {
		_getResultViewData(publishedTestId);
	};
	const { mutate: _getResultViewData } = useMutation({
		mutationFn: getResultViewData,
		onSuccess: (data) => {
			console.log(data, '==data==');
		},
		onError: (err) => {
			console.log(err, '==err==');
		},
	});

	return (
		<div className="border flex gap-6 ">
			<div className="border-r p-2 text-2xl font-bold min-w-[3rem] flex justify-center items-center">{idx + 1}</div>
			<div className="flex flex-col justify-center gap-3 py-3">
				<p className="text-xl">{details.mt_name}</p>
				<div className="grid grid-cols-1 lg:grid-cols-4 gap-1">
					<p>
						Date: <span className="font-semibold">{details.mt_added_date}</span>
					</p>
					<p>
						Total questions: <span className="font-semibold"> 90 </span>
					</p>
					<p>
						Duration: <span className="font-semibold">{details.mt_test_time} Min </span>
					</p>
					<p>
						Marks per question: <span className="font-semibold"> {details.mt_mark_per_question}</span>
					</p>
				</div>
			</div>
			<div className="flex-1">
				<div className="flex flex-col justify-center gap-1 items-end h-full">
					{details.is_test_generated != 1 ? (
						<CButton onClick={handleGenerateResult.bind(null, details.id)} isLoading={_generateResultLoading}>
							Generate Result
						</CButton>
					) : (
						<CButton disabledCursor="cursor-ban" disabled={true} className={'btn--success'}>
							Result Generated
						</CButton>
					)}

					<CButton onClick={handleViewResult.bind(null, details.id)}>View Result</CButton>
				</div>
			</div>
		</div>
	);
}

export default GenerateRports;
