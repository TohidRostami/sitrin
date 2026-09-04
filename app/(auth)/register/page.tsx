import { redirect } from "next/navigation";
import { getServerSession } from "@/lib/session";
import { AuthPanel } from "@/components/auth/auth-panel";
import { RegisterForm } from "@/components/auth/register-form";

export const metadata = { title: "ثبت‌نام" };

export default async function RegisterPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const session = await getServerSession();
  const { next } = await searchParams;
  if (session) redirect(next || "/account");

  return (
    <AuthPanel mode="register" next={next || "/account"}>
      <RegisterForm next={next || "/account"} />
    </AuthPanel>
  );
}
