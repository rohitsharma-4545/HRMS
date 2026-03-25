import CelebrationsCard from "./CelebrationsCard";
import ImportantLinks from "./ImportantLinks";
import HolidayCard from "./HolidayCard";

export default function RightPanel({
  empCode,
  holidays,
}: {
  empCode: string;
  holidays: any[];
}) {
  return (
    <div className="space-y-6">
      <CelebrationsCard />
      <HolidayCard holidays={holidays} />
      <ImportantLinks empCode={empCode} />
    </div>
  );
}
