import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import './App.css';
import Dashboard from './components/Dashboard/Dashboard.jsx';
import PublishedTestQuestionsView from './components/PublishedTestsList/PublishedTestQuestionsView.jsx';
import PublishedTestsList from './components/PublishedTestsList/PublishedTestsList.jsx';
import QuestionsList from './components/QuestionsList/QuestionsList.jsx';
import QuestionsListAutoTest from './components/QuestionsListAutoTest/QuestionsListAutoTest.jsx';
import GenerateRports from './components/Reports/GenerateRports/GenerateRports.jsx';
import RootComponent from './components/RootComponent/RootComponent';
import AddNewStudent from './components/StudentArea/AddNewStudent/AddNewStudent.jsx';
import StudentsList from './components/StudentArea/StudentsList/StudentsList.jsx';
import StudentsListByCenter from './components/StudentArea/StudentsListByCenter/StudentsListByCenter.jsx';
import TestQuestionsView from './components/TestsList/TestQuestionsView.jsx';
import TestsList from './components/TestsList/TestsList.jsx';
import ViewReports from './components/Reports/GenerateRports/ViewReports.jsx';
import StudentExamReportSingle from './components/Reports/GenerateRports/StudentExamReportSingle.jsx';
import MockTestHome from './components/MockTest/MockTestHome.jsx';
import CreateMockForm from './components/MockTest/CreateMockForm.jsx';
import MockTestsList from './components/MockTestsList/MockTestsList.jsx';
import MockTestReport from './components/MockTestsList/MockTestReport.jsx';

const router = createBrowserRouter([
    {
        path: '/',
        element: <RootComponent />,
        children: [
            { path: '/dashboard', element: <Dashboard /> },

            // test area
            { path: '/tests-list', element: <TestsList /> },
            { path: '/published-test', element: <PublishedTestsList /> },
            { path: '/create-test/manual', element: <QuestionsList /> },
            { path: '/create-test/auto', element: <QuestionsListAutoTest /> },
            { path: '/view-test-questions', element: <TestQuestionsView /> },
            {
                path: '/view-published-test-questions',
                element: <PublishedTestQuestionsView />,
            },
            {
                path: '/mock-test',
                element: <MockTestHome />,
            },

            {
                path: '/mock-list',
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
            { path: '/add-new-student', element: <AddNewStudent /> },
            { path: '/students-list', element: <StudentsList /> },
            { path: '/students-list-by-center', element: <StudentsListByCenter /> },

            // reports
            { path: '/gen-reports', element: <GenerateRports /> },
            { path: '/view-reports', element: <ViewReports /> },
            { path: '/single-student-report', element: <StudentExamReportSingle /> },
        ],
    },
]);

function App() {
    return (
        <>
            <RouterProvider router={router} />
        </>
    );
}

export default App;
