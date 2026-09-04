import { redirect } from "next/navigation";
import { getServerSession } from "@/lib/session";
import { AuthPanel } from "@/components/auth/auth-panel";
import { LoginForm } from "@/components/auth/login-form";

export const metadata = { title: "ورود" };

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const session = await getServerSession();
  const { next } = await searchParams;
  if (session) redirect(next || "/account");

  return (
    <AuthPanel mode="login" next={next || "/account"}>
      <LoginForm next={next || "/account"} />
    </AuthPanel>
  );
}
