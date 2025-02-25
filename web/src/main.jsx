import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import App from './App.jsx';
import './index.css';
import { store } from './Store/redux-store.jsx';

import {
	MutationCache,
	QueryCache,
	QueryClient,
	QueryClientProvider,
} from '@tanstack/react-query';
import { toast } from 'react-toastify';

import axios from 'axios';

const axiosInstance = axios.create({
	baseUrl: 'http://129.23.4.1:3403/api/',
	headers: {
		Authorization: 'Bearer sdfjasldfjaklsghlksdhf',
	},
});

// request
// axiosInstance.interceptors.request.use(function(){}, function(){})
// response

const queryClient = new QueryClient({
	queryCache: new QueryCache({
		onError: (err) => {
			// do something with error
		},
	}),
	mutationCache: new MutationCache({
		onError: (err) => {
			// do something with error
		},
	}),
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
