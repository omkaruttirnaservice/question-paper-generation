import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import {
    MdQuiz,
    MdAddCircleOutline,
    MdCloudDone,
    MdGroups,
    MdModelTraining,
    MdBarChart,
    MdFormatListBulleted,
    MdPersonAddAlt1,
    MdArrowForward,
    MdAutoGraph,
    MdDashboard,
    MdTrendingUp,
} from 'react-icons/md';
import { FaGraduationCap, FaFileAlt } from 'react-icons/fa';
import './Dashboard.css';

/* ── Quick Action Cards ── */
const quickActions = [
    {
        title: 'Create Test',
        description: 'Build a new question paper from scratch',
        icon: <MdAddCircleOutline />,
        url: '/tests/create/form',
        gradient: 'from-blue-500 to-indigo-600',
        bg: '#EEF2FF',
        iconColor: '#4F46E5',
        tag: 'Test Area',
    },
    {
        title: 'All Tests',
        description: 'Browse and manage all created tests',
        icon: <MdFormatListBulleted />,
        url: '/tests/list',
        gradient: 'from-violet-500 to-purple-600',
        bg: '#F5F3FF',
        iconColor: '#7C3AED',
        tag: 'Test Area',
    },
    {
        title: 'Published Tests',
        description: 'View and manage all published exams',
        icon: <MdCloudDone />,
        url: '/tests/published',
        gradient: 'from-emerald-500 to-teal-600',
        bg: '#ECFDF5',
        iconColor: '#059669',
        tag: 'Test Area',
    },
    {
        title: 'Mock Test',
        description: 'Create a practice mock test series',
        icon: <MdModelTraining />,
        url: '/mock/create',
        gradient: 'from-orange-500 to-amber-500',
        bg: '#FFF7ED',
        iconColor: '#D97706',
        tag: 'Mock Area',
    },
    {
        title: 'Add Student',
        description: 'Register a new student in the system',
        icon: <MdPersonAddAlt1 />,
        url: '/students/add',
        gradient: 'from-pink-500 to-rose-500',
        bg: '#FFF1F2',
        iconColor: '#E11D48',
        tag: 'Student Area',
    },
    {
        title: 'Students List',
        description: 'Browse all registered students',
        icon: <MdGroups />,
        url: '/students/list',
        gradient: 'from-cyan-500 to-sky-600',
        bg: '#F0F9FF',
        iconColor: '#0284C7',
        tag: 'Student Area',
    },
    {
        title: 'Generate Reports',
        description: 'Create detailed performance reports',
        icon: <MdAutoGraph />,
        url: '/reports/generate',
        gradient: 'from-lime-500 to-green-600',
        bg: '#F7FEE7',
        iconColor: '#16A34A',
        tag: 'Reports',
    },
    {
        title: 'View Results',
        description: 'Check exam results and analytics',
        icon: <MdBarChart />,
        url: '/reports/list',
        gradient: 'from-fuchsia-500 to-pink-600',
        bg: '#FDF4FF',
        iconColor: '#A21CAF',
        tag: 'Reports',
    },
];

/* ── Stat Cards ── */
const statCards = [
    {
        label: 'Total Tests',
        value: '—',
        icon: <MdQuiz />,
        gradient: 'linear-gradient(135deg, #4F46E5, #7C3AED)',
        shadow: 'rgba(79,70,229,0.3)',
    },
    {
        label: 'Published',
        value: '—',
        icon: <MdCloudDone />,
        gradient: 'linear-gradient(135deg, #059669, #0D9488)',
        shadow: 'rgba(5,150,105,0.3)',
    },
    {
        label: 'Students',
        value: '—',
        icon: <FaGraduationCap />,
        gradient: 'linear-gradient(135deg, #0284C7, #0891B2)',
        shadow: 'rgba(2,132,199,0.3)',
    },
    {
        label: 'Mock Tests',
        value: '—',
        icon: <FaFileAlt />,
        gradient: 'linear-gradient(135deg, #D97706, #EA580C)',
        shadow: 'rgba(217,119,6,0.3)',
    },
];

function Dashboard() {
    const navigate = useNavigate();
    const auth = useSelector((state) => state.auth);

    const greeting = () => {
        const h = new Date().getHours();
        if (h < 12) return 'Good Morning';
        if (h < 17) return 'Good Afternoon';
        return 'Good Evening';
    };

    return (
        <div className="dashboard-root">

            {/* ── Hero Banner ── */}
            <div className="dashboard-hero">
                <div className="hero-bg-orb orb-1" />
                <div className="hero-bg-orb orb-2" />
                <div className="hero-content">
                    <div className="hero-icon-wrap">
                        <MdDashboard className="hero-icon" />
                    </div>
                    <div>
                        <p className="hero-greeting">{greeting()}, {auth?.username || 'Admin'} 👋</p>
                        <h1 className="hero-title">Question Paper Generation</h1>
                        <p className="hero-subtitle">
                            Manage your tests, publish exams, track students — all in one place.
                        </p>
                    </div>
                </div>
                <div className="hero-stat-row">
                    {statCards.map((s, i) => (
                        <div className="hero-stat-card" key={i} style={{ '--shadow': s.shadow }}>
                            <div className="hero-stat-icon" style={{ background: s.gradient, boxShadow: `0 8px 20px -4px ${s.shadow}` }}>
                                {s.icon}
                            </div>
                            <div>
                                <div className="hero-stat-value">{s.value}</div>
                                <div className="hero-stat-label">{s.label}</div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* ── Quick Actions Heading ── */}
            <div className="section-header">
                <div className="section-header-left">
                    <MdTrendingUp className="text-indigo-500 text-xl" />
                    <h2 className="section-title">Quick Actions</h2>
                </div>
                <span className="section-badge">{quickActions.length} shortcuts</span>
            </div>

            {/* ── Action Cards Grid ── */}
            <div className="action-grid">
                {quickActions.map((action, i) => (
                    <button
                        key={i}
                        className="action-card"
                        onClick={() => navigate(action.url)}
                        style={{ '--card-bg': action.bg, '--icon-color': action.iconColor }}
                    >
                        <div className="action-card-top">
                            <div className="action-icon-wrap" style={{ background: action.bg }}>
                                <span className="action-icon" style={{ color: action.iconColor }}>
                                    {action.icon}
                                </span>
                            </div>
                            <span className="action-tag"
                                style={{ background: action.bg, color: action.iconColor }}>
                                {action.tag}
                            </span>
                        </div>

                        <div className="action-card-body">
                            <h3 className="action-title">{action.title}</h3>
                            <p className="action-desc">{action.description}</p>
                        </div>

                        <div className="action-card-footer">
                            <span className="action-cta">Open</span>
                            <span className="action-arrow-wrap"
                                style={{ background: `linear-gradient(135deg, ${action.iconColor}22, ${action.iconColor}44)`, color: action.iconColor }}>
                                <MdArrowForward className="action-arrow" />
                            </span>
                        </div>

                        {/* Hover gradient bar */}
                        <div className={`action-bar bg-gradient-to-r ${action.gradient}`} />
                    </button>
                ))}
            </div>
        </div>
    );
}

export default Dashboard;
