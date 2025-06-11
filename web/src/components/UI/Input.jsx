export default function Input({
    label,
    name,
    value = '',
    onChange,
    onBlur,
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
                className="transition-all duration-300 text-gray-700 !mb-1  block text-sm">
                {label}
            </label>
            {/* <InputLabel name={name} label={label} /> */}
            <input
                type={type}
                id={name}
                className={`!w-full border focus:ring-2 p-2 focus:outline-4 outline-none transition-all duration-300 disabled:bg-gray-400/40 ${
                    error ? 'ring ring-red-300' : ''
                }`}
                placeholder={label}
                name={name}
                value={value}
                onChange={onChange}
                onBlur={onBlur}
                disabled={disabled}
            />
            {children}
        </div>
    );
}

export function InputSelect({
    label,
    name,
    value = '',
    onChange,
    onBlur,
    className,
    disabled = false,
    type = 'text',
    error = false,
    children,
}) {
    return (
        <div className={`relative ${className}`}>
            {/* <label
				htmlFor={name}
				className="transition-all duration-300 text-gray-700 !mb-1  block text-sm"
			>
				{label}
			</label> */}
            <InputLabel name={name} />
            <select
                type={type}
                id={name}
                className={`!w-full border focus:ring-2 p-2 focus:outline-4 outline-none transition-all duration-300 disabled:bg-gray-400/40 ${
                    error ? 'ring ring-red-300' : ''
                }`}
                placeholder={label}
                name={name}
                value={value}
                onChange={onChange}
                onBlur={onBlur}
                disabled={disabled}>
                {children}
            </select>
        </div>
    );
}

export function InputLabel({ name = '', icon, className = '', onClick, htmlFor = '' }) {
    return (
        <>
            <label
                htmlFor={htmlFor}
                className={`transition-all duration-300 text-gray-700 !mb-1 flex items-center cursor-pointer gap-2 ${className}`}>
                <span>{name}</span>
                {icon && (
                    <span
                        className="hover:bg-slate-200 p-1 transition-all duration-300 "
                        onClick={onClick}>
                        {icon}
                    </span>
                )}
            </label>
        </>
    );
}
