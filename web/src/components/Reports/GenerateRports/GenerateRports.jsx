import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { H3 } from '../../UI/Headings.jsx';
import { useQuery } from '@tanstack/react-query';
import { getPublishedTestLists } from './gen-reports-api.jsx';
import CButton from '../../UI/CButton.jsx';
import { reportsAction } from '../../../Store/reports-slice.jsx';

function GenerateRports() {
	const { examServerIP, testsList } = useSelector((state) => state.reports);
	const dispatch = useDispatch();

	const { data: publishedTestsList } = useQuery({
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
				return <TestDetails el={el} idx={idx} key={idx} />;
			})}
		</div>
	);
}

function TestDetails({ el: details, idx }) {
	return (
		<div className="border flex gap-6 px-7 mx-10">
			<div className="border-r p-6 text-2xl font-bold">{idx + 1}</div>
			<div className="flex flex-col justify-center gap-3">
				<p className="text-xl">{details.mt_name}</p>
				<div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
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
					{details.is_test_generated != 1 ? <CButton>Generate Result</CButton> : <CButton className={'btn--success'}> Result Generated </CButton>}
				</div>
			</div>
		</div>
	);
}

export default GenerateRports;
