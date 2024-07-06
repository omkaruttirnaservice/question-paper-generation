export function ProgressBar({ completed, total, unit }) {
  return (
    <div className="relative w-100 h-3 mt-10 mb-6">
      <span className="text-gray-300 absolute left-0 -top-7 text-sm">
        Your progress
      </span>
      <span className="text-gray-300 absolute right-0 -top-7 text-sm">
        Completed {completed}/{total} {unit}
      </span>
      <div className="absolute top-0 left-0 w-[100%] bg-gray-700 rounded-full h-3"></div>
      <div
        className={`absolute top-0 left-0 bg-gray-300 rounded-full h-3`}
        style={{ width: `${(completed / total) * 100}%` }}></div>
    </div>
  );
}
