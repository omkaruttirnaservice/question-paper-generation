import { Navigate, Outlet } from 'react-router-dom';
import MenuBar from '../MenuBar/MenuBar';
import { ToastContainer } from 'react-toastify';
import { useState } from 'react';
import { RxHamburgerMenu } from 'react-icons/rx';
import { MdDashboard } from 'react-icons/md';
import { useSelector } from 'react-redux';
import 'react-toastify/dist/ReactToastify.css';

function RootComponent() {
    const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

    return (
        <>
            <ToastContainer autoClose={2000} />
            <div className="flex h-screen bg-slate-50 overflow-hidden">

                {/* ── Sidebar ── */}
                <aside
                    className={`
                        transition-all duration-500 ease-in-out
                        ${isSidebarOpen ? 'w-[16.5rem]' : 'w-[5rem]'}
                        h-screen flex-shrink-0
                        bg-gradient-to-br from-cyan-600 via-cyan-500 to-teal-500
                        shadow-2xl relative z-50 flex flex-col
                    `}
                >
                    {/* ── Sidebar Header ── */}
                    <div
                        className={`
                            flex items-center p-4 flex-shrink-0
                            border-b border-white/10
                            ${isSidebarOpen ? 'justify-between' : 'justify-center'}
                        `}
                    >
                        {isSidebarOpen && (
                            <div className="flex items-center gap-3 min-w-0">
                                <div className="bg-white/20 p-2 rounded-xl backdrop-blur-md flex-shrink-0">
                                    <MdDashboard className="text-white text-lg" />
                                </div>
                                <div className="flex flex-col min-w-0">
                                    <span className="text-white font-black text-base leading-none tracking-tight truncate">
                                        Question Paper
                                    </span>
                                    <span className="text-[10px] text-white/55 font-bold uppercase tracking-widest mt-1">
                                        Generation
                                    </span>
                                </div>
                            </div>
                        )}

                        {!isSidebarOpen && (
                            <div className="bg-white/20 p-2 rounded-xl backdrop-blur-md">
                                <MdDashboard className="text-white text-lg" />
                            </div>
                        )}

                        <button
                            onClick={toggleSidebar}
                            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-all transform hover:scale-110 active:scale-95 flex-shrink-0 ml-auto"
                            title={isSidebarOpen ? 'Collapse Sidebar' : 'Expand Sidebar'}
                        >
                            <RxHamburgerMenu className="text-xl" />
                        </button>
                    </div>

                    {/* ── MenuBar (fills remaining height) ── */}
                    <div className="flex-1 min-h-0">
                        <MenuBar isSidebarOpen={isSidebarOpen} />
                    </div>
                </aside>

                {/* ── Main Content ── */}
                <main className="flex-1 h-screen overflow-y-auto bg-gray-50/50">
                    <Outlet />
                </main>
            </div>
        </>
    );
}

export default RootComponent;
