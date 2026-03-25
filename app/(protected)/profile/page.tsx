import { notFound } from "next/navigation";
import { getCurrentEmployee } from "@/modules/auth/auth-context.service";
import { getEmployeeProfile } from "@/modules/profile/profile.service";
import { buildSelfProfile } from "@/modules/profile/profile.visibilty";
import ProfileView from "@/components/profile/ProfileView";

export default async function MyProfilePage() {
  const { employee } = await getCurrentEmployee();

  if (!employee) return notFound();

  const profile = await getEmployeeProfile(employee.employeeCode);

  if (!profile) return notFound();

  const visibleProfile = buildSelfProfile(profile);

  return <ProfileView profile={visibleProfile} isSelf />;
}
