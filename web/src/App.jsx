import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import './App.css';
import Dashboard from './components/Dashboard/Dashboard.jsx';
import QuestionsList from './components/QuestionsList/QuestionsList.jsx';
import QuestionsListAutoTest from './components/QuestionsListAutoTest/QuestionsListAutoTest.jsx';
import RootComponent from './components/RootComponent/RootComponent';
import TestsList from './components/TestsList/TestsList.jsx';
import PublishedTestsList from './components/PublishedTestsList/PublishedTestsList.jsx';
import TestQuestionsView from './components/TestsList/TestQuestionsView.jsx';
import PublishedTestQuestionsView from './components/PublishedTestsList/PublishedTestQuestionsView.jsx';
import AddNewStudent from './components/StudentArea/AddNewStudent/AddNewStudent.jsx';
import StudentsList from './components/StudentArea/StudentsList/StudentsList.jsx';

const router = createBrowserRouter([
	{
		path: '/',
		element: <RootComponent />,
		children: [
			{ path: '/dashboard', element: <Dashboard /> },
			{ path: '/tests-list', element: <TestsList /> },
			{ path: '/published-test', element: <PublishedTestsList /> },
			{ path: '/create-test/manual', element: <QuestionsList /> },
			{ path: '/create-test/auto', element: <QuestionsListAutoTest /> },
			{ path: '/view-test-questions', element: <TestQuestionsView /> },
			{
				path: '/view-published-test-questions',
				element: <PublishedTestQuestionsView />,
			},

			{ path: '/add-new-student', element: <AddNewStudent /> },
			{ path: '/students-list', element: <StudentsList /> },
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
