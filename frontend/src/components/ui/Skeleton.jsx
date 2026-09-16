function Skeleton({ className = "" }) {
  return (
    <span
      aria-hidden="true"
      className={`block animate-pulse rounded-md bg-gray-800/80 ${className}`}
    />
  );
}

export default Skeleton;
