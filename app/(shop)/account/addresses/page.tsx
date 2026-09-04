import { getServerSession } from "@/lib/session";
import { listAddressesForUser } from "@/lib/queries/addresses";
import { AddressList } from "@/components/account/address-list";

export const metadata = { title: "آدرس‌های من" };

export default async function AddressesPage() {
  const session = await getServerSession();
  const addresses = await listAddressesForUser(session!.user.id);

  return <AddressList addresses={addresses} />;
}
