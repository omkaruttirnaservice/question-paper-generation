export const toYYYYMMDD = (_date) => {
	let [date, month, year] = _date.split('-');
	if (month >= 9) {
		month = `0${month}`;
	}
	return `${year}-${month}-${date}`;
};

export const toDDMMYYYY = (_date) => {
	let [year, month, date] = _date.split('-');
	if (month >= 9) {
		month = `0${month}`;
	}
	return `${date}-${month}-${year}`;
};
