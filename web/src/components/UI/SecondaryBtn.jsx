import { AiOutlineLoading3Quarters } from "react-icons/ai";
export default function SecondaryBtn({
  children,
  className,
  onClick,
  icon,
  type = "button",
  isLoading = false,
}) {
  return (
    <button
      className={`${className} btn--secondary`}
      type={type}
      onClick={onClick}>
      {children} {!icon ? "" : icon}
      {isLoading && <AiOutlineLoading3Quarters className="animate-spin" />}
    </button>
  );
}
