export default function Input({
    label,
    placeholder,
    name,
    value = '',
    onChange,
    onBlur,
    className,
    disabled = false,
    type = 'text',
    error = false,
    children,
    icon
}) {
    const inputPlaceholder = placeholder || label;

    return (
        <div className={`flex flex-col gap-1.5 ${className}`}>
            {label && (
                <label
                    htmlFor={name}
                    className="text-[0.7rem] font-black text-slate-500 uppercase tracking-wider px-1">
                    {label}
                </label>
            )}
            <div className="relative flex items-center">
                {icon && (
                    <span className="absolute left-4 text-slate-400 text-lg">
                        {icon}
                    </span>
                )}
                <input
                    type={type}
                    id={name}
                    className={`w-full bg-slate-50 border border-slate-200 rounded-2xl py-3.5 px-5 outline-none transition-all duration-300 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 disabled:opacity-50 text-slate-800 font-medium placeholder:text-slate-400 ${
                        icon ? 'pl-12' : ''
                    } ${error ? 'border-red-400 ring-4 ring-red-400/10' : ''}`}
                    placeholder={inputPlaceholder}
                    name={name}
                    value={value}
                    onChange={onChange}
                    onBlur={onBlur}
                    disabled={disabled}
                />
                {children}
            </div>
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
    error = false,
    children,
}) {
    return (
        <div className={`flex flex-col gap-1.5 ${className}`}>
            {label && (
                <label
                    htmlFor={name}
                    className="text-[0.7rem] font-black text-slate-500 uppercase tracking-wider px-1">
                    {label}
                </label>
            )}
            <select
                id={name}
                className={`w-full bg-slate-50 border border-slate-200 rounded-2xl py-3.5 px-5 outline-none transition-all duration-300 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 disabled:opacity-50 text-slate-800 font-medium appearance-none ${
                    error ? 'border-red-400 ring-4 ring-red-400/10' : ''
                }`}
                name={name}
                value={value}
                onChange={onChange}
                onBlur={onBlur}
                disabled={disabled}
            >
                {children}
            </select>
        </div>
    );
}

export function InputLabel({ name = '', icon, className = '', onClick, htmlFor = '' }) {
    return (
        <label
            htmlFor={htmlFor}
            className={`text-[0.7rem] font-black text-slate-500 uppercase tracking-wider flex items-center gap-2 ${className}`}>
            <span>{name}</span>
            {icon && (
                <span
                    className="hover:bg-slate-200 p-1 rounded-lg transition-all duration-300"
                    onClick={onClick}>
                    {icon}
                </span>
            )}
        </label>
    );
}
