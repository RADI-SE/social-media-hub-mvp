"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BarChart3,
  CalendarDays,
  CheckSquare2,
  FileText,
  LayoutDashboard,
  MessageCircleMore,
  PenLine,
} from "lucide-react";

const navItems = [
  { name: "Overview", href: "/home", icon: LayoutDashboard },
  { name: "Create post", href: "/create", icon: PenLine },
  { name: "Calendar", href: "/schedule", icon: CalendarDays },
  { name: "Posts", href: "/posts", icon: FileText },
  { name: "Comments", href: "/comments", icon: MessageCircleMore },
  { name: "Analytics", href: "/analytics", icon: BarChart3 },
  { name: "Tasks", href: "/tasks", icon: CheckSquare2 },
];

export default function SidebarHeader() {
  const pathname = usePathname();

  return (
    <nav className="mt-8" aria-label="Main navigation">
      <p className="px-3 text-[0.63rem] font-bold uppercase tracking-[0.2em] text-slate-400">Workspace</p>
      <ul className="mt-3 space-y-1.5">
        {navItems.map(({ name, href, icon: Icon }) => {
          const isActive = pathname === href;

          return (
            <li key={href}>
              <Link
                href={href}
                className={`group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium ${
                  isActive
                    ? "bg-[#173b9a] text-white shadow-[0_10px_22px_rgba(23,59,154,0.22)]"
                    : "text-slate-600 hover:bg-white/80 hover:text-[#173b9a]"
                }`}
              >
                <Icon size={17} strokeWidth={isActive ? 2.3 : 1.8} />
                <span>{name}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

