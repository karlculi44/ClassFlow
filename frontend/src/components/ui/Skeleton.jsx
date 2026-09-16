import SkeletonPrimitive from "react-loading-skeleton";

function Skeleton({ className = "", ...props }) {
  return (
    <SkeletonPrimitive
      aria-hidden="true"
      baseColor="var(--skeleton-base-color)"
      highlightColor="var(--skeleton-highlight-color)"
      className={`rounded-md ${className}`}
      {...props}
    />
  );
}

export default Skeleton;
