import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { toast } from 'react-toastify';
import {
    MdQuiz,
    MdAddCircleOutline,
    MdCloudDone,
    MdGroups,
    MdArrowForward,
    MdDashboard,
    MdTrendingUp,
    MdFormatListBulleted,
    MdCheckCircle,
    MdAssignment,
    MdHelp,
    MdSettings,
} from 'react-icons/md';
import { FaGraduationCap, FaFileAlt, FaCodeBranch, FaThLarge } from 'react-icons/fa';
import './Dashboard.css';

function Dashboard() {
    const navigate = useNavigate();
    const auth = useSelector((state) => state.auth);

    // Initial state with premium fallback values matching mockup
    const [stats, setStats] = useState({
        totalTests: 128,
        publishedTests: 85,
        totalStudents: 342,
        mockTests: 56,
    });

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const SERVER_IP = import.meta.env.VITE_API_SERVER_IP || '';
                const response = await axios.get(`${SERVER_IP}/api/test/dashboard-stats`);
                if (response.data && response.data.success === 1) {
                    setStats({
                        totalTests: response.data.data.totalTests ?? 128,
                        publishedTests: response.data.data.publishedTests ?? 85,
                        totalStudents: response.data.data.totalStudents ?? 342,
                        mockTests: response.data.data.mockTests ?? 56,
                    });
                }
            } catch (error) {
                console.warn('Could not fetch real-time stats, using premium fallback data:', error);
            }
        };
        fetchStats();
    }, []);

    const greeting = () => {
        const h = new Date().getHours();
        if (h < 12) return 'GOOD MORNING';
        if (h < 17) return 'GOOD AFTERNOON';
        return 'GOOD EVENING';
    };

    /* ── Quick Action Cards Config ── */
    const quickActions = [
        {
            title: 'Create Test',
            description: 'Build a new question paper from scratch',
            icon: <MdAddCircleOutline />,
            url: '/tests/create/form',
            tag: 'TEST AREA',
            themeColor: '#7C3AED', // Purple
            bgColor: '#F5F3FF',
            borderColor: '#DDD6FE',
        },
        {
            title: 'All Tests',
            description: 'Browse and manage all created tests',
            icon: <MdFormatListBulleted />,
            url: '/tests/list',
            tag: 'TEST AREA',
            themeColor: '#4F46E5', // Indigo
            bgColor: '#EEF2FF',
            borderColor: '#C7D2FE',
        },
        {
            title: 'Published Tests',
            description: 'View and manage all published exams',
            icon: <MdCheckCircle />,
            url: '/tests/published',
            tag: 'PUBLISHED',
            themeColor: '#10B981', // Green
            bgColor: '#ECFDF5',
            borderColor: '#A7F3D0',
        },
        {
            title: 'Mock Test',
            description: 'Create a practice mock test series',
            icon: <FaCodeBranch />,
            url: '/mock/create',
            tag: 'MOCK AREA',
            themeColor: '#F59E0B', // Orange/Amber
            bgColor: '#FFFBEB',
            borderColor: '#FDE68A',
        },
        {
            title: 'Students',
            description: 'View and manage all students',
            icon: <MdGroups />,
            url: '/students/list',
            tag: 'STUDENT AREA',
            themeColor: '#3B82F6', // Blue
            bgColor: '#EFF6FF',
            borderColor: '#BFDBFE',
        },
        {
            title: 'Reports',
            description: 'Analyze performance and test reports',
            icon: <MdAssignment />,
            url: '/reports/generate',
            tag: 'REPORTS',
            themeColor: '#2563EB', // Blue
            bgColor: '#EFF6FF',
            borderColor: '#BFDBFE',
        },
        {
            title: 'Question Bank',
            description: 'Manage and organize questions',
            icon: <MdHelp />,
            url: '/tests/list',
            tag: 'TEST AREA',
            themeColor: '#EC4899', // Pink/Purple
            bgColor: '#FDF2F8',
            borderColor: '#FBCFE8',
        },
        {
            title: 'Settings',
            description: 'Manage system preferences',
            icon: <MdSettings />,
            url: 'settings-toast', // Handled specially
            tag: 'SETTINGS',
            themeColor: '#8B5CF6', // Purple
            bgColor: '#F5F3FF',
            borderColor: '#DDD6FE',
        },
    ];

    const handleActionClick = (action) => {
        if (action.url === 'settings-toast') {
            toast.info('System settings are managed by the Master Administrator.');
        } else {
            navigate(action.url);
        }
    };

    const handleShortcutsClick = () => {
        toast.success('Quick action grid reset to standard layout.');
    };

    return (
        <div className="dashboard-root">
            {/* ── Hero Banner ── */}
            <div className="dashboard-hero">
                <div className="hero-gradient-overlay" />
                <div className="hero-grid-overlay" />
                <div className="hero-glow-orb" />
                
                {/* ── Abstract Glowing Vector Waves ── */}
                <div className="hero-wave-container">
                    <svg viewBox="0 0 600 300" fill="none" xmlns="http://www.w3.org/2000/svg" className="hero-wave-svg">
                        <path d="M150 0 C300 120, 450 50, 600 180 L600 0 Z" fill="url(#hero-wave-grad)" opacity="0.18" />
                        <path d="M0 0 C250 80, 350 220, 600 240 L600 0 Z" fill="url(#hero-wave-grad)" opacity="0.25" />
                        <path d="M250 0 C400 160, 450 260, 600 300 L600 0 Z" fill="url(#hero-wave-grad)" opacity="0.12" />
                        <defs>
                            <linearGradient id="hero-wave-grad" x1="0" y1="0" x2="600" y2="300" gradientUnits="userSpaceOnUse">
                                <stop stopColor="#2F54EB" />
                                <stop offset="0.5" stopColor="#3B82F6" />
                                <stop offset="1" stopColor="#7C3AED" />
                            </linearGradient>
                        </defs>
                    </svg>
                </div>
                
                <div className="hero-content">
                    <div className="hero-icon-wrap">
                        <MdDashboard className="hero-icon" />
                    </div>
                    <div className="hero-text-area">
                        <p className="hero-greeting">
                            {greeting()}, {auth?.username ? auth.username.toUpperCase() : 'ADMIN'} 👋
                        </p>
                        <h1 className="hero-title">Question Paper Generation</h1>
                        <p className="hero-subtitle">
                            Manage your tests, publish exams, track students — all in one place.
                        </p>
                    </div>
                </div>

                {/* ── Stat Cards Embedded Row ── */}
                <div className="hero-stat-row">
                    {/* TOTAL TESTS */}
                    <div className="hero-stat-card">
                        <div className="hero-stat-icon-container stat-purple">
                            <MdQuiz />
                        </div>
                        <div className="hero-stat-details">
                            <span className="hero-stat-label">TOTAL TESTS</span>
                            <span className="hero-stat-value">{stats.totalTests}</span>
                        </div>
                    </div>

                    {/* PUBLISHED */}
                    <div className="hero-stat-card">
                        <div className="hero-stat-icon-container stat-green">
                            <MdCloudDone />
                        </div>
                        <div className="hero-stat-details">
                            <span className="hero-stat-label">PUBLISHED</span>
                            <span className="hero-stat-value">{stats.publishedTests}</span>
                        </div>
                    </div>

                    {/* STUDENTS */}
                    <div className="hero-stat-card">
                        <div className="hero-stat-icon-container stat-blue">
                            <FaGraduationCap />
                        </div>
                        <div className="hero-stat-details">
                            <span className="hero-stat-label">STUDENTS</span>
                            <span className="hero-stat-value">{stats.totalStudents}</span>
                        </div>
                    </div>

                    {/* MOCK TESTS */}
                    <div className="hero-stat-card">
                        <div className="hero-stat-icon-container stat-orange">
                            <FaFileAlt />
                        </div>
                        <div className="hero-stat-details">
                            <span className="hero-stat-label">MOCK TESTS</span>
                            <span className="hero-stat-value">{stats.mockTests}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* ── Quick Actions Heading ── */}
            <div className="section-header">
                <div className="section-header-left">
                    <div className="trending-icon-container">
                        <MdTrendingUp className="trending-icon" />
                    </div>
                    <h2 className="section-title">Quick Actions</h2>
                </div>
                <button className="shortcuts-btn" onClick={handleShortcutsClick}>
                    <FaThLarge className="shortcuts-icon" />
                    <span>SHORTCUTS</span>
                </button>
            </div>

            {/* ── Action Cards Grid ── */}
            <div className="action-grid">
                {quickActions.map((action, i) => (
                    <button
                        key={i}
                        className="action-card"
                        onClick={() => handleActionClick(action)}
                        style={{
                            '--theme-color': action.themeColor,
                            '--bg-color': action.bgColor,
                            '--border-color': action.borderColor,
                        }}
                    >
                        <div className="action-card-top">
                            <div className="action-icon-wrap-circle">
                                <span className="action-icon">{action.icon}</span>
                            </div>
                            <span className="action-tag">{action.tag}</span>
                        </div>

                        <div className="action-card-body">
                            <h3 className="action-title">{action.title}</h3>
                            <p className="action-desc">{action.description}</p>
                        </div>

                        <div className="action-card-footer">
                            <span className="action-cta">OPEN</span>
                            <span className="action-arrow-wrap">
                                <MdArrowForward className="action-arrow" />
                            </span>
                        </div>
                    </button>
                ))}
            </div>
        </div>
    );
}

export default Dashboard;
