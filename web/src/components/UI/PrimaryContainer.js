export default function PrimaryContainer({ children, className, onClick }) {
  return (
    <div
      onClick={onClick}
      className={`${className} c-container__1`}>
      {children}
    </div>
  );
}
