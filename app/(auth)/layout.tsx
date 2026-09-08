import { Footer } from "@/components/shared/footer";
import { ServerHeader } from "@/components/shared/ServerHeader";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <ServerHeader />
      <div className="flex-1">{children}</div>
      <Footer />
    </div>
  );
}
