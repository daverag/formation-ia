export function Input({ label, id, textarea = false, ...props }) {
  return (
    <label className="field" htmlFor={id}>
      <span>{label}</span>
      {textarea ? <textarea id={id} {...props} /> : <input id={id} {...props} />}
    </label>
  );
}
