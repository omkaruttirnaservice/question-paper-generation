/** @type {import('tailwindcss').Config} */
module.exports = {
	content: ['./src/**/*.{js,jsx,ts,tsx}'],
	theme: {
		extend: {
			colors: {
				'primary-shade-1': '#c7da40',
				'primary-color': '#4F8BB1',
				'primary-tint-1': '#eef9a3',
				// 'primary-tint-1': '#e6eef6',
				'primary-tint-2': '#f5fbc8',

				'primary-dark-color': '#0E0E0E',

				'primary-dark-tint-1': '#3D3D3D',
				'primary-dark-tint-2': '#1F1F1F',
			},
		},
	},
	plugins: [],
};
