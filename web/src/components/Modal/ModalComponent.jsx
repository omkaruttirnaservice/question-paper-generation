import { Modal, Button } from 'react-bootstrap';
import { useSelector, useDispatch } from 'react-redux';
import { modalActions } from '../../Store/modal-slice';
function ModalComponent({ show, title, modalBody }) {
    console.log();
    // const title = useSelector((state) => state.modal.title);
    // const modalBody = useSelector((state) => state.modal.modalBody);
    // const dispatch = useDispatch();
    const handleClose = () => {
        // dispatch(modalActions.closeModal());
    };
    console.log("IN herrrrrrrrrrr")
    return (
        <>
            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>{title}</Modal.Title>
                </Modal.Header>
                <Modal.Body>{modalBody}</Modal.Body>
            </Modal>
        </>
    );
}

export default ModalComponent;
