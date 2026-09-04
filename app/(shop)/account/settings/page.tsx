import { getServerSession } from "@/lib/session";
import { SettingsForm } from "@/components/account/settings-form";

export const metadata = { title: "تنظیمات" };

export default async function SettingsPage() {
  const session = await getServerSession();
  const user = session!.user;

  return (
    <SettingsForm
      name={user.name}
      email={user.email}
      phoneNumber={user.phoneNumber ?? null}
      phoneNumberVerified={user.phoneNumberVerified ?? false}
    />
  );
}
