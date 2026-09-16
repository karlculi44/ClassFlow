import CardSkeleton from "./CardSkeleton";
import ListSkeleton from "./ListSkeleton";
import Skeleton from "./Skeleton";
import TableSkeleton from "./TableSkeleton";

function PageSkeleton({ variant = "cards" }) {
  if (variant === "table") {
    return <TableSkeleton />;
  }

  if (variant === "list") {
    return <ListSkeleton />;
  }

  if (variant === "detail") {
    return (
      <div className="space-y-6">
        <div className="rounded-2xl border border-gray-800 bg-gray-900 p-6">
          <Skeleton className="h-3 w-24" />
          <Skeleton className="mt-3 h-8 w-2/3 max-w-md" />
          <Skeleton className="mt-3 h-4 w-full max-w-xl" />
          <Skeleton className="mt-2 h-4 w-4/5 max-w-lg" />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <CardSkeleton rows={2} />
          <CardSkeleton rows={2} />
        </div>
      </div>
    );
  }

  if (variant === "dashboard") {
    return (
      <div className="space-y-6">
        <div>
          <Skeleton className="h-8 w-56" />
          <Skeleton className="mt-3 h-4 w-80 max-w-full" />
        </div>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 4 }, (_, index) => (
            <CardSkeleton key={index} rows={1} />
          ))}
        </div>
        <div className="grid gap-6 xl:grid-cols-2">
          <CardSkeleton rows={4} />
          <CardSkeleton rows={4} />
        </div>
      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {Array.from({ length: 6 }, (_, index) => (
        <CardSkeleton key={index} />
      ))}
    </div>
  );
}

export default PageSkeleton;
