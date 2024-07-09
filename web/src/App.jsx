import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import './App.css';
import QuestionsList from './components/QuestionsList/QuestionsList.jsx';
import RootComponent from './components/RootComponent/RootComponent';
import Dashboard from './components/Dashboard/Dashboard.jsx';
import QuestionsListAutoTest from './components/QuestionsListAutoTest/QuestionsListAutoTest.jsx';

const router = createBrowserRouter([
	{
		path: '/',
		element: <RootComponent />,
		children: [
			{ path: '/create-test/manual', element: <QuestionsList /> },
			{ path: '/create-test/auto', element: <QuestionsListAutoTest /> },
			{ path: '/dashboard', element: <Dashboard /> },
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
