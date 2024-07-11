import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import './App.css';
import Dashboard from './components/Dashboard/Dashboard.jsx';
import QuestionsList from './components/QuestionsList/QuestionsList.jsx';
import QuestionsListAutoTest from './components/QuestionsListAutoTest/QuestionsListAutoTest.jsx';
import RootComponent from './components/RootComponent/RootComponent';
import TestsList from './components/TestsList/TestsList.jsx';

const router = createBrowserRouter([
	{
		path: '/',
		element: <RootComponent />,
		children: [
			{ path: '/dashboard', element: <Dashboard /> },
			{ path: '/tests-list', element: <TestsList /> },
			{ path: '/create-test/manual', element: <QuestionsList /> },
			{ path: '/create-test/auto', element: <QuestionsListAutoTest /> },
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
