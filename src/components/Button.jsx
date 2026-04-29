export function Button({ children, variant = 'primary', type = 'button', className = '', ...props }) {
  return (
    <button className={`button button-${variant} ${className}`.trim()} type={type} {...props}>
      {children}
    </button>
  );
}
