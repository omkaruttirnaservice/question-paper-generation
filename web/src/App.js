import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import './App.css';
import AddQuestionForm from './components/QuestionForm/AddQuestionForm.js';
import EditQuestionForm from './components/QuestionForm/EditQuestionForm.js';
import QuestionsList from './components/QuestionsList/QuestionsList.js';
import RootComponent from './components/RootComponent/RootComponent';
import TrashQuestionsList from './components/TrashQuestionsList/TrashQuestionsList.js';

const router = createBrowserRouter([
	{
		path: '/',
		element: <RootComponent />,
		children: [
			{ path: '/questions-list', element: <QuestionsList /> },
			{ path: '/deleted-questions-list', element: <TrashQuestionsList /> },
			{ path: '/question-form', element: <AddQuestionForm /> },
			{ path: '/edit-question-form', element: <EditQuestionForm /> },
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
