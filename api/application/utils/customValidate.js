const customValidate = {
    isNonEmptyNullString: (_string) => {
        return _string !== null && _string !== undefined && typeof _string === 'string' && _string.trim() !== "";
    },

    getJoinedString: (_string) => {
        if (typeof _string === 'string') {
            return _string.trim().split(/\s+/).join(' ');
        }
    },
    
    isNumber(_number) {
        return typeof _number === 'number' && !isNaN(_number);
    }
};

export default customValidate;
