import {
  LayoutDashboard,
  User,
  Clock,
  CalendarCheck,
  CalendarDays,
  Wallet,
  Shield,
  Users,
  Megaphone,
  Calendar,
} from "lucide-react";

export const NAV_ITEMS = [
  { name: "My Desk", href: "/", icon: LayoutDashboard },
  { name: "Profile", href: "/profile", icon: User },
  { name: "Attendance", href: "/attendance", icon: Clock },
  { name: "Leave", href: "/leave", icon: CalendarCheck },
  { name: "Holiday", href: "/holiday", icon: CalendarDays },
  { name: "Payroll", href: "/payroll", icon: Wallet },

  {
    name: "Admin",
    icon: Shield,
    permission: "ADMIN_ACCESS",
    href: "/admin",
    children: [
      {
        name: "Employees",
        href: "/admin/employees",
        icon: Users,
        permission: "EMPLOYEE_READ",
      },
      {
        name: "Holidays",
        href: "/admin/holidays",
        icon: CalendarDays,
        permission: "EMPLOYEE_READ",
      },
      {
        name: "Notices",
        href: "/admin/notices",
        icon: Megaphone,
        permission: "EMPLOYEE_READ",
      },
      {
        name: "leaves",
        href: "/admin/leaves",
        icon: CalendarCheck,
        permission: "EMPLOYEE_READ",
      },
      {
        name: "Data Cleanup",
        href: "/admin/cleanup",
        icon: Calendar,
        permission: "ADMIN_ACCESS",
      },
    ],
  },
];
