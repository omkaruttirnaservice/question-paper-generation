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
				className="transition-all duration-300 text-gray-700 !mb-1  block text-sm"
			>
				{label}
			</label>
			<input
				type={type}
				id={name}
				className={`!w-full border focus:ring-2 focus:outline-4 outline-none transition-all duration-300 disabled:bg-gray-400/40 ${
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

export function InputSelect({
	label,
	name,
	value = '',
	onChange,
	className,
	disabled = false,
	type = 'text',
	error = false,
	children,
}) {
	return (
		<div className={`relative ${className}`}>
			<label
				htmlFor={name}
				className="transition-all duration-300 text-gray-700 !mb-1  block text-sm"
			>
				{label}
			</label>
			<select
				type={type}
				id={name}
				className={`!w-full border focus:ring-2 focus:outline-4 outline-none transition-all duration-300 disabled:bg-gray-400/40 ${
					error ? 'ring ring-red-300' : ''
				}`}
				placeholder={label}
				name={name}
				value={value}
				onChange={onChange}
				disabled={disabled}
			>
				{children}
			</select>
		</div>
	);
}

export function InputLabel({ name = '', icon, className = '', onClick }) {
	return (
		<>
			<label
				htmlFor=""
				className={`transition-all duration-300 text-gray-700 !mb-1 flex items-center cursor-pointer gap-2 ${className}`}
			>
				<span>{name}</span>
				{icon && (
					<span
						className="hover:bg-slate-200 p-1 transition-all duration-300 "
						onClick={onClick}
					>
						{icon}
					</span>
				)}
			</label>
		</>
	);
}
