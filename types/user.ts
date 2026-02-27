export interface AppUser {
  userId: string;
  roles: string[];
  employeeId?: string | null;
  passwordChangeRequired?: boolean;
}
