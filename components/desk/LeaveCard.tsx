interface Props {
  leaves: any[];
}

export default function LeaveCard({ leaves }: Props) {
  return (
    <div className="bg-white rounded-2xl shadow-sm p-6 space-y-4">
      <h3 className="text-md font-semibold text-slate-800">On Leave Today</h3>

      {leaves.length === 0 ? (
        <div className="bg-slate-100 rounded-xl p-4 text-sm text-slate-600 text-center">
          No employees on leave
        </div>
      ) : (
        <div className="space-y-3">
          {leaves.map((leave) => (
            <div key={leave.id}>
              <p className="text-sm font-medium">
                {leave.employee.firstName} {leave.employee.lastName}
              </p>
              <p className="text-xs text-slate-500">{leave.type} Leave</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
