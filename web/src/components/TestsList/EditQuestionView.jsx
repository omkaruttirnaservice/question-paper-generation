import EditAddQuestionForm from '../QuestionForm/EditQuestionForm.jsx';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';

function EditQuestionView() {
    const navigate = useNavigate();
    
    return (
        <div className="bg-white rounded-[2rem] p-6 shadow-xl border border-slate-100 min-h-full animate-in fade-in duration-500">
            <div className="flex justify-between items-center mb-8 pb-6 border-b border-slate-100">
                <div className="flex items-center gap-4">
                    <button 
                        onClick={() => navigate(-1)}
                        className="p-3 rounded-2xl bg-slate-50 hover:bg-slate-100 text-slate-500 transition-all border border-slate-200 flex items-center justify-center shadow-sm"
                        title="Go Back"
                    >
                        <FaArrowLeft />
                    </button>
                    <div>
                        <h1 className="text-2xl font-black text-slate-800 tracking-tight">Edit Question</h1>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Question Management</p>
                    </div>
                </div>
            </div>
            
            <div className="max-w-[1400px] mx-auto">
                <EditAddQuestionForm />
            </div>
        </div>
    );
}

export default EditQuestionView;
