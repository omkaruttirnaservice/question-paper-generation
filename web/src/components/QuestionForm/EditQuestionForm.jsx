import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

let SERVER_IP = import.meta.env.VITE_API_SERVER_IP;

import { FaAngleRight, FaGripLinesVertical } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';
import {
    EditQuestionFormActions,
    getBooksListThunk,
    getPublicationsListThunk,
    getSubjectsListThunk,
    getTopicsListThunk,
} from '../../Store/edit-question-form-slice.jsx';
import { ModalActions } from '../../Store/modal-slice.jsx';
import { getQuestionsListThunk } from '../../Store/tests-slice.jsx';
import useHttp from '../Hooks/use-http';
import CButton from '../UI/CButton.jsx';
import CModal from '../UI/CModal.jsx';
import AddBookModal from './AddBook/AddBookModal.jsx';
import AddPublicationModal from './AddPublication/AddPublicationModal.jsx';
import BookNameDropdown from './BookNameDropdown/BookNameDropdown.jsx';
import DifficultyLevelDropdown from './DifficultyLevelDropdown/DifficultyLevelDropdown.jsx';
import EditQuestionExplanationInput from './EditQuestionExplanationInput.jsx';
import EditQuestionOptionsInput from './EditQuestionFormOptions.jsx';
import PublicationNameDropdown from './PublicationNameDropdown/PublicationNameDropdown.jsx';
import QuestionMonthDropdown from './QuestionMonthDropdown/QuestionMonthDropdown.jsx';
import QuestionPgNo from './QuestionPgNo/QuestionPgNo.jsx';
import QuestionYearDropdown from './QuestionYearDropdown/QuestionYearDropdown.jsx';
import editQuestionFormSchemaYUP from './editQuestionFormSchemaYUP.jsx';

