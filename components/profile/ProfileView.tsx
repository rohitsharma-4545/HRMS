import ProfileHeaderSection from "./ProfileHeaderSection";
import BankingSection from "./BankingSection";
import DataSection from "./DataSection";

interface Props {
  profile: any;
  isSelf?: boolean;
}

export default function ProfileView({ profile, isSelf }: Props) {
  return (
    <div className="space-y-6">
      <ProfileHeaderSection data={profile} isSelf={isSelf} />

      {isSelf && (
        <BankingSection employeeId={profile.id} banks={profile.bankDetails} />
      )}

      <DataSection data={profile} isSelf={isSelf} />
    </div>
  );
}
