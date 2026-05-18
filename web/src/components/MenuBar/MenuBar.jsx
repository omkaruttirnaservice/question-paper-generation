import { CgProfile } from 'react-icons/cg';
import { FaChevronRight, FaClock } from 'react-icons/fa';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { testsSliceActions } from '../../Store/tests-slice.jsx';
import { EditQuestionFormActions } from '../../Store/edit-question-form-slice.jsx';
import {
    MdLogout,
    MdDashboard,
    MdQuiz,
    MdAddCircleOutline,
    MdFormatListBulleted,
    MdCloudDone,
    MdModelTraining,
    MdGroups,
    MdPersonAddAlt1,
    MdFormatListNumbered,
    MdBarChart,
    MdAutoGraph,
    MdHistory,
    MdGrading
} from 'react-icons/md';
import { useEffect, useState } from 'react';
import './MenuBar.css';

const navigationConfig = [
    {
        title: 'Test Area',
        url: '/tests',
        key: 'testArea',
        icon: <MdQuiz />,
        childrens: [
            { childrenTitle: 'Create Test',          _url: '/tests/create/form', icon: <MdAddCircleOutline /> },
            { childrenTitle: 'Tests List',           _url: '/tests/list',        icon: <MdFormatListBulleted /> },
            { childrenTitle: 'Published Tests List', _url: '/tests/published',   icon: <MdCloudDone /> },
        ],
    },
    {
        title: 'Mock Area',
        url: '/mock',
        key: 'mockArea',
        icon: <MdModelTraining />,
        childrens: [
            { childrenTitle: 'Tests List', _url: '/mock/list',   icon: <MdFormatListBulleted /> },
            { childrenTitle: 'Mock Test',  _url: '/mock/create', icon: <MdAddCircleOutline /> },
        ],
    },
    {
        title: 'Student Area',
        url: '/students',
        key: 'studentArea',
        icon: <MdGroups />,
        childrens: [
            { childrenTitle: 'Add New Student', _url: '/students/add',  icon: <MdPersonAddAlt1 /> },
            { childrenTitle: 'Students List',   _url: '/students/list', icon: <MdFormatListNumbered /> },
        ],
    },
    {
        title: 'Reports',
        url: '/reports',
        key: 'reportsArea',
        icon: <MdBarChart />,
        childrens: [
            { childrenTitle: 'Gen Reports',          _url: '/reports/generate',     icon: <MdAutoGraph /> },
            { childrenTitle: 'Activity Log Reports', _url: '/reports/activity-log', icon: <MdHistory /> },
            { childrenTitle: 'View Result',          _url: '/reports/list',         icon: <MdGrading /> },
        ],
    },
];

function MenuBar({ isSidebarOpen }) {
    const auth = useSelector((state) => state.auth);
    const location = useLocation();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [openMenus, setOpenMenus] = useState({});

    useEffect(() => {
        const initialOpen = {};
        navigationConfig.forEach(item => {
            if (location.pathname.startsWith(item.url)) {
                initialOpen[item.key] = true;
            }
        });
        setOpenMenus(initialOpen);
    }, [location.pathname]);

    const toggleMenu = (key) => {
        setOpenMenus(prev => ({ ...prev, [key]: !prev[key] }));
    };

    return (
        <div className="menu-container">
            {/* ── Profile Card ── */}
            {isSidebarOpen && auth?.username ? (
                <div className="profile-card">
                    <div className="flex items-center gap-3">
                        <div className="bg-white/20 p-2 rounded-full backdrop-blur-md border border-white/30 flex-shrink-0">
                            <CgProfile className="w-5 h-5 text-white" />
                        </div>
                        <div className="flex flex-col min-w-0">
                            <span className="text-[9px] text-white/55 uppercase tracking-wider font-bold">Administrator</span>
                            <span className="text-sm text-white font-semibold truncate">{auth.username}</span>
                        </div>
                    </div>
                    <Clock />
                </div>
            ) : !isSidebarOpen ? (
                <div className="flex justify-center py-2 mb-1">
                    <div className="bg-white/15 p-2 rounded-full border border-white/20">
                        <CgProfile className="w-5 h-5 text-white/80" />
                    </div>
                </div>
            ) : null}

            {/* ── Scrollable Nav Area ── */}
            <div className="menu-scroll-area">
                {/* Dashboard */}
                <NavLink
                    to="/dashboard"
                    className={({ isActive }) => `menu-item-base ${isActive ? 'active' : ''}`}
                    title="Dashboard"
                >
                    <MdDashboard className="text-xl flex-shrink-0" />
                    {isSidebarOpen && <span>Dashboard</span>}
                </NavLink>

                {/* Nav groups */}
                <div className="mx-2 my-1 border-t border-white/10" />
                {navigationConfig.map((item) => (
                    <div key={item.key} className="submenu-parent">
                        <div
                            className={`menu-item-base submenu-trigger ${openMenus[item.key] ? 'bg-white/5' : ''}`}
                            onClick={() => toggleMenu(item.key)}
                            title={item.title}
                        >
                            <div className="flex items-center gap-3 min-w-0">
                                <span className="text-xl flex-shrink-0">{item.icon}</span>
                                {isSidebarOpen && (
                                    <span className="truncate">{item.title}</span>
                                )}
                            </div>
                            {isSidebarOpen && (
                                <FaChevronRight
                                    className={`text-[10px] flex-shrink-0 transition-transform duration-300 ${openMenus[item.key] ? 'rotate-90' : ''}`}
                                />
                            )}
                        </div>

                        {isSidebarOpen && (
                            <div className={`submenu-container ${openMenus[item.key] ? 'open' : ''}`}>
                                <div className="submenu-inner">
                                    {item.childrens.map((child, idx) => (
                                        <NavLink
                                            key={idx}
                                            to={child._url}
                                            className={({ isActive }) =>
                                                `menu-item-base submenu-item ${isActive ? 'active' : ''}`
                                            }
                                            onClick={() => {
                                                if (child.childrenTitle === 'Create Test') {
                                                    dispatch(testsSliceActions.resetTestDetails());
                                                    dispatch(EditQuestionFormActions.reset());
                                                    dispatch(testsSliceActions.setTestDetailsFilled(false));
                                                }
                                            }}
                                        >
                                            <span className="text-base opacity-75 flex-shrink-0">{child.icon}</span>
                                            <span className="truncate">{child.childrenTitle}</span>
                                        </NavLink>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {/* ── Logout ── */}
            <div className="logout-area">
                <button
                    onClick={() => navigate('/logout')}
                    className={`logout-btn w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-2xl text-white font-bold ${isSidebarOpen ? '' : 'px-2'}`}
                >
                    <MdLogout className="text-xl flex-shrink-0" />
                    {isSidebarOpen && <span>Logout</span>}
                </button>
            </div>
        </div>
    );
}

function Clock() {
    const [time, setTime] = useState('');
    const [date, setDate] = useState('');

    useEffect(() => {
        const updateClock = () => {
            const now = new Date();
            setDate(now.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }));
            setTime(now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true }));
        };
        updateClock();
        const interval = setInterval(updateClock, 1000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="clock-widget">
            <div className="clock-time flex items-center justify-center gap-1.5">
                <FaClock className="text-[9px] opacity-55" />
                {time}
            </div>
            <div className="clock-date">{date}</div>
        </div>
    );
}

export default MenuBar;
