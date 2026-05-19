import { useRef, useState } from 'react';
import { FaPrint } from 'react-icons/fa';

const CIRCLE = 'CIRCLE';
const TEXT = 'TEXT';
const NUMBER = 'NUMBER';
const ROMAN = 'ROMAN';

const optionsInputEnum = [NUMBER, CIRCLE, TEXT, ROMAN];

const PDFGenerator = ({ questions, testDetails }) => {
    const _pdfConfig = {
        isShowCorrectAns: false,
        title: testDetails?.test_name || 'Question Paper',
        isListView: true,
        duration: testDetails?.test_duration || 90,
        isNegativeMarking: testDetails?.is_negative_marking || false,
        negativeMarks: testDetails?.negative_mark || 0,
        examDate: '2026-05-09',
        totalQuestions: questions?.length || 0,
        optionInput: CIRCLE,
    };

    const printContainerRef = useRef(null);
    const [pdfConfig, setPdfConfig] = useState(_pdfConfig);

    const handlePrint = () => {
        if (printContainerRef?.current) {
            const printContent = printContainerRef.current.innerHTML;
            const printWindow = window.open('', '_blank', 'width=1080, height=1920');
            printWindow.document.write(`
                <html>
                    <head>
                        <title>Print</title>
                        <script src="https://cdn.jsdelivr.net/npm/@tailwindcss/browser@4"></script>
                        <style>
                            @media print {
                                body { margin: 0; padding: 0; }
                                .print-container { width: 100%; max-width: none !important; border: none !important; shadow: none !important; padding: 0 !important; }
                            }
                        </style>
                    </head>
                    <body class="bg-white">
                        <div class="print-container p-8">
                            ${printContent}
                        </div>
                    </body>
                </html>
            `);
        }
    };

    return (
        <div className="p-6 bg-slate-50 min-h-screen">
            {/* Print Setup Card */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden mb-8 max-w-5xl mx-auto">
                <div className="flex justify-between items-center p-5 border-b border-slate-100">
                    <div className="flex items-center gap-3">
                        <div className="bg-blue-600 text-white p-2.5 rounded-lg">
                            <FaPrint className="text-lg" />
                        </div>
                        <h3 className="text-xl font-bold text-slate-800">Print Setup</h3>
                    </div>
                    <button 
                        onClick={handlePrint}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg font-semibold flex items-center gap-2 transition-colors">
                        <FaPrint /> Print Document
                    </button>
                </div>
                
                <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Col 1 */}
                    <div className="space-y-6">
                        <div>
                            <label className="block text-[11px] font-extrabold text-slate-400 mb-2 uppercase tracking-wider">Paper Title</label>
                            <input
                                type="text"
                                className="w-full border border-slate-200 bg-slate-50 rounded-lg p-2.5 text-sm font-semibold text-slate-800 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all"
                                value={pdfConfig.title}
                                onChange={(e) => setPdfConfig((prev) => ({ ...prev, title: e.target.value }))}
                            />
                        </div>
                        <div>
                            <label className="block text-[11px] font-extrabold text-slate-400 mb-2 uppercase tracking-wider">Option Label Style</label>
                            <select
                                className="w-full border border-slate-200 bg-slate-50 rounded-lg p-2.5 text-sm font-semibold text-slate-800 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all appearance-none"
                                value={pdfConfig.optionInput}
                                onChange={(e) => setPdfConfig((prev) => ({ ...prev, optionInput: e.target.value }))}>
                                <option value={CIRCLE}>Circle (○)</option>
                                <option value={NUMBER}>Number (1, 2, 3)</option>
                                <option value={TEXT}>Text (A, B, C)</option>
                                <option value={ROMAN}>Roman (i, ii, iii)</option>
                            </select>
                        </div>
                    </div>
                    
                    {/* Col 2 */}
                    <div className="space-y-6">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-[11px] font-extrabold text-slate-400 mb-2 uppercase tracking-wider">Duration (Min)</label>
                                <input
                                    type="text"
                                    className="w-full border border-slate-200 bg-slate-50 rounded-lg p-2.5 text-sm font-semibold text-slate-800 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all"
                                    value={pdfConfig.duration}
                                    onChange={(e) => setPdfConfig((prev) => ({ ...prev, duration: e.target.value }))}
                                />
                            </div>
                            <div>
                                <label className="block text-[11px] font-extrabold text-slate-400 mb-2 uppercase tracking-wider">Exam Date</label>
                                <input
                                    type="date"
                                    className="w-full border border-slate-200 bg-slate-50 rounded-lg p-2.5 text-sm font-semibold text-slate-800 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all"
                                    value={pdfConfig.examDate}
                                    onChange={(e) => setPdfConfig((prev) => ({ ...prev, examDate: e.target.value }))}
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-[11px] font-extrabold text-slate-400 mb-2 uppercase tracking-wider">View Layout</label>
                            <div className="flex gap-6 p-2.5 bg-slate-50 rounded-lg border border-slate-100">
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="radio"
                                        name="viewType"
                                        checked={pdfConfig.isListView}
                                        onChange={() => setPdfConfig((prev) => ({ ...prev, isListView: true }))}
                                        className="w-4 h-4 text-blue-600 focus:ring-blue-500 cursor-pointer"
                                    />
                                    <span className="text-sm font-bold text-slate-700">List View</span>
                                </label>
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="radio"
                                        name="viewType"
                                        checked={!pdfConfig.isListView}
                                        onChange={() => setPdfConfig((prev) => ({ ...prev, isListView: false }))}
                                        className="w-4 h-4 text-blue-600 focus:ring-blue-500 cursor-pointer"
                                    />
                                    <span className="text-sm font-bold text-slate-700">Split View</span>
                                </label>
                            </div>
                        </div>
                    </div>
                    
                    {/* Col 3 */}
                    <div className="space-y-4">
                        <div className="flex items-center justify-between p-3.5 border border-slate-100 rounded-lg bg-slate-50">
                            <span className="text-[11px] font-extrabold text-slate-500 uppercase tracking-wider">Show Correct Answer</span>
                            <ToggleButtonUi
                                status={pdfConfig.isShowCorrectAns}
                                onClick={() => setPdfConfig((prev) => ({ ...prev, isShowCorrectAns: !prev.isShowCorrectAns }))}
                            />
                        </div>
                        <div className="flex items-center justify-between p-3.5 border border-slate-100 rounded-lg bg-slate-50">
                            <span className="text-[11px] font-extrabold text-slate-500 uppercase tracking-wider">Negative Marking</span>
                            <ToggleButtonUi
                                status={pdfConfig.isNegativeMarking}
                                onClick={() => setPdfConfig((prev) => ({ ...prev, isNegativeMarking: !prev.isNegativeMarking }))}
                            />
                        </div>
                        {pdfConfig.isNegativeMarking && (
                            <div className="animate-fade-in-down">
                                <label className="block text-[11px] font-extrabold text-slate-400 mb-2 uppercase tracking-wider">Negative Value</label>
                                <input
                                    type="number"
                                    step="0.01"
                                    className="w-full border border-red-200 bg-red-50 rounded-lg p-2.5 text-sm font-bold text-red-600 focus:border-red-400 focus:ring-1 focus:ring-red-400 outline-none transition-all"
                                    value={pdfConfig.negativeMarks}
                                    onChange={(e) => setPdfConfig((prev) => ({ ...prev, negativeMarks: e.target.value }))}
                                />
                            </div>
                        )}
                    </div>
                </div>
                
                {/* Footer status bar */}
                <div className="bg-[#F8FAFC] border-t border-slate-100 px-6 py-4 flex items-center gap-8 text-[11px] font-extrabold text-slate-500 uppercase tracking-widest">
                    <span className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 bg-blue-600 rounded-full"></div>
                        Total Questions: {pdfConfig.totalQuestions}
                    </span>
                    <span className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 bg-blue-600 rounded-full"></div>
                        Total Marks: {pdfConfig.totalQuestions}
                    </span>
                    <span className="flex items-center gap-2 text-blue-600 ml-auto">
                        <div className="w-1.5 h-1.5 bg-blue-600 rounded-full"></div>
                        Live Preview
                    </span>
                </div>
            </div>

            {/* Document Preview Area */}
            <div ref={printContainerRef} className="max-w-4xl mx-auto bg-white p-12 shadow-lg border border-slate-200">
                {/* Header */}
                <h1 className="text-3xl font-bold text-center mb-8 text-black tracking-tight">{pdfConfig.title}</h1>
                
                {/* Meta details grid */}
                <div className="grid grid-cols-3 gap-y-8 gap-x-4 text-[15px] text-black mb-8 pb-8 border-b border-gray-200">
                    <p>
                        <strong className="font-extrabold text-black">Exam Duration :</strong> {pdfConfig.duration} Minutes
                    </p>
                    <p>
                        <strong className="font-extrabold text-black">Total Questions :</strong> {pdfConfig.totalQuestions}
                    </p>
                    <p>
                        <strong className="font-extrabold text-black">Exam Date :</strong>{' '}
                        {new Date(pdfConfig?.examDate).toLocaleDateString()}
                    </p>
                    <p>
                        <strong className="font-extrabold text-black">Mark Per Question :</strong> 1
                    </p>
                    <p>
                        <strong className="font-extrabold text-black">Negative Marking :</strong>{' '}
                        {pdfConfig.isNegativeMarking ? 'Yes' : 'No'}
                    </p>
                    <p>
                        <strong className="font-extrabold text-black">Negative Marks :</strong> {pdfConfig.isNegativeMarking ? pdfConfig.negativeMarks : 0}
                    </p>
                </div>
                
                {/* Questions Container */}
                <div className={`text-black ${!pdfConfig.isListView ? 'columns-2 gap-8' : ''}`}>
                    {questions.length > 0 &&
                        questions.map((q, idx) => (
                            <QuestionUi key={idx} idx={idx} q={q} pdfConfig={pdfConfig} />
                        ))}
                </div>
            </div>
        </div>
    );
};

