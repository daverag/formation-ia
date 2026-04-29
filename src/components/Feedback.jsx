export function Feedback({ type = 'info', children }) {
  if (!children) return null;
  return <p className={`feedback feedback-${type}`}>{children}</p>;
}
