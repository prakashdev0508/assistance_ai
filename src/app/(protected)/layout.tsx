import { getServerSession } from "next-auth";
import { authOptions } from "~/lib/auth";
import { redirect } from "next/navigation";
import Sidebar from "~/components/dashboard/Sidebar";

export default async function ProtectedGroupLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions);
  if (!session) {
    redirect("/login");
  }
  return (
    <div className="flex min-h-screen bg-white text-black">
      <div className="hidden md:block">
        <div className="fixed inset-y-0 left-0 w-20">
          <Sidebar />
        </div>
      </div>
      <div className="flex min-h-screen flex-1 flex-col px-4 py-6 md:ml-24 md:px-8">
        <main className="flex-1">{children}</main>
      </div>
    </div>
  );
}


