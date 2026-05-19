import { FaEye, FaTrash, FaXmark, FaUserGraduate } from 'react-icons/fa6';
import { useMutation, useQuery } from '@tanstack/react-query';
import React, { useEffect, useState } from 'react';
import { getSearchFilters, getStudList } from './stud-list-api.jsx';
import { useDispatch, useSelector } from 'react-redux';
import { StudentAreaActions } from '../../../Store/student-area-slice.jsx';
import CButton from '../../UI/CButton.jsx';

import DataTable from 'react-data-table-component';
import Input, { InputSelect } from '../../UI/Input.jsx';
import { s3BucketUrl, SEARCH_TYPE_NAME, SEARCH_TYPE_ROLL_NO } from '../../Utils/Constants.jsx';
import './StudentsList.css';

function StudentsList() {
    const dispatch = useDispatch();
    const { allList, filters, searchData } = useSelector((state) => state.studentArea);
    const [filterStudentsList_All, setFilterStudentsList_All] = useState(allList.studentsList_ALL);

    useEffect(() => {
        console.log(allList);
        setFilterStudentsList_All(allList.studentsList_ALL);
    }, [allList.studentsList_ALL]);

    const {
        data: _studList,
        isError: getStudentListErr,
        isPending: getStudentsListPending,
        refetch: refetchStudentsList,
    } = useQuery({
        queryKey: ['getStudList'],
        queryFn: () =>
            getStudList({
                page: allList?.page || 1,
                limit: allList?.limit || 10,
                ...searchData,
            }),
        retry: false,
        refetchOnWindowFocus: false,
    });

    useEffect(() => {
        if (_studList?.data) {
            console.log(_studList?.data, '=_studList?.data');
            dispatch(StudentAreaActions.setStudentsList_All(_studList?.data?.data));
        }
    }, [_studList]);

    const {
        data: _filters,
        isError: _filtersError,
        isPending: _filtersPending,
        refetch: _filtersRefetch,
    } = useQuery({
        queryKey: ['_filters'],
        queryFn: () => getSearchFilters(),
        retry: false,
        refetchOnWindowFocus: false,
    });

    useEffect(() => {
        if (_filters?.data) {
            console.log(_filters?.data.data[0].filters, '=_filters?.data');
            let { center, post, exam_date, batch } = _filters?.data.data[0].filters;

            dispatch(
                StudentAreaActions.setFiltersData({
                    center: center?.split(','),
                    post: post?.split(','),
                    exam_date: exam_date?.split(','),
                    batch: batch?.split(','),
                })
            );
        }
    }, [_filters]);

    const handleSearch = (e) => dispatch(StudentAreaActions.setSearchTerm_ALL(e.target.value));

    const handleSearchFilterChange = (e) => {
        const updatedSearchData = {
            ...searchData,
        };

        updatedSearchData[e.currentTarget.name] = e.currentTarget.value;

        dispatch(StudentAreaActions.setSearchFilterValues(updatedSearchData));
    };

    useEffect(() => {
        if (allList.searchTerm == '') {
            refetchStudentsList();
            return;
        }

        let timeOut = setTimeout(() => refetchStudentsList(), 1500);

        return () => {
            if (timeOut) clearTimeout(timeOut);
        };
    }, [searchData.searchTerm]);

    const handlePageChange = (newPage) => {
        const candidateList = allList.studentsList_ALL;
        const pagination = {
            page: newPage,
            limit: allList.limit,
            totalRows: allList.totalRows,
            totalPages: allList.totalPages,
        };

        dispatch(StudentAreaActions.setStudentsList_All({ candidateList, pagination }));
    };

    const handleChangeRowsPerPage = (currentRowsPerPage, currentPage) => {
        const candidateList = allList.studentsList_ALL;
        const pagination = {
            page: currentPage,
            limit: currentRowsPerPage,
            totalRows: allList.totalRows,
            totalPages: allList.totalPages,
        };

        dispatch(StudentAreaActions.setStudentsList_All({ candidateList, pagination }));
    };

    useEffect(() => {
        refetchStudentsList();
    }, [allList.page, allList.limit, searchData]);

    const columns = [
        {
            sortable: true,
            name: 'Name',
            cell: (row) => (
                <p className="flex items-center gap-2 justify-start py-1">
                    <img
                        src={`${s3BucketUrl}/${row.sl_image}`}
                        alt=""
                        className="h-9 w-9 rounded-full hover:scale-[1.3] shadow-md transition-all duration-300 border border-slate-100"
                    />
                    <span className="font-semibold text-slate-800">
                        {row.sl_f_name + ' ' + row.sl_m_name + ' ' + row.sl_l_name}
                    </span>
                </p>
            ),
            width: '18rem',
        },
        {
            sortable: true,
            name: 'Roll No',
            selector: (row) => row.sl_roll_number,
            width: '8rem',
        },
        {
            sortable: true,
            name: 'Application No',
            selector: (row) => row.sl_application_number,
            width: '10rem',
        },
        {
            sortable: true,
            name: 'Date of birth',
            selector: (row) => row.sl_date_of_birth,
            width: '9rem',
        },
        {
            sortable: true,
            name: 'Mobile number',
            selector: (row) => row.sl_contact_number,
            width: '9rem',
        },
        { sortable: true, name: 'Category', selector: (row) => row.sl_catagory, width: '8rem' },
        {
            sortable: true,
            name: 'Handicap',
            selector: (row) => (row.sl_is_physical_handicap == 1 ? 'Yes' : 'No'),
            width: '8rem',
        },
        { sortable: true, name: 'Post', selector: (row) => row.sl_post },
    ];

    return (
        <div className="sl-root">
            {/* Premium Header Bar */}
            <div className="sl-header-bar">
                <div className="sl-header-content">
                    <FaUserGraduate />
                    <span>STUDENT AREA</span>
                </div>
            </div>

            <div className="sl-content-container">
                {/* Search / Filters Card */}
                <div className="sl-filter-card">
                    <div className="grid grid-cols-7 gap-4 items-end">
                        <InputSelect
                            label={'Center'}
                            className={'w-full'}
                            value={searchData.centerName}
                            name="centerName"
                            onChange={handleSearchFilterChange}>
                            <option value="">-- Select --</option>
                            {filters?.center?.length > 0 &&
                                filters.center.map((_el) => {
                                    return <option value={_el}>{_el}</option>;
                                })}
                        </InputSelect>

                        <InputSelect
                            label={'Post'}
                            className={'w-full'}
                            value={searchData.postName}
                            name="postName"
                            onChange={handleSearchFilterChange}>
                            <option value="">-- Select --</option>
                            {filters?.post?.length > 0 &&
                                filters.post.map((_el) => {
                                    return <option value={_el}>{_el}</option>;
                                })}
                        </InputSelect>

                        <InputSelect
                            label={'Exam Date'}
                            className={'w-full'}
                            value={searchData.examDate}
                            name="examDate"
                            onChange={handleSearchFilterChange}>
                            <option value="">-- Select --</option>
                            {filters?.exam_date?.length > 0 &&
                                filters.exam_date.map((_el) => {
                                    return <option value={_el}>{_el}</option>;
                                })}
                        </InputSelect>

                        <InputSelect
                            label={'Batch'}
                            className={'w-full'}
                            value={searchData.batch}
                            name="batch"
                            onChange={handleSearchFilterChange}>
                            <option value="">-- Select --</option>
                            {filters?.batch?.length > 0 &&
                                filters.batch.map((_el) => {
                                    return <option value={_el}>{_el}</option>;
                                })}
                        </InputSelect>

                        <InputSelect
                            label={'Search Type'}
                            className={'w-full'}
                            value={searchData.searchType}
                            name="searchType"
                            onChange={handleSearchFilterChange}>
                            <option value="">-- Select --</option>
                            <option value={SEARCH_TYPE_ROLL_NO}>Roll No</option>
                            <option value={SEARCH_TYPE_NAME}>Name</option>
                        </InputSelect>

                        <Input
                            label={'Search'}
                            className={'w-full'}
                            value={searchData.searchTerm}
                            name="searchTerm"
                            onChange={handleSearchFilterChange}
                            disabled={searchData.searchType == ''}></Input>

                        <CButton
                            varient=""
                            className={'h-12 w-full mt-auto flex items-center justify-center !rounded-xl !bg-rose-50 hover:!bg-rose-100 !text-rose-600 transition-all border border-rose-200'}
                            icon={<FaXmark size={16} />}
                            onClick={() => {
                                dispatch(StudentAreaActions.resetSearchFilterValues());
                            }}>
                            Clear
                        </CButton>
                    </div>
                </div>

                {/* Table Card */}
                {filterStudentsList_All?.length >= 1 && (
                    <div className="sl-table-card">
                        <DataTable
                            columns={columns}
                            data={filterStudentsList_All}
                            pagination
                            fixedHeader
                            highlightOnHover
                            paginationServer
                            paginationTotalRows={allList?.totalRows || 0}
                            paginationDefaultPage={allList?.page || 0}
                            onChangePage={handlePageChange}
                            onChangeRowsPerPage={handleChangeRowsPerPage}
                            paginationComponentOptions={{
                                rowsPerPageText: 'Total Per Page',
                                rangeSeparatorText: '--',
                            }}
                            customStyles={{
                                header: { style: { display: 'none' } },
                                headRow: {
                                    style: {
                                        backgroundColor: '#F8FAFC',
                                        borderBottomColor: '#E2E8F0',
                                        minHeight: '52px',
                                    },
                                },
                                headCells: {
                                    style: {
                                        color: '#64748B',
                                        fontSize: '0.75rem',
                                        fontWeight: '800',
                                        textTransform: 'uppercase',
                                        letterSpacing: '0.05em',
                                    },
                                },
                                cells: {
                                    style: {
                                        color: '#1E293B',
                                        fontSize: '0.875rem',
                                        fontWeight: '600',
                                        paddingTop: '0.5rem',
                                        paddingBottom: '0.5rem',
                                    },
                                },
                                rows: {
                                    style: {
                                        borderBottomColor: '#F1F5F9',
                                        '&:hover': {
                                            backgroundColor: '#F8FAFC',
                                        },
                                    },
                                },
                                pagination: {
                                    style: {
                                        borderTopColor: '#E2E8F0',
                                    },
                                },
                            }}
                        />
                    </div>
                )}

                {filterStudentsList_All?.length == 0 && !getStudentsListPending && (
                    <div className="text-center p-12 bg-white rounded-3xl border border-slate-100 shadow-sm">
                        <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Students not found...</p>
                    </div>
                )}
                {getStudentsListPending && (
                    <div className="text-center p-12 bg-white rounded-3xl border border-slate-100 shadow-sm animate-pulse">
                        <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Getting students list...</p>
                    </div>
                )}
                {getStudentListErr && (
                    <div className="text-center p-12 bg-white rounded-3xl border border-slate-100 shadow-sm">
                        <p className="text-rose-500 font-bold uppercase tracking-widest text-xs">Error fetching students list...</p>
                    </div>
                )}
            </div>
        </div>
    );
}

export default StudentsList;
