export default function HolidayCard({ holidays }: { holidays: any[] }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm p-6 space-y-4">
      <h3 className="text-md font-semibold text-slate-800">Holidays</h3>

      {holidays.length === 0 ? (
        <div className="bg-slate-100 rounded-xl p-4 text-sm text-slate-600 text-center">
          No holidays assigned
        </div>
      ) : (
        <div className="space-y-3">
          {holidays.map((holiday) => (
            <div key={holiday.id}>
              <p className="text-sm font-medium">{holiday.name}</p>
              <p className="text-xs text-slate-500">
                {new Date(holiday.date).toDateString()}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
