import Sidebar from "~/components/dashboard/Sidebar";
import MobileMenu from "~/components/dashboard/MobileMenu";

export default function ProtectedGroupLayout({ children }: { children: React.ReactNode }) {
  // Session check is handled by middleware, no need to check again here
  return (
    <div className="flex min-h-screen bg-white text-black">
      <MobileMenu />
      <div className="hidden md:block">
        <div className="fixed inset-y-0 left-0 w-20">
          <Sidebar />
        </div>
      </div>
      <div className="flex min-h-screen flex-1 flex-col px-4 py-6 pt-16 md:ml-24 md:pt-6 md:px-8">
        <main className="flex-1">{children}</main>
      </div>
    </div>
  );
}


