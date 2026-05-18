import { useSelector } from 'react-redux';
import { MdCheckCircle } from 'react-icons/md';

function AllQuestionsPreview({ el, idx, handleAddQuestionToList }) {
    const { selectedQuestionsList } = useSelector((state) => state.tests);

    const isSelected = selectedQuestionsList.some((item) => item.q_id == el.q_id);

    return (
        <div
            className={`ql-q-card ${isSelected ? 'ql-q-card--selected' : ''}`}
            onClick={() => handleAddQuestionToList(el)}
            key={idx}
        >
            <div className="ql-q-header">
                <span className="ql-q-id">Question #{el.q_id}</span>
                {isSelected && <MdCheckCircle className="text-indigo-600 text-xl" />}
            </div>

            <div
                className="ql-q-content"
                dangerouslySetInnerHTML={{ __html: el.q }}
            />

            <div className="ql-q-options">
                {[
                    { label: 'A', value: el.q_a },
                    { label: 'B', value: el.q_b },
                    { label: 'C', value: el.q_c },
                    { label: 'D', value: el.q_d },
                    { label: 'E', value: el.q_e },
                ].filter(opt => opt.value).map((opt, i) => (
                    <div key={i} className="ql-q-opt">
                        <span className="ql-q-opt-lbl">{opt.label}</span>
                        <div dangerouslySetInnerHTML={{ __html: opt.value }} />
                    </div>
                ))}
            </div>

            <div className="ql-q-footer">
                <span className="ql-q-ans">Correct: {el.q_ans}</span>
                {el.q_sol && <span className="ql-q-sol-btn">View Solution</span>}
            </div>
        </div>
    );
}

export default AllQuestionsPreview;