const EditAddQuestionForm = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { sendRequest } = useHttp();

    let {
        data: _formData,
        isUpdateToMaster,
        isUpdateToMasterPersist,
    } = useSelector((state) => state.questionForm);
    const { testDetails } = useSelector((state) => state.tests);

    const [showNewInputField, setShowNewInputField] = useState(false);

    useEffect(() => {
        dispatch(getPublicationsListThunk(sendRequest));
    }, []);

    useEffect(() => {
        dispatch(getSubjectsListThunk(_formData.post_id, sendRequest));
    }, [_formData.post_id]);

    useEffect(() => {
        dispatch(getTopicsListThunk(_formData.subject_id, sendRequest));
    }, [_formData.subject_id]);

    useEffect(() => {
        dispatch(getBooksListThunk(_formData.pub_name, sendRequest));
    }, [_formData.pub_name]);

    const handleUpdateQuestion = async (e) => {
        e.preventDefault();
        try {
            await editQuestionFormSchemaYUP.validate(_formData, {
                abortEarly: false,
            });

            if (isUpdateToMaster && !isUpdateToMasterPersist) {
                dispatch(ModalActions.toggleModal('confirm-update-to-master-modal'));
            } else {
                postQuestionData();
            }
            dispatch(EditQuestionFormActions.setErrors({}));
        } catch (error) {
            const errorsObj = {};
            error.inner.forEach((el) => {
                errorsObj[el.path] = el.message;
            });
            dispatch(EditQuestionFormActions.setErrors(errorsObj));
        }
    };

    async function postQuestionData() {
   

        let reqData = {
            url: `${SERVER_IP}/api/test/update-test-question?isMasterUpdate=${isUpdateToMaster}`,
            method: 'PUT',
            body: JSON.stringify(_formData),
        };
        sendRequest(reqData, (data) => {
            if (data.success == 1) {
                toast('Successfully updated question');
                Swal.fire({
                    title: 'Success',
                    text: 'Updated question details',
                    icon: 'success',
                });

                dispatch(getQuestionsListThunk(testDetails.test_id, sendRequest, navigate));
                dispatch(ModalActions.toggleModal('edit-que-modal'));
                dispatch(EditQuestionFormActions.resetFormData());
            }
        });
    }

    return (
        <>
            <AddPublicationModal />
            <AddBookModal />
            <form id="add-question-form" className="grid gap-2">
                    <div className={`bg-white py-1`}>
                        <div className="mb-4">
                            <div className="bg-cyan-50/50 border border-cyan-100 rounded-[1.25rem] p-3 px-5 shadow-sm">
                                <div className="flex items-center gap-8">
                                    <div className="flex items-center gap-3">
                                        <div className="w-1 h-6 bg-cyan-500 rounded-full opacity-40" />
                                        <div className="flex flex-col">
                                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.15em] leading-none mb-1">Subject Name</span>
                                            <span className="text-[15px] font-black text-cyan-900">{_formData.subject_name}</span>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3">
                                        <div className="w-1 h-6 bg-cyan-500 rounded-full opacity-40" />
                                        <div className="flex flex-col">
                                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.15em] leading-none mb-1">Topic Name</span>
                                            <span className="text-[15px] font-black text-cyan-900">{_formData.topic_name}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="grid grid-cols-6 gap-4">
                            <DifficultyLevelDropdown />
                            <PublicationNameDropdown />
                            <BookNameDropdown />
                            <QuestionPgNo />
                            <QuestionMonthDropdown />
                            <QuestionYearDropdown />
                        </div>
                    </div>

                    <hr />

                    <div className="flex flex-col gap-3">
                        <EditQuestionOptionsInput
                            showNewInputField={showNewInputField}
                            setShowNewInputField={setShowNewInputField}
                        />
                    </div>

                    <hr />

                    <EditQuestionExplanationInput />

                    <div className="bg-white py-3 mt-4 border-t border-slate-100">
                        <div className="flex justify-end items-center gap-6 px-4">
                            <div className="flex items-center gap-4 bg-slate-50/80 px-4 py-2 rounded-2xl border border-slate-200/60 shadow-sm">
                                <label htmlFor="master-update" className="cursor-pointer text-xs font-black text-slate-500 uppercase tracking-wider">
                                    Update to master
                                </label>
                                <input
                                    type="checkbox"
                                    id="master-update"
                                    className="w-5 h-5 cursor-pointer accent-cyan-600 rounded-lg"
                                    checked={isUpdateToMaster}
                                    onChange={(e) => {
                                        dispatch(
                                            EditQuestionFormActions.setUpdateToMaster({
                                                isUpdateToMaster: e.target.checked,
                                                isUpdateToMasterPersist: isUpdateToMasterPersist,
                                            })
                                        );
                                    }}
                                />
                            </div>
                            <CButton
                                onClick={handleUpdateQuestion}
                                className="!px-6 !py-2 !rounded-xl !text-[12px] !font-black !bg-gradient-to-r !from-cyan-600 !to-cyan-500 !shadow-lg !shadow-cyan-200/40 hover:!scale-105 active:!scale-95 transition-all uppercase tracking-widest"
                                type="button"
                                isLoading={useSelector((state) => state.loader.isLoading)}>
                                Update
                            </CButton>
                        </div>
                    </div>
                </form>
            <ConfirmUpdateToMasterModal postQuestionData={postQuestionData} />
        </>
    );
};

function ConfirmUpdateToMasterModal({ postQuestionData }) {
    const dispatch = useDispatch();

    return (
        <>
            <CModal
                id={'confirm-update-to-master-modal'}
                title={'Warning'}
                className="!w-[14rem] h-fit">
                <p>The question will also get updated to master question.</p>
                <p>Do you want to continue?</p>

                <div className="flex gap-3 justify-center mt-3">
                    <CButton
                        onClick={() => {
                            dispatch(
                                EditQuestionFormActions.setUpdateToMaster({
                                    isUpdateToMaster: false,
                                    isUpdateToMasterPersist: false,
                                })
                            );
                            dispatch(ModalActions.toggleModal('confirm-update-to-master-modal'));
                            postQuestionData();
                        }}>
                        Allow once
                    </CButton>
                    <CButton
                        className={'btn--success'}
                        onClick={() => {
                            dispatch(
                                EditQuestionFormActions.setUpdateToMaster({
                                    isUpdateToMaster: true,
                                    isUpdateToMasterPersist: true,
                                })
                            );
                            dispatch(ModalActions.toggleModal('confirm-update-to-master-modal'));
                            postQuestionData();
                        }}>
                        Don't ask again and continue
                    </CButton>
                    <CButton
                        className={'btn--warning text-gray-800 '}
                        onClick={() => {
                            dispatch(ModalActions.toggleModal('confirm-update-to-master-modal'));
                        }}>
                        No
                    </CButton>
                </div>
            </CModal>
        </>
    );
}

export default EditAddQuestionForm;
