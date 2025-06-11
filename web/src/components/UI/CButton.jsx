import { AiOutlineLoading3Quarters } from 'react-icons/ai';
export default function CButton({
    children,
    className,
    onClick,
    icon,
    type = 'button',
    varient = 'btn--primary',
    isLoading = false,
    disabled = false,
    disabledCursor = 'cursor-wait',
}) {
    return (
        <>
            <button
                className={`cd-btn  flex justify-center items-center gap-1 p-2 px-3 ${className} ${varient} disabled:hover:${disabledCursor}`}
                type={type}
                onClick={onClick}
                disabled={isLoading || disabled}>
                <span className="flex items-center gap-2 justify-center">
                    {!icon ? '' : icon} {children}
                </span>
                {isLoading && <AiOutlineLoading3Quarters className="animate-spin" />}
            </button>
        </>
    );
}
