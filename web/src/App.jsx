import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import './App.css';
import QuestionsList from './components/QuestionsList/QuestionsList.jsx';
import RootComponent from './components/RootComponent/RootComponent';
import Dashboard from './components/Dashboard/Dashboard.jsx';

const router = createBrowserRouter([
	{
		path: '/',
		element: <RootComponent />,
		children: [
			{ path: '/questions-list', element: <QuestionsList /> },
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
