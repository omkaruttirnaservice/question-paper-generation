import React from 'react';

import './loader.css';

const Loader = () => {
    return (
        <>
            <div className="d-flex justify-content-center">
                <div className="spinner-border" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        </>
    );
};

export default Loader;
