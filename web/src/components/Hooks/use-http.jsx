import { useDispatch } from 'react-redux';
import { loaderActions } from '../../Store/loader-slice.jsx';
import { toast } from 'react-toastify';
import { useState, useCallback } from 'react';

const useHttp = () => {
    const dispatch = useDispatch();
    const [isLoading, setIsLoading] = useState(false);

    const sendRequest = useCallback(async (requestData, callback) => {
        setIsLoading(true);
        try {
            dispatch(loaderActions.showLoader());
            let res = await fetch(requestData.url, {
                method: requestData.method ? requestData.method : 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    ...requestData.headers,
                },
                body: requestData.body ? requestData.body : null,
                credentials: 'include',
            });
            if (!res.ok) {
                if (res.status === 404) {
                    throw new Error('Not found');
                } else {
                    const data = await res.json();
                    throw new Error(
                        data?.usrMsg || data?.message || 'Request failed'
                    );
                }
            }
            const data = await res.json();
            if (data?.message) toast(data?.message);

            dispatch(loaderActions.hideLoader());
            callback(data);
        } catch (err) {
            console.log(err, '----');
            dispatch(loaderActions.hideLoader());
            toast(err?.message || 'Unable to connect to backend');
        } finally {
            setIsLoading(false);
        }
    }, [dispatch]);

    return {
        sendRequest,
        isLoading,
    };
};

export default useHttp;
