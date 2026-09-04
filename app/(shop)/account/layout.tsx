import { redirect } from "next/navigation";
import { getServerSession } from "@/lib/session";
import { AccountSidebar } from "@/components/account/account-sidebar";

export default async function AccountLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession();
  if (!session) redirect("/login?next=/account");

  return (
    <main className="mx-auto max-w-[1180px] px-4 py-8 sm:px-6 md:px-10 md:py-12">
      <div className="flex flex-wrap items-start gap-5.5">
        <AccountSidebar name={session.user.name} subtitle="عضو باشگاه سیترین" />
        <div className="min-w-0 flex-[999_1_420px]">{children}</div>
      </div>
    </main>
  );
}
