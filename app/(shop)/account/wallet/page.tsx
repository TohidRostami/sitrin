import { Wallet } from "lucide-react";
import { EmptyState } from "@/components/shared/empty-state";

export const metadata = { title: "کیف پول" };

export default function WalletPage() {
  return (
    <>
      <h1 className="sr-only">کیف پول</h1>
      <EmptyState
        icon={Wallet}
        title="کیف پول به‌زودی"
        description="این بخش هنوز به دیتابیس وصل نشده — schema.prisma فعلاً مدلی برای موجودی کیف پول ندارد."
      />
    </>
  );
}
