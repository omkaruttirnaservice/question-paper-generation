import { useRef, useState } from 'react';
import CButton from './UI/CButton';
import { FaPrint, FaClock, FaCalendarAlt, FaChevronDown } from 'react-icons/fa';

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
        examDate: new Date().toISOString().split('T')[0],
        totalQuestions: questions?.length || 0,
        optionInput: optionsInputEnum[1], // Default to Circle
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
                        <title>${pdfConfig.title}</title>
                        <script src="https://cdn.jsdelivr.net/npm/@tailwindcss/browser@4"></script>
                        <style>
                            @page { margin: 15mm; }
                            body { font-family: 'Inter', sans-serif; }
                            .break-inside-avoid { break-inside: avoid; }
                        </style>
                    </head>
                    <body>
                        <div class="p-8">
                            ${printContent}
                        </div>
                    </body>
                </html>
            `);
            printWindow.document.close();
            setTimeout(() => printWindow.print(), 500);
        }
    };

    return (
        <div className="bg-gray-100 min-h-screen p-4 md:p-8">
            {/* Simple & Complete Control Panel */}
            <div className="max-w-6xl mx-auto bg-white border border-gray-200 rounded-xl shadow-sm mb-8 overflow-hidden">
                <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
                    <div className="flex items-center gap-3">
                        <div className="size-10 bg-blue-600 rounded-lg flex items-center justify-center text-white">
                            <FaPrint size={18} />
                        </div>
                        <h2 className="text-lg font-bold text-gray-800 tracking-tight">Print Setup</h2>
                    </div>
                    <CButton
                        className="h-10 px-8 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center gap-2 font-bold text-sm shadow-sm transition-all active:scale-95"
                        onClick={handlePrint}
                    >
                        <FaPrint />
                        <span>Print Document</span>
                    </CButton>
                </div>

                <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {/* Column 1: Basics */}
                    <div className="space-y-4">
                        <div className="flex flex-col gap-1.5">
                            <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider ml-1">Paper Title</label>
                            <input
                                type="text"
                                className="h-10 px-4 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:bg-white outline-none transition-all font-medium"
                                value={pdfConfig.title}
                                onChange={(e) => setPdfConfig(p => ({ ...p, title: e.target.value }))}
                            />
                        </div>
                        <div className="flex flex-col gap-1.5">
                            <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider ml-1">Option Label Style</label>
                            <div className="relative">
                                <select
                                    className="h-10 px-4 w-full bg-gray-50 border border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:bg-white outline-none appearance-none font-medium"
                                    value={pdfConfig.optionInput}
                                    onChange={(e) => setPdfConfig(p => ({ ...p, optionInput: e.target.value }))}
                                >
                                    <option value={NUMBER}>Number (1, 2, 3)</option>
                                    <option value={TEXT}>Text (A, B, C)</option>
                                    <option value={ROMAN}>Roman (i, ii, iii)</option>
                                    <option value={CIRCLE}>Circle (○)</option>
                                </select>
                                <FaChevronDown className="absolute right-3 top-3.5 text-gray-400 pointer-events-none text-[10px]" />
                            </div>
                        </div>
                    </div>

                    {/* Column 2: Date & Duration */}
                    <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="flex flex-col gap-1.5">
                                <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider ml-1">Duration (Min)</label>
                                <input
                                    type="number"
                                    className="h-10 px-4 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:bg-white outline-none transition-all font-medium"
                                    value={pdfConfig.duration}
                                    onChange={(e) => setPdfConfig(p => ({ ...p, duration: e.target.value }))}
                                />
                            </div>
                            <div className="flex flex-col gap-1.5">
                                <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider ml-1">Exam Date</label>
                                <input
                                    type="date"
                                    className="h-10 px-4 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:bg-white outline-none transition-all font-medium"
                                    value={pdfConfig.examDate}
                                    onChange={(e) => setPdfConfig(p => ({ ...p, examDate: e.target.value }))}
                                />
                            </div>
                        </div>
                        <div className="flex flex-col gap-1.5">
                            <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider ml-1">View Layout</label>
                            <div className="flex items-center gap-6 h-10 px-4 bg-gray-50 border border-gray-200 rounded-lg">
                                <label className="flex items-center gap-2 cursor-pointer group">
                                    <input type="radio" name="vtype" checked={pdfConfig.isListView} onChange={() => setPdfConfig(p => ({ ...p, isListView: true }))} className="w-4 h-4 text-blue-600 focus:ring-blue-500" />
                                    <span className="text-sm font-semibold text-gray-600 group-hover:text-blue-600">List View</span>
                                </label>
                                <label className="flex items-center gap-2 cursor-pointer group">
                                    <input type="radio" name="vtype" checked={!pdfConfig.isListView} onChange={() => setPdfConfig(p => ({ ...p, isListView: false }))} className="w-4 h-4 text-blue-600 focus:ring-blue-500" />
                                    <span className="text-sm font-semibold text-gray-600 group-hover:text-blue-600">Split View</span>
                                </label>
                            </div>
                        </div>
                    </div>

                    {/* Column 3: Toggles */}
                    <div className="space-y-4 pt-1">
                        <ToggleButtonUi
                            title="Show Correct Answer"
                            onClick={() => setPdfConfig(p => ({ ...p, isShowCorrectAns: !p.isShowCorrectAns }))}
                            status={pdfConfig.isShowCorrectAns}
                        />
                        <ToggleButtonUi
                            title="Negative Marking"
                            onClick={() => setPdfConfig(p => ({ ...p, isNegativeMarking: !p.isNegativeMarking }))}
                            status={pdfConfig.isNegativeMarking}
                        />
                        {pdfConfig.isNegativeMarking && (
                            <div className="animate-in fade-in duration-300">
                                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider ml-1">Negative Value</label>
                                <input
                                    type="number"
                                    step="0.25"
                                    className="h-8 px-3 w-full bg-red-50 border border-red-100 rounded-lg text-sm focus:border-red-500 outline-none transition-all font-bold text-red-600"
                                    value={pdfConfig.negativeMarks}
                                    onChange={(e) => setPdfConfig(p => ({ ...p, negativeMarks: e.target.value }))}
                                />
                            </div>
                        )}
                    </div>
                </div>

                <div className="bg-blue-600/5 px-6 py-3 border-t border-gray-100 flex flex-wrap gap-6 text-[11px] font-black text-gray-500 tracking-widest uppercase">
                    <span className="flex items-center gap-2"><div className="size-1.5 bg-blue-600 rounded-full" /> Total Questions: {questions.length}</span>
                    <span className="flex items-center gap-2"><div className="size-1.5 bg-indigo-600 rounded-full" /> Total Marks: {questions.length}</span>
                    <span className="flex items-center gap-2 text-blue-600"><div className="size-1.5 bg-blue-600 rounded-full animate-pulse" /> Live Preview</span>
                </div>
            </div>

            {/* Simple Document Preview */}
            <div className="max-w-5xl mx-auto bg-white shadow-2xl border border-gray-200 min-h-[1100px] mb-20">
                <div ref={printContainerRef} className="p-16 text-black">
                    <div className="text-center mb-10 pb-6 border-b border-gray-200">
                        <h2 className="text-2xl font-bold text-gray-900 mb-3 tracking-tight">{pdfConfig.title}</h2>
                        <div className="flex justify-center gap-12 text-[13px] font-semibold text-gray-500 uppercase tracking-wider">
                            <span>Time: {pdfConfig.duration}m</span>
                            <span>Max Marks: {questions.length}</span>
                            <span>Questions: {questions.length}</span>
                        </div>
                    </div>

                    <div className={`${!pdfConfig.isListView ? 'columns-2 gap-12' : 'space-y-8'}`}>
                        {questions.map((q, idx) => (
                            <QuestionUi key={idx} idx={idx} q={q} pdfConfig={pdfConfig} />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

function QuestionUi({ idx, q, pdfConfig }) {
    return (
        <div className="break-inside-avoid mb-8">
            <div className="flex gap-4">
                <span className="font-bold text-gray-900 min-w-[28px]">{idx + 1}.</span>
                <div className="flex-1 space-y-4">
                    <div
                        className="font-bold text-gray-800 leading-relaxed"
                        dangerouslySetInnerHTML={{ __html: q?.q || q?.mqs_question || '-' }}
                    />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2 mt-4">
                        {[
                            { key: 'A', val: q?.q_a || q?.mqs_opt_one },
                            { key: 'B', val: q?.q_b || q?.mqs_opt_two },
                            { key: 'C', val: q?.q_c || q?.mqs_opt_three },
                            { key: 'D', val: q?.q_d || q?.mqs_opt_four },
                            { key: 'E', val: q?.q_e || q?.mqs_opt_five },
                        ].filter(o => o.val).map((opt, i) => (
                            <QuestionOption
                                key={opt.key}
                                idx={i}
                                option={opt.key}
                                html={opt.val}
                                pdfConfig={pdfConfig}
                                isCorrect={pdfConfig.isShowCorrectAns && (q?.q_ans?.toLowerCase() === opt.key.toLowerCase() || q?.mqs_ans?.toLowerCase() === opt.key.toLowerCase())}
                            />
                        ))}
                    </div>
                    {pdfConfig.isShowCorrectAns && (
                        <div className="text-sm font-bold text-blue-600 mt-2">
                            Ans : {(() => {
                                const ans = (q?.q_ans || q?.mqs_ans || '').toUpperCase();
                                const index = ans.charCodeAt(0) - 65;
                                if (index < 0 || index > 4) return ans;
                                
                                switch (pdfConfig.optionInput) {
                                    case NUMBER: return index + 1;
                                    case CIRCLE: return index + 1;
                                    case ROMAN: return ['i', 'ii', 'iii', 'iv', 'v'][index];
                                    default: return ans;
                                }
                            })()}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

function QuestionOption({ option, html, pdfConfig, idx, isCorrect }) {
    const getOptionLabel = () => {
        switch (pdfConfig.optionInput) {
            case NUMBER: return (idx + 1).toString();
            case TEXT: return String.fromCharCode(65 + idx);
            case ROMAN: return ['i', 'ii', 'iii', 'iv', 'v'][idx] || idx + 1;
            case CIRCLE: return '';
            default: return option;
        }
    };

    return (
        <div className={`flex items-start gap-2.5 p-1 rounded-lg ${isCorrect ? 'bg-green-50' : ''}`}>
            <span className={`h-5 w-5 flex flex-shrink-0 items-center justify-center border rounded-full text-[10px] font-black ${isCorrect ? 'border-green-600 bg-green-600 text-white' : 'border-gray-800 text-gray-800'}`}>
                {getOptionLabel()}
            </span>
            <div
                className={`text-[13px] leading-tight pt-0.5 ${isCorrect ? 'text-green-800 font-bold' : 'text-gray-700 font-medium'}`}
                dangerouslySetInnerHTML={{ __html: html }}
            />
        </div>
    );
}

function ToggleButtonUi({ title, onClick, status }) {
    return (
        <div className="flex items-center justify-between group cursor-pointer h-10 px-4 bg-gray-50 border border-gray-200 rounded-lg hover:bg-white transition-all" onClick={onClick}>
            <span className="text-xs font-bold text-gray-500 uppercase tracking-tight">{title}</span>
            <div className={`w-8 h-4 flex items-center rounded-full px-1 transition-all ${status ? 'bg-blue-600' : 'bg-gray-300'}`}>
                <div className={`size-2.5 bg-white rounded-full shadow transition-transform ${status ? 'translate-x-3.5' : 'translate-x-0'}`} />
            </div>
        </div>
    );
}

export default PDFGenerator;
