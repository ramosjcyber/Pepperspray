export function Input({ className = "", ...props }) {
  return (
    <input
      className={`w-full px-4 py-3 text-sm outline-none ${className}`}
      {...props}
    />
  );
}
