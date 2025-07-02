export const getRandomNumber = (start, end) => {
    return Math.floor(Math.random() * start) + end;
};

export const removeTrailingSlash = (url) => {
    // eg. http://localhost:3001/
    if (url.endsWith('/')) {
        return removeTrailingSlash(url.slice(0, -1));
    }
    return url;
};

export const toDDMMYYYY = (date, seperator = '-') => {
    const [_year, _month, _date] = date.split(seperator);
    return `${_date}${seperator}${_month}${seperator}${_year}`;
};

export const toYYYYMMDD = (date, seperator = '-') => {
    const [_date, _month, _year] = date.split(seperator);
    return `${_year}${seperator}${_month}${seperator}${_date}`;
};
