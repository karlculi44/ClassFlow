import Skeleton from "./Skeleton";

function CardSkeleton({ rows = 3 }) {
  return (
    <div className="rounded-2xl border border-gray-800 bg-gray-900 p-5 shadow-lg shadow-black/10">
      <div className="flex items-start justify-between gap-4">
        <Skeleton className="h-2 w-12 rounded-full" />
        <Skeleton className="h-6 w-16 rounded-full" />
      </div>
      <Skeleton className="mt-5 h-3 w-20" />
      <Skeleton className="mt-2 h-6 w-3/4" />
      <div className="mt-5 space-y-3">
        {Array.from({ length: rows }, (_, index) => (
          <div key={index} className="flex items-center justify-between gap-4">
            <Skeleton className="h-3 w-20" />
            <Skeleton className="h-3 w-28" />
          </div>
        ))}
      </div>
      <Skeleton className="mt-6 h-10 w-full rounded-lg" />
    </div>
  );
}

export default CardSkeleton;
