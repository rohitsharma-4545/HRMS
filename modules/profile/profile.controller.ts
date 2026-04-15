import { getCurrentEmployee } from "../auth/auth-context.service";
import {
  upsertPersonalProfile,
  upsertAddress,
  upsertContact,
  upsertDependent,
  deleteDependent,
  deleteAddress,
  deleteContact,
  upsertWorkProfile,
} from "./profile.service";

export async function updateProfileSection(section: string, data: any) {
  const { employee } = await getCurrentEmployee();

  switch (section) {
    case "ABOUT":
      return upsertPersonalProfile(employee.id, data);

    case "BIODATA":
      return upsertPersonalProfile(employee.id, data);

    case "IMPORTANT_DATES":
      return upsertPersonalProfile(employee.id, data);

    case "ADDRESS":
      return upsertAddress(employee.id, data);

    case "CONTACT":
      return upsertContact(employee.id, data);

    case "DEPENDENTS":
      return upsertDependent(employee.id, data);

    case "DELETE_DEPENDENT":
      return deleteDependent(employee.id, data.id);

    case "DELETE_ADDRESS":
      return deleteAddress(employee.id, data.id);

    case "DELETE_CONTACT":
      return deleteContact(employee.id, data.id);

    case "WORK_PROFILE":
      return upsertWorkProfile(employee.id, data);

    default:
      throw new Error("Invalid profile section");
  }
}
