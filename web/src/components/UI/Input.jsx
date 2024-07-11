export default function Input({
	label,
	name,
	value = '',
	onChange,
	className,
	disabled = false,
	type = 'text',
	error = false,
}) {
	return (
		<div className={`relative ${className}`}>
			<label
				htmlFor={name}
				className="transition-all duration-300 text-gray-700 !mb-1  block">
				{label}
			</label>
			<input
				type={type}
				id={name}
				className={`!w-full px-1 py-2 border focus:ring-2 focus:outline-4 outline-none transition-all duration-300 disabled:bg-gray-400/40 ${
					error ? 'ring ring-red-300' : ''
				}`}
				placeholder={label}
				name={name}
				value={value}
				onChange={onChange}
				disabled={disabled}
			/>
		</div>
	);
}
