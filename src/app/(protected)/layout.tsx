import { getServerSession } from "next-auth";
import { authOptions } from "~/lib/auth";
import { redirect } from "next/navigation";
import Sidebar from "~/components/dashboard/Sidebar";
import MobileMenu from "~/components/dashboard/MobileMenu";

export default async function ProtectedGroupLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions);
  
  // Only redirect if session is truly missing (middleware should handle most cases)
  // This is a safety check, but middleware is the primary protection
  if (!session?.user) {
    redirect("/login");
  }
  
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


