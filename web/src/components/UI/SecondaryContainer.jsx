export default function SecondaryContainer({ children, className, onClick }) {
  return (
    <div
      onClick={onClick}
      className={`${className} c-container__2`}>
      {children}
    </div>
  );
}
