import { LoaderCircle } from "lucide-react";

function LoadingSpinner({ size = 18, label = "Loading" }) {
  return (
    <span
      role="status"
      aria-label={label}
      className="inline-flex items-center justify-center"
    >
      <LoaderCircle size={size} strokeWidth={2.2} className="animate-spin" />
      <span className="sr-only">{label}</span>
    </span>
  );
}

export default LoadingSpinner;
