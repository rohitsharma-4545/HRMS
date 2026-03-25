import { getDeskData } from "@/modules/desk/desk.service";
import DepartmentPresence from "@/components/desk/DepartmentPresence";
import RightPanel from "@/components/desk/RightPanel";
import NoticeBoard from "@/components/desk/NoticeBoard";
import NewJoinees from "@/components/desk/NewJoinees";
import { getCurrentEmployee } from "@/modules/auth/auth-context.service";

export default async function DeskPage() {
  const { employee } = await getCurrentEmployee();

  const data = await getDeskData(employee.departmentId!);

  // console.log(data);

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-8 space-y-6">
          <NoticeBoard />
          <DepartmentPresence
            data={data.departmentEmployees}
            leaves={data.leavesToday}
          />
          <NewJoinees />
        </div>

        <div className="col-span-4">
          <RightPanel
            holidays={data.holidays}
            empCode={employee.employeeCode}
          />
        </div>
      </div>
    </div>
  );
}
