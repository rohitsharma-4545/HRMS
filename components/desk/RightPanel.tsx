import CelebrationsCard from "./CelebrationsCard";
import ImportantLinks from "./ImportantLinks";
import HolidayCard from "./HolidayCard";

export type Employee = {
  id: string;
  employeeCode: string;
  firstName: string;
  lastName: string;
  designation?: string | null;
  user?: {
    email?: string | null;
    phone?: string | null;
  };
  department?: {
    name: string;
  } | null;
};

type CelebrationBucket = {
  today: Employee[];
  upcoming: Employee[];
};

type Celebrations = {
  birthdays: CelebrationBucket;
  workAnniversary: CelebrationBucket;
  marriageAnniversary: CelebrationBucket;
};

export default function RightPanel({
  celebrations,
  empCode,
  holidays,
}: {
  celebrations: Celebrations;
  empCode: string;
  holidays: any[];
}) {
  return (
    <div className="space-y-6">
      <CelebrationsCard data={celebrations} />
      <HolidayCard holidays={holidays} />
      <ImportantLinks empCode={empCode} />
    </div>
  );
}
