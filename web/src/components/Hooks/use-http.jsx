import { useDispatch } from 'react-redux';
import { loaderActions } from '../../Store/loader-slice.jsx';
import { toast } from 'react-toastify';
import { useState } from 'react';
const useHttp = () => {
    const dispatch = useDispatch();
    const [isLoading, setIsLoading] = useState(false);

    const sendRequest = async (requestData, callback) => {
        setIsLoading(true);
        try {
            dispatch(loaderActions.showLoader());
            let res = await fetch(requestData.url, {
                method: requestData.method ? requestData.method : 'GET',
                // headers: requestData.headers ? requestData.headers : {},
                headers: {
                    'Content-Type': 'application/json',
                    ...requestData.headers,
                },
                body: requestData.body ? requestData.body : null,
            });
            const data = await res.json();
            if (!res.ok) {
                throw new Error(data?.usrMsg || data?.message || 'Request failed');
            }

            toast(data?.message || 'Success');

            dispatch(loaderActions.hideLoader());
            // THIS FUNCTION IS FOR GETTING RESPONSE RECIVED FROM THE REQUEST
            callback(data);
        } catch (err) {
            console.log(err.message);
            dispatch(loaderActions.hideLoader());
            if (err.message == 'Failed to fetch') {
                console.log('Unable to connect to backend');
                toast('Unable to connect to backend');
            } else {
                toast(err?.message || 'Something went wrong.');
            }
        } finally {
            setIsLoading(false);
        }
    };
    return {
        sendRequest,
        isLoading,
    };
};

export default useHttp;
