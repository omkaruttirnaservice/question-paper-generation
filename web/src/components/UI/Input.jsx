export default function Input({
	label,
	name,
	value = '',
	onChange,
	className,
}) {
	return (
		<div className={`relative ${className}`}>
			<label
				htmlFor={name}
				className="transition-all duration-300 text-gray-700 !mb-1  block">
				{label}
			</label>
			<input
				type="text"
				id={name}
				className="!w-full px-1 py-2 border focus:ring-2 focus:outline-4 outline-none transition-all duration-300"
				placeholder={label}
				name={name}
				value={value}
				onChange={onChange}
			/>
		</div>
	);
}
