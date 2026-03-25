export default function NoticeBoard() {
  return (
    <div className="bg-white rounded-2xl shadow-sm p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-slate-800">Noticeboard</h2>

        <button className="text-sm text-blue-600 hover:underline">
          View old notices
        </button>
      </div>

      <div className="bg-slate-100 rounded-xl p-4 text-center text-slate-600">
        No new notices
      </div>
    </div>
  );
}