function QuestionUi({ idx, q, pdfConfig }) {
    return (
        <div className="flex gap-4 mb-8 break-inside-avoid">
            {/* Question Number */}
            <div className="font-bold text-black text-[15px] pt-0.5 min-w-[20px]">
                {idx + 1}.
            </div>
            
            {/* Question Body */}
            <div className="flex-1">
                <div
                    className="font-bold text-black text-[15px] mb-4 leading-relaxed"
                    dangerouslySetInnerHTML={{
                        __html: q?.q || q?.mqs_question || '-',
                    }}
                />

                {/* Options Grid */}
                <div className="grid grid-cols-2 gap-y-4 gap-x-6 text-[14.5px]">
                    {(q?.q_a || q?.mqs_opt_one) && (
                        <QuestionOption idx={0} html={q?.q_a || q?.mqs_opt_one || '-'} pdfConfig={pdfConfig} />
                    )}
                    {(q?.q_b || q?.mqs_opt_two) && (
                        <QuestionOption idx={1} html={q?.q_b || q?.mqs_opt_two || '-'} pdfConfig={pdfConfig} />
                    )}
                    {(q?.q_c || q?.mqs_opt_three) && (
                        <QuestionOption idx={2} html={q?.q_c || q?.mqs_opt_three || '-'} pdfConfig={pdfConfig} />
                    )}
                    {(q?.q_d || q?.mqs_opt_four) && (
                        <QuestionOption idx={3} html={q?.q_d || q?.mqs_opt_four || '-'} pdfConfig={pdfConfig} />
                    )}
                    {(q?.q_e || q?.mqs_opt_five) && (
                        <QuestionOption idx={4} html={q?.q_e || q?.mqs_opt_five || '-'} pdfConfig={pdfConfig} />
                    )}
                </div>

                {/* Correct Answer Box */}
                {pdfConfig.isShowCorrectAns && (
                    <div className="mt-4 inline-block bg-slate-100 border border-slate-200 px-4 py-1.5 rounded-md text-sm font-bold text-black">
                        Correct Answer:{' '}
                        {(() => {
                            const ans = q?.q_ans || q?.mqs_ans;
                            if (!ans) return '-';
                            const normalizedAns = ans.toUpperCase();
                            const index = normalizedAns.charCodeAt(0) - 65;
                            
                            if (index < 0 || index > 4) return normalizedAns;

                            switch (pdfConfig.optionInput) {
                                case 'NUMBER': return (index + 1).toString();
                                case 'ROMAN': return ['i', 'ii', 'iii', 'iv', 'v'][index];
                                case 'TEXT':
                                case 'CIRCLE':
                                default: return normalizedAns;
                            }
                        })()}
                    </div>
                )}
            </div>
        </div>
    );
}

