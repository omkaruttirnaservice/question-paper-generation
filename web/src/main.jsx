import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import App from './App.jsx';
import './index.css';
import { store } from './Store/redux-store.jsx';

import { QueryCache, QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { toast } from 'react-toastify';
const queryClient = new QueryClient({
	// queryCache: new QueryCache({
	// 	onError: (error)=>{
	// 		toast.error(`Something went wrong: ${error.message}`)
	// 	}
	// })
});

ReactDOM.createRoot(document.getElementById('root')).render(
	<>
		<QueryClientProvider client={queryClient}>
			<Provider store={store}>
				<App />
			</Provider>
		</QueryClientProvider>
	</>
);
