import { useMutation, useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Swal from 'sweetalert2';
import { reportsAction } from '../../../Store/reports-slice.jsx';
import CButton from '../../UI/CButton.jsx';
import { H3 } from '../../UI/Headings.jsx';
import { generateResult, getPublishedTestLists, getResultExcel } from './gen-reports-api.jsx';
import { MdAssignment, MdHistory, MdOutlineAssessment } from 'react-icons/md';
import './GenerateRports.css';

function GenerateRports() {
    const { testsList } = useSelector((state) => state.reports);
    const dispatch = useDispatch();

    const { data: publishedTestsList, refetch } = useQuery({
        queryKey: ['get-published-test-list'],
        queryFn: getPublishedTestLists,
    });

    useEffect(() => {
        if (publishedTestsList?.data?.length >= 1) {
            dispatch(reportsAction.setTestsList(publishedTestsList.data));
        }
    }, [publishedTestsList]);

    return (
        <div className="gr-root">
            {/* Premium Header Bar */}
            <div className="gr-header-bar">
                <div className="gr-header-content">
                    <MdOutlineAssessment size={24} />
                    <span>TEST REPORTS DASHBOARD</span>
                </div>
            </div>

            <div className="gr-card-list">
                {testsList.length >= 1 &&
                    testsList.map((el, idx) => {
                        return <TestDetails el={el} idx={idx} key={idx} refetch={refetch} />;
                    })}
                {testsList.length == 0 && (
                    <div className="text-center p-12 bg-white rounded-3xl border border-slate-100 shadow-sm">
                        <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">No published tests found to generate reports!</p>
                    </div>
                )}
            </div>
        </div>
    );
}

function TestDetails({ el: details, idx, refetch }) {
    // START: generate result===============
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
        _generateResult({
            b64PublishedTestId: btoa(publishedTestId),
        });
    };

    // END: generate result===============

    // START: excel generate result===============
    const {
        mutate: _getResultExcel,
        isPending: _getResultExcelPending,
        isError: _getResultExcelErr,
    } = useMutation({
        mutationFn: getResultExcel,
        onSuccess: (data) => {
            console.log(data, '==data==');
        },
        onError: (err) => {
            alert(err.message || 'Something went wrong');
            console.log(err, '==err==');
        },
    });
    const handleExelResult = (publishedTestId) => {
        console.log(publishedTestId, '==publishedTestId==');
        // Converting the published test id to base 64 string
        _getResultExcel(btoa(publishedTestId));
    };
    // END: excel generate result===============

    return (
        <div className="gr-card">
            <div className="gr-card-number">
                {String(idx + 1).padStart(2, '0')}
            </div>
            
            <div className="gr-card-info">
                <h3 className="gr-card-title">{details.mt_name}</h3>
                <div className="gr-card-meta">
                    <div className="gr-meta-badge">
                        Date: <span>{details.mt_added_date}</span>
                    </div>
                    <div className="gr-meta-badge">
                        Total Questions: <span>90</span>
                    </div>
                    <div className="gr-meta-badge">
                        Duration: <span>{details.mt_test_time} Min</span>
                    </div>
                    <div className="gr-meta-badge">
                        Marks Per Q: <span>{details.mt_mark_per_question}</span>
                    </div>
                </div>
            </div>

            <div className="gr-actions">
                {details.is_test_generated != 1 ? (
                    <CButton
                        className="!rounded-xl shadow-md !py-2.5 !px-5"
                        onClick={handleGenerateResult.bind(null, details.id)}
                        isLoading={_generateResultLoading}>
                        Generate Result
                    </CButton>
                ) : (
                    <CButton
                        varient="btn--warning"
                        className="!rounded-xl shadow-md !py-2.5 !px-5"
                        onClick={handleGenerateResult.bind(null, details.id)}
                        isLoading={_generateResultLoading}>
                        Regenerate Result
                    </CButton>
                )}
                
                <CButton 
                    varient="btn--primary" 
                    className="!rounded-xl shadow-sm !py-2.5 !px-5 flex items-center gap-1.5"
                    onClick={() => alert('Activity Log details coming soon')}>
                    <MdHistory size={16} />
                    Activity Log
                </CButton>
            </div>
        </div>
    );
}

export default GenerateRports;
