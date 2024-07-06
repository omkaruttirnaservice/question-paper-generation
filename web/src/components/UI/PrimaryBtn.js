import { AiOutlineLoading3Quarters } from "react-icons/ai";
export default function PrimaryBtn({
  children,
  className,
  onClick,
  icon,
  type = "button",
  isLoading = false,
}) {
  return (
    <>
      <button
        className={`${className} btn--primary flex items-center gap-1`}
        type={type}
        onClick={onClick}>
        <span className="flex items-center gap-2">
          {children} {!icon ? "" : icon}
        </span>
        {isLoading && <AiOutlineLoading3Quarters className="animate-spin" />}
      </button>
    </>
  );
}
