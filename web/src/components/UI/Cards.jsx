export function CardOne({ children, className, onClick }) {
  return (
    <div
      className={`c-card mb-6 ${className}`}
      onClick={onClick}>
      {children}
    </div>
  );
}

export function CardTwo({ children, className, onClick }) {
  return (
    <div
      className={`c-card mb-6 border-none bg-gradient-to-r from-pink-300 to-sky-300 shadow-md ${className}`}
      onClick={onClick}>
      {children}
    </div>
  );
}
