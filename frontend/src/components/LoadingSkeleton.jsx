export default function LoadingSkeleton() {
  return (
    <div className="bg-white rounded-2xl shadow-soft p-5 animate-pulse">
      <div className="h-48 bg-gray-200 rounded-xl"></div>
      <div className="mt-4 space-y-3">
        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        <div className="h-6 bg-gray-300 rounded w-1/3"></div>
      </div>
    </div>
  );
}
