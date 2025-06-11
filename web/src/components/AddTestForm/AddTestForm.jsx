import React, { useState } from 'react';
import { FaFloppyDisk } from 'react-icons/fa6';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { testsSliceActions } from '../../Store/tests-slice.jsx';
import CButton from '../UI/CButton.jsx';
import CModal from '../UI/CModal.jsx';
import Input from '../UI/Input.jsx';

import * as Yup from 'yup';
import { ModalActions } from '../../Store/modal-slice.jsx';

function AddTestForm() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { test, errors } = useSelector((state) => state.tests);

    const createTestFormSchema = Yup.object().shape({
        test_name: Yup.string('Enter test name').required('Test name required'),
        test_duration: Yup.string('Enter test duration').required('Test duration required'),
        marks_per_question: Yup.string('Enter marks per que.').required('Marks per que. required'),
        test_passing_mark: Yup.string('Enter passing marks').required('Passing marks required.'),
    });

    const inputChangeHandler = async (e) => {
        let { name, value } = e.target;
        createTestFormSchema
            .validateAt(name, { [name]: value })
            .then(() => {
                dispatch(testsSliceActions.setErrors({ ...errors, [name]: null }));
            })
            .catch((error) => {
                console.log(error, '==error==');
                dispatch(testsSliceActions.setErrors({ ...errors, [name]: error.message }));
            });

        dispatch(testsSliceActions.setTestDetails({ key: name, value }));
    };

    const createTestSubmitHandler = async (e) => {
        e.preventDefault();
        try {
            await createTestFormSchema.validate({ ...test }, { abortEarly: false });
            dispatch(ModalActions.toggleModal('create-test-modal'));
            dispatch(testsSliceActions.setTestDetailsFilled(true));
        } catch (error) {
            console.log(error, '---');
            let __err = {};
            error.inner.forEach((el) => {
                __err[el.path] = el.message;
            });

            dispatch(testsSliceActions.setErrors(__err));
            dispatch(testsSliceActions.setTestDetailsFilled(false));
        }
    };
    return (
        <div>
            <CModal id="create-test-modal" title={'Create New Test (Manual)'}>
                <form action="" id="create-test-form" onSubmit={createTestSubmitHandler}>
                    <div className="grid grid-cols-3 gap-6 mb-5">
                        <div className="relative">
                            <Input
                                value={test.test_name}
                                label={'Test name'}
                                name="test_name"
                                error={errors.test_name ? true : false}
                                onChange={inputChangeHandler}></Input>
                            {errors.test_name && <span className="error">{errors.test_name}</span>}
                        </div>

                        <div className="relative">
                            <Input
                                value={test.test_duration}
                                label={'Test duration'}
                                name="test_duration"
                                error={errors.test_duration ? true : false}
                                onChange={inputChangeHandler}></Input>

                            {errors.test_duration && (
                                <span className="error">{errors.test_duration}</span>
                            )}
                        </div>

                        <div className="relative">
                            <Input
                                value={test.marks_per_question}
                                label={'Marks per question'}
                                name="marks_per_question"
                                error={errors.marks_per_question ? true : false}
                                onChange={inputChangeHandler}></Input>

                            {errors.marks_per_question && (
                                <span className="error">{errors.marks_per_question}</span>
                            )}
                        </div>

                        <div className="relative">
                            <Input
                                value={test.test_passing_mark}
                                label={'Passing marks'}
                                name="test_passing_mark"
                                error={errors.test_passing_mark ? true : false}
                                onChange={inputChangeHandler}></Input>

                            {errors.test_passing_mark && (
                                <span className="error">{errors.test_passing_mark}</span>
                            )}
                        </div>
                    </div>
                    <div className="flex justify-center">
                        <CButton type="submit" icon={<FaFloppyDisk />}>
                            Save
                        </CButton>
                    </div>
                </form>
            </CModal>
        </div>
    );
}

export default AddTestForm;
