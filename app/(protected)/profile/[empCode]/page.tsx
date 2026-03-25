import { notFound } from "next/navigation";
import { getEmployeeProfile } from "@/modules/profile/profile.service";
import { buildPublicEmployeeProfile } from "@/modules/profile/profile.visibilty";
import ProfileView from "@/components/profile/ProfileView";

export default async function ProfilePage({
  params,
}: {
  params: Promise<{ empCode: string }>;
}) {
  const { empCode } = await params;
  const profile = await getEmployeeProfile(empCode);

  if (!profile) return notFound();

  const visibleProfile = buildPublicEmployeeProfile(profile);

  return <ProfileView profile={visibleProfile} />;
}
