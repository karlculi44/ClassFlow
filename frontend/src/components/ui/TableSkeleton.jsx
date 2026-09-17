import Skeleton from "./Skeleton";

function TableSkeleton({ rows = 5, columns = 4 }) {
  return (
    <div
      className="overflow-hidden rounded-2xl border border-gray-800 bg-gray-900"
      role="status"
      aria-label="Loading table"
    >
      <div
        className="hidden gap-4 border-b border-gray-800 px-5 py-4 md:grid md:grid-cols-[repeat(var(--table-columns),minmax(0,1fr))]"
        style={{ "--table-columns": columns }}
      >
        {Array.from({ length: columns }, (_, index) => (
          <Skeleton
            key={index}
            className={`h-3 ${index === 0 ? "w-2/3" : "w-3/5"}`}
          />
        ))}
      </div>
      <div className="divide-y divide-gray-800">
        {Array.from({ length: rows }, (_, rowIndex) => (
          <div
            key={rowIndex}
            className="grid gap-3 px-5 py-5 md:grid-cols-[repeat(var(--table-columns),minmax(0,1fr))] md:items-center md:gap-4"
            style={{ "--table-columns": columns }}
          >
            <div className="space-y-2">
              <Skeleton className="h-4 w-3/5" />
              <Skeleton className="h-3 w-2/5 md:hidden" />
            </div>
            {Array.from(
              { length: Math.max(columns - 2, 1) },
              (_, columnIndex) => (
                <Skeleton
                  key={columnIndex}
                  className={`h-4 ${columnIndex === 0 ? "w-4/5" : "w-3/5"}`}
                />
              ),
            )}
            <Skeleton className="h-8 w-16 rounded-lg" />
          </div>
        ))}
      </div>
    </div>
  );
}

export default TableSkeleton;
