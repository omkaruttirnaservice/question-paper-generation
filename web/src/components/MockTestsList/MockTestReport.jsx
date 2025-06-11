let SERVER_IP = import.meta.env.VITE_API_SERVER_IP;
import React, { useEffect, useState } from 'react';
import 'react-datepicker/dist/react-datepicker.css';
import { AiOutlineLoading3Quarters } from 'react-icons/ai';
import { FaEye, FaPlus, FaXmark } from 'react-icons/fa6';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import useHttp from '../Hooks/use-http.jsx';
import CButton from '../UI/CButton.jsx';
import { H1, H3 } from '../UI/Headings.jsx';
import './TestsList.css';
import { testsSliceActions } from '../../Store/tests-slice.jsx';
import Swal from 'sweetalert2';
import { confirmDialouge } from '../../helpers/confirmDialouge.jsx';
import DataTable from 'react-data-table-component';

function MockTestReport() {
    const [searchParams] = useSearchParams();
    const { sendRequest } = useHttp();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { isLoading } = useSelector((state) => state.loader);

    console.log(1);

    const [publishedTestReport, setPublishedTestReport] = useState([]);
    console.log({ publishedTestReport });

    useEffect(() => {
        getExamsList();
    }, []);

    function getExamsList() {
        const reqData = {
            url: SERVER_IP + `/api/test/mock-test-report?ptid=${searchParams.get('ptid')}`,
        };
        console.log(reqData, '-req');
        sendRequest(reqData, ({ data }) => {
            if (data.length >= 1) {
                setPublishedTestReport(data);
            }
        });
    }

    const columns = [
        {
            name: 'id',
            selector: (row, idx) => idx + 1,
            width: '5rem',
        },
        {
            sortable: true,
            name: 'Name',
            selector: (row) => row.full_name,
        },
        {
            sortable: true,
            name: 'Published Test Id',
            selector: (row) => row.published_test_id,
        },

        {
            sortable: true,
            name: 'Time Remaining',
            selector: (row) => (
                <>
                    {row.stm_min && row.stm_sec && (
                        <>{row.stm_min + ' min ' + row.stm_sec + ' sec'}</>
                    )}
                    {!row?.stm_min && !row?.stm_sec && <>-</>}
                </>
            ),
        },
        {
            sortable: true,
            name: 'MAC',
            selector: (row) => (
                <>
                    {row.mac_id && <>{row.mac_id}</>}
                    {!row.mac_id && <>-</>}
                </>
            ),
        },
        {
            sortable: true,
            name: 'Test Status',
            selector: (row) => (
                <>
                    {row.stl_test_status == 0 ? (
                        <mark className="bg-green-400">Completed</mark>
                    ) : (
                        <mark className="bg-yellow-300">Incomplete</mark>
                    )}
                </>
            ),
        },
    ];

    return (
        <>
            <div className="mt-6">
                <H3 className="text-center">Mock Tests Report</H3>

                <DataTable
                    columns={columns}
                    data={publishedTestReport}
                    pagination
                    highlightOnHover
                />
            </div>
        </>
    );
}

export default MockTestReport;
