"use client";
import Link from "next/link";
import React from "react";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";

const navItems = [
  {
    href: "/dashboard",
    label: "Dashboard",
    icon: (
      <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
        <path
          d="M4 12c0-4.4 3.6-8 8-8s8 3.6 8 8v7H4v-7Z"
          fill="currentColor"
          opacity="0.5"
        />
        <path
          d="M10 12V7a2 2 0 1 1 4 0v5"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
    ),
  },
  {
    href: "/task",
    label: "Tasks",
    icon: (
      <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
        <path
          d="M5 6h14v12H5z"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
        <path
          d="m8 12 2 2 4-4"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  {
    href: "/plan",
    label: "Plan",
    icon: (
      <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
        <path
          d="M7 4h10v4H7zM5 8h14v12H5z"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
      </svg>
    ),
  },
  {
    href: "/calendar",
    label: "Calendar",
    icon: (
      <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
        <path
          d="M7 4h10v4H7zM5 8h14v12H5z"
          fill="currentColor"
        />
      </svg>
    ),
  },
  {
    href: "/integrations",
    label: "Integrations",
    icon: (
      <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
        <path
          d="M6 9h12M6 15h12M9 6v12M15 6v12"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
    ),
  },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden h-full w-20 shrink-0 flex-col justify-between bg-gray-100 px-2 py-6 md:flex">
      <div className="flex flex-col items-center gap-8">
        <Link
          href="/"
          className="flex h-10 w-10 items-center justify-center rounded-2xl bg-black/5 text-black/80"
        >
          <span className="text-lg font-semibold">Æ</span>
        </Link>
        <nav className="flex flex-col items-center gap-3">
          {navItems.map((item) => {
            const active = pathname === item.href;
            return (
              <div key={item.href} className="group relative">
                <Link
                  href={item.href}
                  className={`flex h-11 w-11 items-center justify-center rounded-2xl transition ${active
                      ? "bg-black text-white shadow-[0_12px_30px_-12px_rgba(0,0,0,0.3)]"
                      : "bg-white text-black/60 hover:bg-black/5 hover:text-black/80"
                    }`}
                  aria-label={item.label}
                >
                  {item.icon}
                </Link>
                <span className="pointer-events-none absolute left-[60px] top-1/2 -translate-y-1/2 rounded-full bg-black px-3 py-1 text-xs font-medium text-white opacity-0 shadow group-hover:opacity-100">
                  {item.label}
                </span>
              </div>
            );
          })}
        </nav>
      </div>
      <div className="flex flex-col items-center gap-4">
        <button className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white text-black/60 hover:bg-black/5 hover:text-black/80">
          <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
            <path
              d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm7 0a7 7 0 0 1-14 0"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        </button>
        <div className="group relative">
          <button
            onClick={() => signOut({ callbackUrl: "/" })}
            className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white text-black/60 transition hover:bg-red-50 hover:text-red-600"
            aria-label="Logout"
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
          </button>
          <span className="pointer-events-none absolute left-[60px] top-1/2 -translate-y-1/2 rounded-full bg-black px-3 py-1 text-xs font-medium text-white opacity-0 shadow group-hover:opacity-100">
            Logout
          </span>
        </div>
      </div>
    </aside>
  );
}


