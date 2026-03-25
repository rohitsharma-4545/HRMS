import { getCurrentEmployee } from "../auth/auth-context.service";
import {
  upsertPersonalProfile,
  upsertAddress,
  upsertContact,
} from "./profile.service";

export async function updateProfileSection(section: string, data: any) {
  const { employee } = await getCurrentEmployee();

  switch (section) {
    case "ABOUT":
      return upsertPersonalProfile(employee.id, data);

    case "ADDRESS":
      return upsertAddress(employee.id, data);

    case "CONTACT":
      return upsertContact(employee.id, data);

    default:
      throw new Error("Invalid profile section");
  }
}
