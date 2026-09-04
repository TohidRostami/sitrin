import { Footer } from "@/components/shared/footer";
import { ServerHeader } from "@/components/shared/ServerHeader";

export default function ShopLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <ServerHeader />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
