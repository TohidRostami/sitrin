import { Footer } from "@/components/shared/footer";
import { RouteTransitionProvider } from "@/components/shared/route-transition-provider";
import { ServerHeader } from "@/components/shared/ServerHeader";
export const dynamic = "force-dynamic";

export default function ShopLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <ServerHeader />
      <main className="flex-1">
        <RouteTransitionProvider>{children}</RouteTransitionProvider>
      </main>
      <Footer />
    </div>
  );
}
