import { createBrowserRouter } from 'react-router-dom';
import CreateTestForm from './components/CreateTestForm.jsx';
import Dashboard from './components/Dashboard/Dashboard.jsx';
import LoginPage from './components/Login/Login.jsx';
import Logout from './components/Logout/Logout.jsx';
import CreateMockForm from './components/MockTest/CreateMockForm.jsx';
import MockTestHome from './components/MockTest/MockTestHome.jsx';
import MockTestReport from './components/MockTestsList/MockTestReport.jsx';
import MockTestsList from './components/MockTestsList/MockTestsList.jsx';
import PublishedTestsList from './components/PublishedTestsList/PublishedTestsList.jsx';
import QuestionsList from './components/QuestionsList/QuestionsList.jsx';
import QuestionsListAutoTest from './components/QuestionsListAutoTest/QuestionsListAutoTest.jsx';
import GenerateRports from './components/Reports/GenerateRports/GenerateRports.jsx';
import PDFGenerator from './components/Reports/GenerateRports/PDFGenerator.jsx';
import ReportsLayout from './components/Reports/GenerateRports/ReportsLayout.jsx';
import StudentExamReportSingle from './components/Reports/GenerateRports/StudentExamReportSingle.jsx';
import ViewReports from './components/Reports/GenerateRports/ViewReports.jsx';
import ActivityLogReports from './components/Reports/GenerateRports/ActivityLogReports.jsx';
import RootComponent from './components/RootComponent/RootComponent.jsx';
import AddNewStudent from './components/StudentArea/AddNewStudent/AddNewStudent.jsx';
import StudentsList from './components/StudentArea/StudentsList/StudentsList.jsx';
import TestQuestionsView from './components/TestsList/TestQuestionsView.jsx';
import EditQuestionView from './components/TestsList/EditQuestionView.jsx';
import TestsList from './components/TestsList/TestsList.jsx';
import { ToastContainer } from 'react-toastify';

export const _router = createBrowserRouter([
    {
        path: '/',
        element: <RootComponent />,
        children: [
            { path: '/dashboard', element: <Dashboard /> },

            // test area
            { path: '/tests/list', element: <TestsList /> },
            { path: '/tests/published', element: <PublishedTestsList /> },
            { path: '/tests/list/questions', element: <TestQuestionsView /> },
            { path: '/tests/questions/edit', element: <EditQuestionView /> },

            // create test
            {
                path: '/tests/create',
                children: [
                    { path: 'form', element: <CreateTestForm /> },
                    { path: 'manual', element: <QuestionsList /> },
                    { path: 'auto', element: <QuestionsListAutoTest /> },
                ],
            },

            {
                path: '/tests/published/questions',
                element: <TestQuestionsView />,
            },
            {
                path: '/mock/create',
                element: <MockTestHome />,
            },

            {
                path: '/mock/list',
                element: <MockTestsList />,
            },

            {
                path: '/mock-report',
                element: <MockTestReport />,
            },

            {
                path: '/mock-test/create',
                element: <CreateMockForm />,
            },

            // student area
            { path: '/students/add', element: <AddNewStudent /> },
            { path: '/students/list', element: <StudentsList /> },
            // { path: '/students-list-by-center', element: <StudentsListByCenter /> },

            // reports
            { path: '/reports/generate', element: <GenerateRports /> },
            { path: '/reports/activity-log', element: <ActivityLogReports /> },
            {
                path: '/reports',
                element: <ReportsLayout />,
                children: [
                    { path: 'list', element: <ViewReports /> },
                    { path: 'single', element: <StudentExamReportSingle /> },
                ],
            },
        ],
    },
    {
        path: '/login',
        element: (
            <>
                <ToastContainer autoClose={2000} />
                <LoginPage />
            </>
        ),
    },
    {
        path: '/logout',
        element: <Logout />,
    },

    { path: '/qp-pdf/:roll/:ptid', element: <PDFGenerator /> },
]);
