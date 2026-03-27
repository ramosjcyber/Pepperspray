export function Badge({ className = "", ...props }) {
  return (
    <span
      className={`inline-flex items-center text-xs font-medium ${className}`}
      {...props}
    />
  );
}
