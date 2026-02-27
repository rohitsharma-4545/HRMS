import {
  LayoutDashboard,
  User,
  Clock,
  CalendarDays,
  CalendarCheck,
  Wallet,
} from "lucide-react";

export const NAV_ITEMS = [
  { name: "My Desk", href: "/", icon: LayoutDashboard },
  { name: "Profile", href: "/profile", icon: User },
  { name: "Attendance", href: "/attendance", icon: Clock },
  { name: "Leave", href: "/leave", icon: CalendarCheck },
  { name: "Holiday", href: "/holiday", icon: CalendarDays },
  { name: "Payroll", href: "/payroll", icon: Wallet },
];
