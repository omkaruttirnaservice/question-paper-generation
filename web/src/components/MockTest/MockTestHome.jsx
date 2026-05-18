import { Link } from 'react-router-dom';
import { MdModelTraining, MdAddCircleOutline } from 'react-icons/md';
import '../PublishedTestsList/PublishedTestsList.css';

function MockTestHome() {
    return (
        <div className="ptl-root">
            <div className="ptl-header-bar">
                <div className="ptl-header-content">
                    <MdModelTraining />
                    <span>MOCK HANDLER</span>
                </div>
            </div>

            <div className="ptl-content-container flex justify-center items-center py-20">
                <div className="bg-white p-12 rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-slate-100 flex flex-col items-center gap-6 max-w-md w-full text-center">
                    <div className="w-20 h-20 bg-cyan-50 rounded-full flex items-center justify-center text-cyan-500 shadow-inner">
                        <MdModelTraining size={40} />
                    </div>
                    <div>
                        <h2 className="text-2xl font-black text-slate-800 tracking-tight">Setup New Mock</h2>
                        <p className="text-slate-400 font-medium text-sm mt-2">Initialize a new mock examination for your students with custom configurations.</p>
                    </div>
                    <Link to={'/mock-test/create'} className="w-full">
                        <button className="w-full bg-gradient-to-r from-cyan-500 to-cyan-600 text-white py-4 rounded-2xl font-black shadow-lg shadow-cyan-200 hover:shadow-cyan-300 hover:-translate-y-1 transition-all flex items-center justify-center gap-2">
                            <MdAddCircleOutline size={20} />
                            CREATE MOCK EXAM
                        </button>
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default MockTestHome;
