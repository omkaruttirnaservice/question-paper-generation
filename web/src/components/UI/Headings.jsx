export function H1({ children, className }) {
  return <h1 className={`heading-1__dark ${className}`}>{children}</h1>;
}

export function H2({ children, className }) {
  return <h2 className={`heading-2__dark ${className}`}>{children}</h2>;
}

export function H3({ children, className }) {
  return <h3 className={`heading-3__dark ${className} `}>{children}</h3>;
}
