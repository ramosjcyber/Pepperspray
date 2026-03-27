export function Button({ className = "", variant = "default", ...props }) {
  const base = "inline-flex items-center justify-center text-sm font-medium transition disabled:pointer-events-none disabled:opacity-50";
  const variants = {
    default: "bg-black text-white hover:opacity-90",
    outline: "border border-zinc-300 bg-white text-zinc-900 hover:bg-zinc-50",
  };

  return (
    <button
      className={`${base} ${variants[variant] || variants.default} ${className}`}
      {...props}
    />
  );
}
