import {
    FiBookOpen,
    FiCheckCircle,
    FiList,
    FiPercent,
    FiTarget,
    FiUser,
    FiXCircle,
} from 'react-icons/fi';
import { H3 } from '../../UI/Headings.jsx';

function ScoreCard({ studExam }) {
    if (!studExam) return <div className="text-center text-sm text-red-600">No data available</div>;

    const correctMarks = +studExam.sfrs_correct * +studExam.mt_mark_per_question;
    const negativeMarks =
        +studExam.mt_is_negative === 1 ? +studExam.sfrs_wrong * +studExam.mt_negativ_mark : 0;
    const gainPercent = ((+studExam.sfrs_marks_gain / +studExam.sfrc_total_marks) * 100).toFixed(2);
    const isPass = +studExam.sfrs_marks_gain >= +studExam.mt_passing_out_of;

    return (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-1">
            <H3 className="text-3xl font-bold text-blue-700 mb-6 text-center">Score Card</H3>

            {/* Dashboard-style highlight cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="col-span-2">
                    <DetailCard
                        title="Candidate Summary"
                        childrenClassNames=""
                        icon={<FiUser size={20} className="" />}>
                        <DetailRow
                            label="Name"
                            value={studExam.full_name}
                            color="text-blue-600"
                            className="col-span-2"
                        />
                        <DetailRow
                            label="Roll No"
                            color="text-blue-600"
                            value={studExam.sfrs_student_roll_no}
                        />
                        <DetailRow
                            label="Application No"
                            value={studExam.sl_application_number}
                            color="text-blue-600"
                        />

                        <DetailRow label="Post" value={studExam.sl_post} color="text-blue-600" />

                        <DetailRow
                            label="Catagory"
                            value={studExam?.sl_catagory?.toUpperCase() || '-'}
                            color="text-blue-600"
                        />
                    </DetailCard>
                </div>
                <div className="grid grid-cols-2 col-span-2 gap-3">
                    <HighlightCard
                        icon={<FiTarget className="text-blue-600" size={28} />}
                        label="Final Score"
                        value={`${studExam.sfrs_marks_gain} / ${studExam.sfrc_total_marks}`}
                        color="text-blue-600"
                    />

                    <HighlightCard
                        icon={<FiPercent className="text-blue-600" size={28} />}
                        label="Percentage"
                        value={`${gainPercent} %`}
                        color="text-blue-600"
                    />

                    <HighlightCard
                        icon={<FiPercent className="text-blue-600" size={28} />}
                        label="Percentile"
                        value={`${studExam.srfs_percentile}`}
                        color="text-blue-600"
                    />
                    <HighlightCard
                        icon={
                            isPass ? (
                                <FiCheckCircle className="text-green-600" size={28} />
                            ) : (
                                <FiXCircle className="text-red-600" size={28} />
                            )
                        }
                        label="Result"
                        value={isPass ? 'PASS' : 'FAIL'}
                        color={isPass ? 'text-green-600' : 'text-red-600'}
                    />
                </div>
            </div>

            {/* Detailed section: 2-column grid */}
            <div className="grid gap-6 md:grid-cols-2">
                {/* Attempt Summary */}
                <DetailCard title="Attempt Summary" icon={<FiList size={20} className="" />}>
                    <DetailRow
                        label="Correct"
                        value={studExam.sfrs_correct}
                        color="text-green-600"
                    />
                    <DetailRow label="Wrong" value={studExam.sfrs_wrong} color="text-red-600" />
                    <DetailRow label="Unattempted" value={studExam.sfrs_unattempted} />
                    <DetailRow
                        label="Total Solved"
                        value={+studExam.sfrs_correct + +studExam.sfrs_wrong}
                        color="text-blue-600"
                    />
                    <DetailRow
                        label="Time Left"
                        color="text-blue-600"
                        value={`${studExam.sfrs_rem_min} Min ${studExam.sfrs_rem_sec} Sec`}
                    />
                </DetailCard>

                {/* Test Information */}
                <DetailCard title="Test Info" icon={<FiBookOpen size={20} className="" />}>
                    <DetailRow color="text-blue-600" label="Exam Name" value={studExam.mt_name} />

                    <DetailRow
                        color="text-blue-600"
                        label="Total Questions"
                        value={studExam.mt_total_test_question}
                    />
                    <DetailRow
                        color="text-blue-600"
                        label="Time Allowed"
                        value={`${studExam.mt_test_time} Min`}
                    />
                    <DetailRow
                        color="text-blue-600"
                        label="Passing Marks"
                        value={studExam.mt_passing_out_of}
                    />
                    <DetailRow
                        color="text-blue-600"
                        label="Mark per Question"
                        value={studExam.mt_mark_per_question}
                    />
                    <DetailRow
                        label="Negative Marking"
                        value={+studExam.mt_is_negative === 1 ? 'Yes' : 'No'}
                        color={+studExam.mt_is_negative === 1 ? 'text-red-500' : 'text-blue-600'}
                    />
                    <DetailRow label="Negative Marks" value={negativeMarks} color="text-red-500" />
                </DetailCard>
            </div>
        </section>
    );
}

// Highlight cards (top of dashboard)
function HighlightCard({ icon, label, value, color }) {
    return (
        <div className="flex items-center gap-4 bg-white p-5 shadow-md rounded-xl border border-gray-200 hover:shadow-lg transition">
            <div className="p-3 rounded-full bg-gray-100">{icon}</div>
            <div>
                <p className="text-sm text-gray-500">{label}</p>
                <h4 className={`text-xl font-bold ${color}`}>{value}</h4>
            </div>
        </div>
    );
}

// Card layout for section
function DetailCard({ title, icon, children, childrenClassNames = '' }) {
    return (
        <div className="rounded-xl border border-gray-100 bg-white shadow-md hover:shadow-lg transition p-5">
            <div className="flex items-center gap-2 mb-4">
                <div className="bg-blue-100 p-2 rounded-full text-blue-600">{icon}</div>
                <h4 className="text-lg font-semibold text-gray-800">{title}</h4>
            </div>
            <div className={`grid grid-cols-2 gap-4 ${childrenClassNames}`}>{children}</div>
        </div>
    );
}

// Detail row
function DetailRow({ label, value, icon = null, color = 'text-gray-800', className = '' }) {
    return (
        <div
            className={`flex items-center justify-between bg-gray-50 px-3 py-2 rounded-lg shadow-md hover:bg-white transition ${className}`}>
            <div className="flex items-center gap-2 text-sm text-gray-600">
                {icon}
                <span>{label}</span>
            </div>
            <span className={`font-bold ${color}`}>{value}</span>
        </div>
    );
}

export default ScoreCard;
