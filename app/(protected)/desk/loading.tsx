export default function Loading() {
  return (
    <div className="grid grid-cols-12 gap-6 animate-pulse">
      <div className="col-span-8 space-y-6">
        <div className="h-24 bg-gray-200 rounded-2xl" />
        <div className="h-80 bg-gray-200 rounded-2xl" />
        <div className="h-32 bg-gray-200 rounded-2xl" />
      </div>

      <div className="col-span-4 space-y-6">
        <div className="h-48 bg-gray-200 rounded-2xl" />
        <div className="h-40 bg-gray-200 rounded-2xl" />
        <div className="h-40 bg-gray-200 rounded-2xl" />
      </div>
    </div>
  );
}
