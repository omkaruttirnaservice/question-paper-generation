import { memo } from 'react';

const SelectedQuestionsPreview = memo(({ el, topicHeader }) => {
    return (
        <div className="ql-selected-item-wrap">
            {topicHeader}
            <div className="ql-q-card ql-q-card--selected">
                <div className="ql-q-header">
                    <span className="ql-q-id">Question #{el.q_id}</span>
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
                </div>
            </div>
        </div>
    );
});

export default SelectedQuestionsPreview;
