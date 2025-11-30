"use client";
import Link from "next/link";
import React, { useState } from "react";
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
  // {
  //   href: "/plan",
  //   label: "Plan",
  //   icon: (
  //     <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
  //       <path
  //         d="M7 4h10v4H7zM5 8h14v12H5z"
  //         stroke="currentColor"
  //         strokeWidth="2"
  //         strokeLinecap="round"
  //         strokeLinejoin="round"
  //         fill="none"
  //       />
  //     </svg>
  //   ),
  // },
  {
    href: "/goals",
    label: "Goals",
    icon: (
      <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  {
    href: "/chat",
    label: "Chat",
    icon: (
      <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
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
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      await signOut({ callbackUrl: "/" });
    } catch (error) {
      console.error("Error signing out:", error);
      setIsLoggingOut(false);
    }
  };

  return (
    <aside className="hidden h-full w-20 shrink-0 flex-col justify-between bg-gray-100 px-2 py-6 md:flex">
      <div className="flex flex-col items-center gap-8">
        <Link
          href="/"
          className="flex h-10 w-10 items-center justify-center rounded-2xl bg-black/5 text-black/80"
        >
          <span className="text-sm font-semibold">MA</span>
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
        <div className="group relative">
          <Link
            href="/settings"
            className={`flex h-10 w-10 items-center justify-center rounded-2xl transition ${pathname === "/settings"
                ? "bg-black text-white shadow-[0_12px_30px_-12px_rgba(0,0,0,0.3)]"
                : "bg-white text-black/60 hover:bg-black/5 hover:text-black/80"
              }`}
            aria-label="Settings"
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
              <circle cx="12" cy="12" r="3" />
            </svg>
          </Link>
          <span className="pointer-events-none absolute left-[60px] top-1/2 -translate-y-1/2 rounded-full bg-black px-3 py-1 text-xs font-medium text-white opacity-0 shadow group-hover:opacity-100">
            Settings
          </span>
        </div>
        <div className="group relative">
          <button
            onClick={handleLogout}
            disabled={isLoggingOut}
            className={`flex h-10 w-10 items-center justify-center rounded-2xl bg-white text-black/60 transition hover:bg-red-50 hover:text-red-600 disabled:opacity-50 disabled:cursor-not-allowed`}
            aria-label="Logout"
          >
            {isLoggingOut ? (
              <svg className="h-5 w-5 animate-spin text-red-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 0 1 8-8v4a4 4 0 0 0-4 4H4z" />
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                <polyline points="16 17 21 12 16 7" />
                <line x1="21" y1="12" x2="9" y2="12" />
              </svg>
            )}
          </button>
          <span className="pointer-events-none absolute left-[60px] top-1/2 -translate-y-1/2 rounded-full bg-black px-3 py-1 text-xs font-medium text-white opacity-0 shadow group-hover:opacity-100">
            {isLoggingOut ? "Logging out..." : "Logout"}
          </span>
        </div>
      </div>
    </aside>
  );
}