function QuestionOption({ html, pdfConfig, idx }) {
    const getOptionLabel = () => {
        switch (pdfConfig.optionInput) {
            case NUMBER:
                return <span className="font-medium">{idx + 1})</span>;
            case TEXT:
                return <span className="font-medium">{String.fromCharCode(65 + idx)})</span>;
            case ROMAN:
                const romans = ['i', 'ii', 'iii', 'iv', 'v', 'vi', 'vii', 'viii', 'ix', 'x'];
                return <span className="font-medium">{romans[idx] || idx + 1})</span>;
            case CIRCLE:
                // Use a large circle character or an empty rounded span
                return <span className="text-xl leading-none text-slate-500 font-normal mr-1">&#9675;</span>;
            default:
                return <span className="font-medium">{String.fromCharCode(65 + idx)})</span>;
        }
    };

    return (
        <div className="flex items-start gap-2.5 text-slate-800">
            <div className="shrink-0 mt-0.5">{getOptionLabel()}</div>
            <div
                className="inline-block"
                dangerouslySetInnerHTML={{
                    __html: html,
                }}
            />
        </div>
    );
}

function ToggleButtonUi({ onClick, status }) {
    return (
        <button
            type="button"
            onClick={onClick}
            className={`w-[38px] h-5 flex items-center rounded-full transition-colors duration-300 focus:outline-none ${
                status ? 'bg-blue-600' : 'bg-slate-300'
            }`}>
            <span
                className={`w-3.5 h-3.5 bg-white rounded-full shadow-sm transform transition-transform duration-300 ${
                    status ? 'translate-x-[20px]' : 'translate-x-[3px]'
                }`}
            />
        </button>
    );
}

export default PDFGenerator;
