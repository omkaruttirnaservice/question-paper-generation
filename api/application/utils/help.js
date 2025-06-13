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
