import LeaveBalanceCards from "@/components/leave/LeaveBalanceCards";
import ApplyLeaveDialog from "@/components/leave/ApplyLeaveDialog";
import LeaveHistoryTable from "@/components/leave/LeaveHistoryTable";

export default function LeavePage() {
  return (
    <div className="space-y-6">
      <LeaveBalanceCards />

      <div className="flex justify-end">
        <ApplyLeaveDialog />
      </div>

      <LeaveHistoryTable />
    </div>
  );
}
